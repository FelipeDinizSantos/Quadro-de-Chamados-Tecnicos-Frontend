'use client';

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../chamados.css';
import RespostasChamado from '@/components/RespostaChamados';

type Chamado = {
    id: number;
    titulo: string;
    descricao: string;
    status: string;
    criado_em: string;
};

export default function ChamadosRecebidosPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

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

    if (!isAuthenticated) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container">
            <div className="inner">
                <div className="card">
                    <div className="card-content">
                        <h1 className="form-title">Lista de Chamados Atribuídos</h1>

                        {loading && <p>Carregando chamados...</p>}
                        {erro && <p style={{ color: 'red' }}>{erro}</p>}

                        {!loading && chamados.length === 0 && (
                            <p style={{ color: '#6b7280' }}>Nenhum chamado atribuído a você.</p>
                        )}

                        <div className="chamados-list">
                            {chamados.map((chamado) => (
                                <div key={chamado.id} className="chamado-item">
                                    <span className={`chamado-status ${chamado.status === 'aberto' ? 'status-aberto' :
                                        chamado.status === 'finalizado' ? 'status-finalizado' : ''
                                        }`}>
                                        {chamado.status.toUpperCase()}
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
                                            Aberto por: <strong>{chamado.nome_criador}</strong>
                                        </span>
                                        <span className="chamado-categoria">
                                            Contato: {chamado.email_criador}
                                        </span>
                                    </div>
                                    <RespostasChamado chamadoId={chamado.id} />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
