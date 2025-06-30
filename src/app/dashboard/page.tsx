'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardOM from './dashboards/DashboardOM';
import DashboardTecnico from './dashboards/DashboardTecnico';
import DashboardComando from './dashboards/DashboardComando';
import DashboardAdmin from './dashboards/DashboardADM';

type UsuarioPerfil = {
  id: number;
  nome: string;
  email: string;
  criado_em: string;
  perfil_id: number;
  perfil_nome: string;
  funcao_tecnica_id?: number;
  funcao_tecnica_nome?: string;
};

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
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

    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Erro ao carregar perfil');
        }

        const data = await res.json();
        setUsuario(data);
      } catch (error: any) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (!isAuthenticated || loading) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p style={{ color: 'red' }}>{erro}</p>;
  }

  if (!usuario) {
    return <p>Perfil não encontrado.</p>;
  }

  switch (usuario.perfil_nome.toLowerCase()) {
    case 'usuário da om':
      return <DashboardOM usuario={usuario} />;
    case 'usuário técnico':
      return <DashboardTecnico usuario={usuario} />;
    case 'usuário comando':
      return <DashboardComando usuario={usuario} />;
    case 'admin':
      return <DashboardAdmin usuario={usuario} />;
    default:
      return <p>Perfil não reconhecido.</p>;
  }
}
