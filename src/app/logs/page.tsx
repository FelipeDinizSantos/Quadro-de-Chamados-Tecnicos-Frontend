'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./Logs.css";
import BotaoRetorno from '@/components/BotaoRetorno';

type LogItem = {
  id: number;
  usuario_id: number;
  usuario_nome: string;
  acao: string;
  detalhes: string;
  data: string;
};

export default function LogsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Filtros
  const [usuarioId, setUsuarioId] = useState('');
  const [acao, setAcao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const limparFiltros = () => {
    setUsuarioId('');
    setAcao('');
    setDataInicio('');
    setDataFim('');
  };

  if (user?.perfil_id !== 4) {
    router.push('/dashboard');
    return;
  }

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const fetchLogs = async () => {
    setLoading(true);
    setErro('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado.');

      const params = new URLSearchParams();
      if (usuarioId) params.append('usuario_id', usuarioId);
      if (acao) params.append('acao', acao);
      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao buscar logs');
      const data = await res.json();
      setLogs(data);
      setPaginaAtual(1); // resetar para página 1 ao buscar
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalPaginas = Math.ceil(logs.length / itensPorPagina);
  const logsPaginados = logs.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    setPaginaAtual(novaPagina);
  };

  if (!isAuthenticated) return <p>Carregando...</p>;

  return (
    <div className="container">
      <div className="inner">
        <div className="card">
          <BotaoRetorno path='/dashboard' />
          <div className="card-content">
            <h1 className="form-title">Histórico de Logs do Sistema</h1>

            <section className="logs-filtro">
              <h3>Filtros</h3>
              <div className="filtro-grid">
                <label>
                  Usuário ID:
                  <input
                    type="number"
                    value={usuarioId}
                    onChange={e => setUsuarioId(e.target.value)}
                  />
                </label>
                <label>
                  Ação:
                  <input
                    type="text"
                    value={acao}
                    onChange={e => setAcao(e.target.value)}
                  />
                </label>
                <label>
                  Data Início:
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                  />
                </label>
                <label>
                  Data Fim:
                  <input
                    type="date"
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                  />
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="action-button" onClick={fetchLogs}>
                  Aplicar Filtros
                </button>
                <button
                  className="action-button secondary"
                  onClick={limparFiltros}
                >
                  Limpar Filtros
                </button>
              </div>
            </section>

            {loading && <p>Carregando logs...</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {!loading && logs.length === 0 && <p className="no-data">Nenhum log encontrado.</p>}

            {!loading && logs.length > 0 && (
              <>
                <div className="tabela-chamados-wrapper">
                  <table className="tabela-chamados">
                    <thead>
                      <tr>
                        <th>Ação</th>
                        <th>Detalhes</th>
                        <th>Data</th>
                        <th>Usuário</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logsPaginados.map((log) => (
                        <tr key={log.id}>
                          <td data-label="Ação">{log.acao}</td>
                          <td data-label="Detalhes">{log.detalhes}</td>
                          <td data-label="Data">{new Date(log.data).toLocaleString()}</td>
                          <td data-label="Usuário">
                            {log.usuario_nome} (ID {log.usuario_id})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="paginacao">
                  <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
                    Anterior
                  </button>
                  <span>Página {paginaAtual} de {totalPaginas}</span>
                  <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>
                    Próxima
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
