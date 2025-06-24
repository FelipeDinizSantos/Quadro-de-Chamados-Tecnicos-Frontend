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
  type: 'usuario om' | 'usuario tecnico' 
};

export default function RespostasChamado({ chamadoId, type }: RespostasChamadoProps) {
  const { isAuthenticated, user } = useAuth();

  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);

  // 🔥 Função para buscar as respostas do chamado
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

  // 🔥 Carrega as respostas na montagem do componente
  useEffect(() => {
    if (isAuthenticated) {
      fetchRespostas();
    }
  }, [isAuthenticated, chamadoId]);

  // 🔥 Enviar uma nova resposta
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

  const handleChangeStatus = (status: string) => {
    console.log('Status selecionado:', status);
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
              <div className="resposta-autor">
                {r.autor_nome}
              </div>
              <div className="resposta-mensagem">{r.mensagem}</div>
              <div className="resposta-data">
                {new Date(r.criado_em).toLocaleString('pt-BR')}
              </div>
            </div>
          );
        })}
      </div>

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
            {enviando ? 'Enviando...' : 'Enviar Resposta'}
          </button>
          {
            type == "usuario tecnico" && (
              <button
                type="button"
                className="botao-status"
                onClick={() => setShowStatusModal(true)}
              >
                Alterar Status
              </button>
            )
          }
        </div>
      </form>

      {showStatusModal && (
        <div className="status-modal-overlay">
          <div className="status-modal">
            <h4>Alterar Status do Chamado</h4>
            <button
              className="status-opcao status-andamento"
              onClick={() => handleChangeStatus('em_andamento')}
            >
              Em Andamento
            </button>
            <button
              className="status-opcao status-concluido"
              onClick={() => handleChangeStatus('concluido')}
            >
              Concluído
            </button>
            <button
              className="status-opcao status-fechado"
              onClick={() => handleChangeStatus('fechado')}
            >
              Fechado
            </button>
            <button
              className="status-cancelar"
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
