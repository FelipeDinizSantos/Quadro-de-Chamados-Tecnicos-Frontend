'use client';

import './Login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Erro ao realizar login.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);

      router.push('/chamados');
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
        <p className="title">Quadro de Chamados Técnicos</p>
        <div className="card">
          <div className="card-content">
            <h1 className="form-title">Entre com seus dados</h1>

            <form className="form" onSubmit={handleSubmit}>
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

              <div className="form-options">
                <div className="remember">
                  <input id="remember" type="checkbox" />
                  <label htmlFor="remember">Lembre de mim</label>
                </div>
              </div>

              {erro && <p style={{ color: 'red' }}>{erro}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="register-text">
                Não tem uma conta ainda? <a href="/registrar">Registre-se</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
