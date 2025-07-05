'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BotaoRetorno from '@/components/BotaoRetorno';

export default function RegistroPage() {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        if (senha !== confirmSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/auth/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.error || 'Erro ao registrar.');
                setLoading(false);
                return;
            }

            alert('Usuário registrado com sucesso!');
            router.push('/');
        } catch (err) {
            console.error(err);
            setErro('Erro na conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="inner">
                <p className="title">Criação de Conta</p>
                <div className="card">

                    <BotaoRetorno path='/' />
                    <div className="card-content">
                        <h1 className="form-title">Registre-se</h1>

                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Seu nome"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="exemplo@dominio.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Senha</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar senha</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    required
                                    value={confirmSenha}
                                    onChange={(e) => setConfirmSenha(e.target.value)}
                                />
                            </div>

                            {erro && <p style={{ color: 'red' }}>{erro}</p>}

                            <button type="submit" disabled={loading}>
                                {loading ? 'Registrando...' : 'Registrar'}
                            </button>

                            <p className="register-text">
                                Já tem uma conta? <a href="/">Entre aqui</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
