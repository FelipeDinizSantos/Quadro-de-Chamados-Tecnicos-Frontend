'use client';

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import "./meusChamados.css";
import "../chamados.css";

type Chamado = {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  criado_em: string;
  categoria_nome?: string;
  funcao_tecnica_nome?: string;
  tecnico_id?: number;
  tecnico_nome?: string;
  tecnico_email?: string;
};

export default function MeusChamadosPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  if (user?.perfil_id === 3 || user?.perfil_id === 4) {
    router.push('/dashboard');
    return;
  };

  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Token não encontrado.');
      setLoading(false);
      return;
    }

    const fetchChamados = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chamados/meus`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Erro ao buscar chamados');
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

  if (!isAuthenticated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container">
      <div className="inner">
        <div className="card">
          <div className="card-content">
            <h1 className="form-title">Lista de Chamados</h1>

            {loading && <p>Carregando chamados...</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {!loading && chamados.length === 0 && (
              <p style={{ color: '#6b7280' }}>Nenhum chamado encontrado.</p>
            )}

            <div className="chamados-list">
              {chamados.map((chamado) => (
                <div key={chamado.id} className="chamado-item">
                  <span className={`chamado-status status-${chamado.status.toLowerCase()}`}>
                    {chamado.status === "em_andamento" ? 'EM ANDAMENTO' : chamado.status.toUpperCase()}
                  </span>
                  <h2 className="chamado-titulo">{chamado.titulo}</h2>
                  <p className="chamado-descricao">{chamado.descricao}</p>

                  <div className="chamado-info">
                    <span className="chamado-categoria">
                      Categoria: {chamado.categoria_nome || '—'}
                    </span>
                    <span className="chamado-categoria">
                      Função Técnica: {chamado.funcao_tecnica_nome || '—'}
                    </span>
                    <span className="chamado-categoria">
                      Atribuído a: {chamado.tecnico_nome || 'Técnico não encontrado'}
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

            <div className="link-abrir">
              <p>
                Deseja abrir um novo chamado?{' '}
                <Link href="/chamados/abrir">Clique aqui</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}