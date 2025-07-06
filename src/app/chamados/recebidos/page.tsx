'use client';

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../chamados.css';
import './chamadosRecebidos.css';
import Link from 'next/link';
import BotaoRetorno from '@/components/BotaoRetorno';

type Chamado = {
  id: number;
  titulo: string;
  descricao: string;
  protocolo: string;
  status: string;
  criado_em: string;
  nome_criador?: string;
  email_criador?: string;
};

export default function ChamadosRecebidosPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  if (user?.perfil_id === 3 || user?.perfil_id === 4) {
    router.push('/dashboard');
    return;
  }

  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Proteção da rota
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Fetch dos chamados recebidos
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Token não encontrado.');
      setLoading(false);
      return;
    }

    const fetchChamados = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chamados/recebidos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Erro ao buscar chamados recebidos');
        }

        const data = await res.json();
        setChamados(data);
      } catch (error: any) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  // Filtragem segura
  const chamadosFiltrados = chamados.filter((chamado) =>
    (chamado.titulo?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (chamado.protocolo?.toLowerCase() || '').includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(chamadosFiltrados.length / itensPorPagina);
  const chamadosPaginados = chamadosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    setPaginaAtual(novaPagina);
  };

  if (!isAuthenticated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container">
      <div className="inner">
        <div className="card">
          <BotaoRetorno path='/dashboard' />

          <div className="card-content">
            <h1 className="form-title">Lista de Chamados Atribuídos</h1>

            <div className="filtro-container">
              <input
                type="text"
                placeholder="Filtrar por título ou protocolo..."
                value={filtro}
                onChange={(e) => {
                  setFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="input-filtro"
              />
            </div>

            {loading && <p>Carregando chamados...</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {!loading && !erro && chamadosFiltrados.length === 0 && (
              <p style={{ color: '#6b7280' }}>Nenhum chamado atribuído a você.</p>
            )}

            {!loading && !erro && chamadosFiltrados.length > 0 && (
              <>
                <div className="tabela-chamados-wrapper">
                  <table className="tabela-chamados">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Protocolo</th>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Recebido em</th>
                        <th>Aberto por</th>
                        <th>Contato</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chamadosPaginados.map((chamado) => (
                        <tr key={chamado.id}>
                          <td data-label="Status">
                            <span className={`status-badge status-${chamado.status.toLowerCase()}`}>
                              {chamado.status === "em_andamento" ? 'EM ANDAMENTO' : chamado.status.toUpperCase()}
                            </span>
                          </td>
                          <td data-label="Protocolo">{chamado.protocolo}</td>
                          <td data-label="Título">{chamado.titulo}</td>
                          <td data-label="Descrição">{chamado.descricao}</td>
                          <td data-label="Recebido em">
                            {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                          </td>
                          <td data-label="Aberto por">{chamado.nome_criador || '—'}</td>
                          <td data-label="Contato">{chamado.email_criador || '—'}</td>
                          <td data-label="Ações">
                            <Link href={`/chamados/${chamado.id}`} className="link-detalhes">
                              Ver detalhes e responder
                            </Link>
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
