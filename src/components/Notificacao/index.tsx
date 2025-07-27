'use client';

import { useEffect, useState } from 'react';
import './Notificacao.css';

type Notificacao = {
    id: string;
    titulo: string;
    lida: boolean;
    tipo: 'email_verificacao';
};

type Props = {
    emailVerificado: boolean | number;
};

export default function Notificacoes({ emailVerificado }: Props) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    useEffect(() => {
        if (!emailVerificado) {
            setNotificacoes([
                {
                    id: '1',
                    titulo: 'Verifique seu e-mail',
                    lida: false,
                    tipo: 'email_verificacao',
                },
            ]);
        }
    }, [emailVerificado]);

    const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida);

    const abrirNotificacoes = () => {
        setShowPopup((prev) => !prev);
    };

    const reenviarEmail = () => {
        alert('E-mail de verificação reenviado!');
        setShowEmailModal(false);
        // Aqui você futuramente faria uma chamada fetch/axios ao backend.
    };

    const selecionarNotificacao = (notificacao: Notificacao) => {
        if (notificacao.tipo === 'email_verificacao') {
            setShowPopup(false);
            setShowEmailModal(true);
        }
    };

    return (
        <div className="notificacoes-container">
            <button
                className="notificacao-botao"
                onClick={abrirNotificacoes}
                aria-label="Abrir notificações"
            >
                🔔
                {notificacoesNaoLidas.length > 0 && (
                    <span className="notificacao-badge">
                        {notificacoesNaoLidas.length}
                    </span>
                )}
            </button>

            {showPopup && (
                <div className="notificacoes-popup">
                    <div className="popup-header">Notificações</div>
                    <ul className="popup-lista">
                        {notificacoes.map((n) => (
                            <li
                                key={n.id}
                                onClick={() => selecionarNotificacao(n)}
                                className="popup-item"
                            >
                                {n.titulo}
                            </li>
                        ))}
                    </ul>
                    <button className="popup-fechar" onClick={() => setShowPopup(false)}>
                        Fechar
                    </button>
                </div>
            )}

            {showEmailModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Verificação de E-mail</h2>
                        <p>Você precisa verificar seu e-mail para receber notificações do sistema. Por favor, acesse seu e-mail e siga as instruções.</p>
                        <div className="modal-acoes">
                            <button onClick={reenviarEmail}>Reenviar e-mail de verificação</button>
                            <button className="btn-secundario" onClick={() => setShowEmailModal(false)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
