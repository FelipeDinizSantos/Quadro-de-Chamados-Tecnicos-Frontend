'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import './RespostaChamado.css';

type Resposta = {
  id: number;
  mensagem: string;
  criado_em: string;
  autor_id: number;
  autor_nome: string;
};

type RespostasChamadoProps = {
  chamadoId: number;
  type: 'usuario om' | 'usuario tecnico' | 'admin/comando';
  status: string;
};

export default function RespostasChamado({ chamadoId, type, status }: RespostasChamadoProps) {
  const { isAuthenticated, user } = useAuth();

  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const statusBloqueado = status === 'concluido' || status === 'fechado';
  const podeEnviarResposta = type !== 'admin/comando' && !statusBloqueado;
  const podeAlterarStatus = type === 'usuario tecnico' || type === 'admin/comando';

  const fetchRespostas = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/respostas/${chamadoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Erro ao carregar respostas');
      const data = await res.json();
      setRespostas(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRespostas();
    }
  }, [isAuthenticated, chamadoId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchRespostas();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isAuthenticated, chamadoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setFeedback('');

    const token = localStorage.getItem('token');
    if (!token) {
      setFeedback('Token não encontrado.');
      setEnviando(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/respostas/${chamadoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensagem }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao enviar resposta');
      }

      setFeedback('Resposta enviada com sucesso!');
      setMensagem('');
      await fetchRespostas();
    } catch (err: any) {
      setFeedback(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const atualizarStatusChamado = async (novoStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFeedback('Token não encontrado.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chamados/${chamadoId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao atualizar status');
      }

      setFeedback('Status atualizado com sucesso!');
      await fetchRespostas();

      if (typeof window != "undefined") window.location.reload();
    } catch (err: any) {
      setFeedback(err.message);
    }
  };

  const handleChangeStatus = async (status: string) => {
    await atualizarStatusChamado(status);
    setShowStatusModal(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="respostas-container">
      <h3 className="respostas-title">Respostas</h3>

      <div className="respostas-historico">
        {respostas.length === 0 && (
          <p className="nenhuma-resposta">Nenhuma resposta ainda.</p>
        )}
        {respostas.map((r) => {
          const isMinha = r.autor_id === user?.id;
          return (
            <div
              key={r.id}
              className={`resposta-item ${isMinha ? 'minha' : 'outra'}`}
            >
              <div className="resposta-autor">{r.autor_nome}</div>
              <div className="resposta-mensagem">{r.mensagem}</div>
              <div className="resposta-data">
                {new Date(r.criado_em).toLocaleString('pt-BR')}
              </div>
            </div>
          );
        })}
      </div>

      {statusBloqueado ? (
        <>
          <p style={{ color: '#6b7280', marginTop: '1rem' }}>
            Não é possível adicionar novas respostas. O chamado está <strong>{status.replace('_', ' ')}</strong>.
          </p>

          {podeAlterarStatus && (
            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="botao-status"
                onClick={() => setShowStatusModal(true)}
              >
                Alterar Status
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {podeEnviarResposta && (
            <form className="resposta-form" onSubmit={handleSubmit}>
              <textarea
                className="resposta-textarea"
                placeholder="Escreva sua resposta..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                required
              ></textarea>

              <div className="botoes-acoes">
                <button type="submit" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          )}

          {podeAlterarStatus && (
            <div style={{ marginTop: podeEnviarResposta ? '1rem' : '0' }}>
              <button
                type="button"
                className="botao-status"
                onClick={() => setShowStatusModal(true)}
              >
                Alterar Status
              </button>
            </div>
          )}
        </>
      )}

      {feedback && (
        <p style={{ marginTop: '1rem', color: feedback.includes('sucesso') ? 'green' : 'red' }}>
          {feedback}
        </p>
      )}

      {showStatusModal && (
        <div className="status-modal-overlay">
          <div className="status-modal">
            <h4>Alterar Status do Chamado</h4>
            <button
              className="status-opcao status-opcao-andamento"
              onClick={() => handleChangeStatus('em_andamento')}
            >
              Em Andamento
            </button>
            <button
              className="status-opcao status-opcao-concluido"
              onClick={() => handleChangeStatus('concluido')}
            >
              Concluído
            </button>
            <button
              className="status-opcao status-opcao-fechado"
              onClick={() => handleChangeStatus('fechado')}
            >
              Fechado
            </button>
            <button
              className="status-opcao-cancelar"
              onClick={() => setShowStatusModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}