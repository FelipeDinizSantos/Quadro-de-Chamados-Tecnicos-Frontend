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
                onChange={(e) => setFiltro(e.target.value)}
                className="input-filtro"
              />
            </div>

            {loading && <p>Carregando chamados...</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {!loading && !erro && chamados.length === 0 && (
              <p style={{ color: '#6b7280' }}>Nenhum chamado atribuído a você.</p>
            )}

            {!loading && !erro && chamados.length > 0 && chamadosFiltrados.length === 0 && (
              <p style={{ color: '#6b7280' }}>
                Nenhum chamado encontrado para o filtro digitado.
              </p>
            )}

            <div className="chamados-list">
              {chamadosFiltrados.map((chamado) => (
                <div key={chamado.id} className="chamado-item">
                  <span className={`chamado-status status-${chamado.status.toLowerCase()}`}>
                    {chamado.status === "em_andamento" ? 'EM ANDAMENTO' : chamado.status.toUpperCase()}
                  </span>

                  <span className="chamado-protocolo">
                    Protocolo: {chamado.protocolo}
                  </span>

                  <h2 className="chamado-titulo">{chamado.titulo}</h2>
                  <p className="chamado-descricao">{chamado.descricao}</p>

                  <div className="chamado-info">
                    <span className="chamado-categoria">
                      Recebido em: {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="chamado-info">
                    <span className="chamado-categoria">
                      Aberto por: <strong>{chamado.nome_criador || '—'}</strong>
                    </span>
                    <span className="chamado-categoria">
                      Contato: {chamado.email_criador || '—'}
                    </span>
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <Link href={`/chamados/${chamado.id}`} className="link-detalhes">
                      Ver detalhes e responder
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
