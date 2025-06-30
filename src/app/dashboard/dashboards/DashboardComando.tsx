'use client';

import Link from 'next/link';
import '../dashboard.css';

export default function DashboardComando({ usuario }: { usuario: any }) {
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
                            <h1 className="form-title">Bem-vindo(a)</h1>
                            <div className="perfil-info">
                                <p><strong>Nome:</strong> {usuario.nome}</p>
                                <p><strong>Email:</strong> {usuario.email}</p>
                                <p><strong>Perfil:</strong> {usuario.perfil_nome}</p>
                                <p><strong>Usuário desde:</strong> {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}</p>
                            </div>

                            <div className="dashboard-actions">
                                <Link href="/usuarios" className="action-button">
                                    👥 Gerenciar Usuários
                                </Link>
                                <Link href="/chamados/todos" className="action-button">
                                    📑 Visualizar Todos Chamados
                                </Link>
                                <Link href="manuais-documentacoes" className="action-button secondary">
                                    📘 Manuais e Documentação
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
