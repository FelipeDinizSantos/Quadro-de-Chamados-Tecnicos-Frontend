'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import "./Usuarios.css";

type Usuario = {
    id: number;
    nome: string;
    email: string;
    perfil_id: number;
    perfil_nome: string;
    funcao_tecnica_id?: number | null;
    funcao_tecnica_nome?: string | null;
    criado_em: string;
};

export default function UsuariosPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    if (user && user?.perfil_id < 3) {
        router.push('/dashboard');
        return;
    };

    const [usuariosOriginais, setUsuariosOriginais] = useState<Usuario[]>([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    const [filtroBusca, setFiltroBusca] = useState('');
    const [filtroPerfil, setFiltroPerfil] = useState('');
    const [filtroFuncao, setFiltroFuncao] = useState('');

    const funcoesTecnicas = [
        'Chefe COAL',
        'Cmt Pelotão',
        'Especialista Técnico',
        'Chefe de Seção'
    ];

    const perfis = [
        { id: 1, nome: 'Usuário OM' },
        { id: 2, nome: 'Usuário Técnico' }
    ];

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

        const fetchUsuarios = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || 'Erro ao buscar usuários');
                }

                const data = await res.json();

                let filtrados;

                if (user?.perfil_id !== 4) {
                    filtrados = data.filter((u: Usuario) => u.perfil_id < 3);
                } else {
                    filtrados = data;
                }

                setUsuariosOriginais(filtrados);
                setUsuariosFiltrados(filtrados);

            } catch (error: any) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    useEffect(() => {
        let lista = [...usuariosOriginais];

        if (filtroBusca.trim() !== '') {
            const buscaLower = filtroBusca.trim().toLowerCase();
            lista = lista.filter(u =>
                u.nome.toLowerCase().includes(buscaLower) ||
                u.email.toLowerCase().includes(buscaLower)
            );
        }

        if (filtroPerfil !== '') {
            const perfilId = parseInt(filtroPerfil, 10);
            lista = lista.filter(u => u.perfil_id === perfilId);
        }

        if (filtroFuncao !== '') {
            lista = lista.filter(u =>
                u.funcao_tecnica_nome &&
                u.funcao_tecnica_nome.toLowerCase() === filtroFuncao.toLowerCase()
            );
        }

        setUsuariosFiltrados(lista);
    }, [filtroBusca, filtroPerfil, filtroFuncao, usuariosOriginais]);

    if (!isAuthenticated) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container">
            <div className="inner">
                <div className="card">
                    <div className="card-content">
                        <h1 className="form-title">Usuários do Sistema</h1>

                        <div className="filtros">
                            <input
                                type="text"
                                placeholder="Buscar por nome ou email"
                                value={filtroBusca}
                                onChange={(e) => setFiltroBusca(e.target.value)}
                            />

                            <select
                                value={filtroPerfil}
                                onChange={(e) => setFiltroPerfil(e.target.value)}
                            >
                                <option value="">Todos os Perfis</option>
                                {perfis.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nome}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filtroFuncao}
                                onChange={(e) => setFiltroFuncao(e.target.value)}
                            >
                                <option value="">Todas as Funções Técnicas</option>
                                {funcoesTecnicas.map((f, idx) => (
                                    <option key={idx} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading && <p>Carregando usuários...</p>}
                        {erro && <p style={{ color: 'red' }}>{erro}</p>}

                        {!loading && usuariosFiltrados.length === 0 && (
                            <p style={{ color: '#6b7280' }}>Nenhum usuário encontrado com os filtros aplicados.</p>
                        )}

                        <div className="usuarios-list">
                            {usuariosFiltrados.map((usuario) => (
                                <div key={usuario.id} className="usuario-item">
                                    <h2 className="usuario-nome">{usuario.nome}</h2>
                                    <p className="usuario-email">{usuario.email}</p>
                                    <p className="usuario-perfil">Perfil: {usuario.perfil_nome}</p>
                                    {
                                        usuario.funcao_tecnica_nome && (
                                            <p className="usuario-funcao">Função técnica: {usuario.funcao_tecnica_nome}</p>
                                        )
                                    }
                                    <div className="usuario-link">
                                        <Link href={`/usuarios/${usuario.id}`}>
                                            Ver detalhes
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
