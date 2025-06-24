'use client';

import Link from 'next/link';
import '../dashboard.css';

export default function DashboardTecnico({ usuario }: { usuario: any }) {
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
                            <h1 className="form-title">Bem-vindo(a) {usuario.nome}</h1>
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
                                <Link href="/chamados/recebidos" className="action-button">
                                    📥 Chamados Recebidos
                                </Link>
                                <Link href="#" className="action-button secondary">
                                    📘 Manuais
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
