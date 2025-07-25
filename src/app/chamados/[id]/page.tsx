'use client';

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../chamados.css';
import './chamado.css';
import RespostasChamado from '@/components/RespostaChamados';
import BotaoRetorno from '@/components/BotaoRetorno';

type Chamado = {
  id: number;
  titulo: string;
  descricao: string;
  protocolo: string;
  status: string;
  criado_em: string;
  categoria_nome?: string;
  funcao_tecnica_nome?: string;
  tecnico_nome?: string;
  tecnico_email?: string;
};

export default function DetalhesChamadoPage() {
  const { isAuthenticated, user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchChamado = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chamados/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Erro ao carregar chamado');
        }

        const data = await res.json();

        setChamado(data.chamado);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChamado();
  }, [id]);

  if (!isAuthenticated) return <p>Carregando...</p>;

  if (loading) return <p>Carregando chamado...</p>;

  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

  if (!chamado) return <p>Chamado não encontrado.</p>;

  let respostaType:'usuario om'|'usuario tecnico'|'admin/comando' = 'usuario om';

  if (user?.perfil_id === 1) {
    respostaType = 'usuario om';
  }
  if (user?.perfil_id === 2) {
    respostaType = 'usuario tecnico';
  }
  if (user?.perfil_id === 3 || user?.perfil_id === 4) {
    console.log('Admin/Comando');
    respostaType = 'admin/comando';
  }

  return (
    <div className="container">
      <div className="inner">
        <div className="chamado-item">

          <BotaoRetorno path='/dashboard' />
          <span className={`chamado-status status-${chamado.status.toLowerCase()}`}>
            {chamado.status === "em_andamento" ? 'EM ANDAMENTO' : chamado.status.toUpperCase()}
          </span>
          <span className="chamado-protocolo">
            Protocolo: {chamado.protocolo}
          </span>
          <h2 className="chamado-titulo">{chamado.titulo}</h2>
          <p className="chamado-descricao">{chamado.descricao}</p>

          <div className="chamado-info">
            <span>Categoria: {chamado.categoria_nome || '—'}</span>
            <span>Função Técnica: {chamado.funcao_tecnica_nome || '—'}</span>
            <span>Técnico: {chamado.tecnico_nome || '—'}</span>
          </div>

          <RespostasChamado chamadoId={chamado.id} type={respostaType} status={chamado.status} />
        </div>
      </div>
    </div>
  );
}
