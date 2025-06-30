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

    if (user?.perfil_id !== 4) {
        router.push('/dashboard');
        return;
    }

    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    // Filtros
    const [usuarioId, setUsuarioId] = useState('');
    const [acao, setAcao] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

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
        } catch (error: any) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

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
                                    <input type="number" value={usuarioId} onChange={e => setUsuarioId(e.target.value)} />
                                </label>
                                <label>
                                    Ação:
                                    <input type="text" value={acao} onChange={e => setAcao(e.target.value)} />
                                </label>
                                <label>
                                    Data Início:
                                    <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                                </label>
                                <label>
                                    Data Fim:
                                    <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                                </label>
                            </div>
                            <button className="action-button" onClick={fetchLogs}>
                                Aplicar Filtros
                            </button>
                        </section>

                        {loading && <p>Carregando logs...</p>}
                        {erro && <p style={{ color: 'red' }}>{erro}</p>}

                        {!loading && logs.length === 0 && <p className="no-data">Nenhum log encontrado.</p>}

                        {!loading && logs.length > 0 && (
                            <div className="logs-list">
                                {logs.map((log) => (
                                    <div key={log.id} className="log-item">
                                        <div className="log-header">
                                            <h2 className="log-acao">{log.acao}</h2>
                                            <span className="log-data">{new Date(log.data).toLocaleString()}</span>
                                        </div>
                                        <p className="log-detalhes">{log.detalhes}</p>
                                        <div className="log-info">
                                            <span className="log-usuario">Usuário: {log.usuario_nome} (ID {log.usuario_id})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
