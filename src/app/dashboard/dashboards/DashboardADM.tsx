'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../dashboard.css';

export default function DashboardAdmin({ usuario }: { usuario: any }) {
    const [estatisticas, setEstatisticas] = useState({
        chamadosHoje: 0,
        novosUsuarios: 0,
        resolucaoRate: 0,
        totalChamados: 0,
        chamadosResolvidos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(usuario);

        const fetchEstatisticas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const [resChamados, resUsuarios, resTaxa] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chamados/estatisticas/chamados-hoje`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/estatisticas/usuarios-hoje`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chamados/estatisticas/taxa-resolucao`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                const dataChamados = await resChamados.json();
                const dataUsuarios = await resUsuarios.json();
                const dataTaxa = await resTaxa.json();

                setEstatisticas({
                    chamadosHoje: dataChamados.total || 0,
                    novosUsuarios: dataUsuarios.total || 0,
                    resolucaoRate: dataTaxa.taxa || 0,
                    totalChamados: dataTaxa.total || 0,
                    chamadosResolvidos: dataTaxa.resolvidos || 0
                });

            } catch (error) {
                console.error('Erro ao buscar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEstatisticas();
    }, []);

    return (
        <>
            <button
                className="logout-button"
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }}
            >
                Sair
            </button>

            <div className="container">
                <div className="inner">
                    <div className="card">
                        <div className="card-content">
                            <h1 className="form-title">Painel Administrativo</h1>
                            <div className="perfil-info">
                                <p><strong>Nome:</strong> {usuario.nome}</p>
                                <p><strong>Email:</strong> {usuario.email}</p>
                                <p><strong>Perfil:</strong> {usuario.perfil_nome}</p>
                                {usuario.funcao_tecnica_nome && (
                                    <p><strong>Função Técnica:</strong> {usuario.funcao_tecnica_nome}</p>
                                )}
                                <p><strong>Usuário desde:</strong> {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}</p>
                            </div>

                            <div className="dashboard-actions">
                                <Link href="/usuarios" className="action-button">
                                    👥 Gerenciar Usuários
                                </Link>
                                <Link href="/chamados/todos" className="action-button">
                                    📑 Visualizar Todos Chamados
                                </Link>
                                <Link href="/logs" className="action-button">
                                    📊 Visualizar Logs do Sistema
                                </Link>
                                <Link href="manuais-documentacoes" className="action-button secondary">
                                    📘 Manuais e Documentação
                                </Link>
                            </div>

                            <div className="admin-stats">
                                <h3 className="stats-title">Estatísticas Rápidas</h3>
                                {loading ? (
                                    <p>Carregando estatísticas...</p>
                                ) : (
                                    <div className="stats-grid">
                                        <div className="stat-card">
                                            <span className="stat-number">{estatisticas.chamadosHoje}</span>
                                            <span className="stat-label">Chamados hoje</span>
                                            <span className="stat-subtext">{new Date().toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="stat-card">
                                            <span className="stat-number">{estatisticas.novosUsuarios}</span>
                                            <span className="stat-label">Novos usuários</span>
                                            <span className="stat-subtext">Hoje</span>
                                        </div>
                                        <div className="stat-card">
                                            <span className="stat-number">{estatisticas.resolucaoRate}%</span>
                                            <span className="stat-label">Taxa de resolução</span>
                                            <span className="stat-subtext">
                                                {estatisticas.chamadosResolvidos}/{estatisticas.totalChamados} chamados
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}