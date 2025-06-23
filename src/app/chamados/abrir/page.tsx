'use client';

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './abrirChamado.css';

export default function AbrirChamadosPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [funcoesTecnicas, setFuncoesTecnicas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    categoria_id: '',
    atribuido_funcao_tecnica_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Redireciona se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Fetch funções técnicas e categorias
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const fetchFuncoes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcoes-tecnicas/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar funções técnicas');
        const data = await res.json();
        setFuncoesTecnicas(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias-chamados/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar categorias');
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFuncoes();
    fetchCategorias();
  }, []);

  // 🔥 Handler do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMensagem('Token não encontrado.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chamados/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: form.titulo,
          descricao: form.descricao,
          categoria_id: parseInt(form.categoria_id),
          atribuido_funcao_tecnica_id: parseInt(form.atribuido_funcao_tecnica_id),
        }),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.error || 'Erro ao criar chamado');
      }

      setMensagem('Chamado criado com sucesso!');
      setForm({
        titulo: '',
        descricao: '',
        categoria_id: '',
        atribuido_funcao_tecnica_id: '',
      });
    } catch (error: any) {
      setMensagem(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Handler de mudança nos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!isAuthenticated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container">
      <div className="inner">
        <p className="title">Abrir Chamado</p>
        <div className="card">
          <div className="card-content">
            <h1 className="form-title">Descreva sua Dúvida</h1>

            {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="titulo">Título do Chamado</label>
                <input
                  type="text"
                  name="titulo"
                  id="titulo"
                  placeholder="Escreva aqui"
                  required
                  value={form.titulo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoria">Categoria</label>
                <select
                  name="categoria_id"
                  id="categoria"
                  required
                  value={form.categoria_id}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tecnico">Técnico</label>
                <select
                  name="atribuido_funcao_tecnica_id"
                  id="tecnico"
                  required
                  value={form.atribuido_funcao_tecnica_id}
                  onChange={handleChange}
                >
                  <option value="">Selecione o técnico</option>
                  {funcoesTecnicas.map((funcao) => (
                    <option key={funcao.id} value={funcao.id}>
                      {funcao.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição detalhada</label>
                <textarea
                  name="descricao"
                  id="descricao"
                  placeholder="Descreva a dúvida com o máximo de detalhes possível..."
                  required
                  value={form.descricao}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Abrir Chamado'}
              </button>
            </form>
            <div className="link-meus-chamados">
              <p>
                <a href="/chamados/meus">Visualizar meus chamados</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}