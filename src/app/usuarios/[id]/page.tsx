'use client';

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import "./Usuario.css";
import "../Usuarios.css";
import BotaoRetorno from '@/components/BotaoRetorno';

type RespostaChamado = {
    resposta_id: number;
    mensagem: string;
    criado_em: string;
    autor_nome: string;
};

type Chamado = {
    id: number;
    titulo: string;
    descricao: string;
    status: string;
    criado_em: string;
    categoria_nome?: string;
    funcao_tecnica_nome?: string;
    respostas: RespostaChamado[];
};

type FuncaoTecnica = {
    id: number;
    nome: string;
};

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

export default function UsuarioDetalhesPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const params = useParams();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [chamadosAbertos, setChamadosAbertos] = useState<Chamado[]>([]);
    const [chamadosRespondidos, setChamadosRespondidos] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [funcoesTecnicas, setFuncoesTecnicas] = useState<FuncaoTecnica[]>([]);
    const [selectedFuncaoId, setSelectedFuncaoId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletando, setDeletando] = useState(false);

    // Verifica se o usuário atual é admin
    const isAdmin = user?.perfil_id === 4;

    if(user && user.perfil_id < 3){
        router.push("/dashboard");
        return;
    }

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

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error((await res.json()).error || 'Erro ao buscar usuário');

                const data = await res.json();

                if(data.usuario.is_deleted){
                    alert("Este usuário foi excluido!");

                    if(typeof window !== "undefined"){
                        window.history.back();
                    }
                }

                setUsuario(data.usuario);
                setChamadosAbertos(data.chamadosAbertos || []);
                setChamadosRespondidos(data.chamadosRespondidos || []);
            } catch (error: any) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchFuncoes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcoes-tecnicas`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Erro ao buscar funções técnicas');
                const data = await res.json();
                setFuncoesTecnicas(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFuncoes();
    }, []);

    const handlePromoverParaComando = async () => {
        const confirmar = window.confirm('Tem certeza que deseja promover este usuário para Comando?');
        if (!confirmar) return;

        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario?.id}/atribuir-funcao-comando`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error((await res.json()).error || 'Erro ao promover usuário para Comando');
            alert('Usuário promovido para Comando com sucesso!');
            router.refresh();
            if (typeof window !== "undefined") window.location.reload();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handlePromoverParaTecnico = async () => {
        console.log(selectedFuncaoId);
        
        if (!selectedFuncaoId) {
            alert('Selecione uma função técnica para promoção.');
            return;
        }
        
        const confirmar = window.confirm('Tem certeza que deseja promover este usuário para Técnico?');
        if (!confirmar) return;

        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario?.id}/atribuir-funcao`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ funcao_tecnica_id: selectedFuncaoId }),
            });

            if (!res.ok) throw new Error((await res.json()).error || 'Erro ao promover usuário');
            alert('Usuário promovido para Técnico com sucesso!');
            router.refresh();
            if (typeof window !== "undefined") window.location.reload();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleRebaixar = async () => {
        const confirmar = window.confirm('Tem certeza que deseja rebaixar este usuário para OM?');
        if (!confirmar) return;

        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario?.id}/rebaixar`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error((await res.json()).error || 'Erro ao rebaixar usuário');
            alert('Usuário rebaixado para OM com sucesso!');
            router.refresh();
            if (typeof window !== "undefined") window.location.reload();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleRebaixarComando = async () => {
        const confirmar = window.confirm('Tem certeza que deseja rebaixar este usuário de Comando para OM?');
        if (!confirmar) return;

        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario?.id}/rebaixar-comando`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ perfil_id: 1 })
            });

            if (!res.ok) throw new Error((await res.json()).error || 'Erro ao rebaixar usuário');
            alert('Usuário rebaixado para OM com sucesso!');
            router.refresh();
            if (typeof window !== "undefined") window.location.reload();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };


    const handleExcluirUsuario = async () => {
        const confirmar = window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.');
        if (!confirmar) return;

        setDeletando(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuario?.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Erro ao excluir o usuário');
            }

            alert('Usuário excluído com sucesso!');
            router.push('/usuarios');
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message}`);
        } finally {
            setDeletando(false);
        }
    };

    if (!isAuthenticated) return <p>Carregando...</p>;

    return (
        <div className="container">
            <div className="inner">
                <div className="card">
                    
                    <BotaoRetorno path='/usuarios' />
                    <div className="card-content">
                        <h1 className="form-title">Perfil do Usuário</h1>

                        {loading && <p>Carregando informações...</p>}
                        {erro && <p style={{ color: 'red' }}>{erro}</p>}

                        {!loading && usuario && (
                            <>
                                <div className="dashboard-actions">
                                    {isAdmin && usuario.perfil_id === 1 && (
                                        <div className="admin-promo-section">
                                            <h3 className="promo-title">Promover usuário para Comando</h3>
                                            <button
                                                className="action-button highlight"
                                                onClick={handlePromoverParaComando}
                                                disabled={saving}
                                            >
                                                {saving ? 'Processando...' : 'Promover'}
                                            </button>
                                        </div>
                                    )}

                                    {usuario.perfil_id === 1 && (
                                        <>
                                            <label>
                                                <span>Promover a Técnico:</span>
                                                <select
                                                    className='action-select'
                                                    value={selectedFuncaoId ?? ''}
                                                    onChange={(e) => setSelectedFuncaoId(Number(e.target.value))}
                                                >
                                                    <option value="">Selecione a função técnica</option>
                                                    {funcoesTecnicas.map((funcao) => (
                                                        <option key={funcao.id} value={funcao.id}>
                                                            {funcao.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <button
                                                className="action-button"
                                                onClick={handlePromoverParaTecnico}
                                                disabled={saving}
                                            >
                                                {saving ? 'Salvando...' : 'Promover para Técnico'}
                                            </button>
                                        </>
                                    )}

                                    {usuario.perfil_id === 2 && (
                                        <button
                                            className="action-button secondary"
                                            onClick={handleRebaixar}
                                            disabled={saving}
                                        >
                                            {saving ? 'Salvando...' : 'Rebaixar para OM'}
                                        </button>
                                    )}

                                    {usuario.perfil_id === 3 && (
                                        <button
                                            className="action-button secondary"
                                            onClick={handleRebaixarComando}
                                            disabled={saving}
                                        >
                                            {saving ? 'Salvando...' : 'Rebaixar Comando para OM'}
                                        </button>
                                    )}

                                    <button
                                        className="action-button secondary danger"
                                        onClick={handleExcluirUsuario}
                                        disabled={deletando}
                                    >
                                        {deletando ? 'Excluindo...' : 'Excluir Usuário'}
                                    </button>
                                </div>

                                <section className="perfil-info">
                                    <p><strong>Nome:</strong> {usuario.nome}</p>
                                    <p><strong>Email:</strong> {usuario.email}</p>
                                    <p><strong>Perfil:</strong> {usuario.perfil_nome}</p>
                                    {usuario.funcao_tecnica_id && (
                                        <p><strong>Função Técnica:</strong> {usuario.funcao_tecnica_nome}</p>
                                    )}
                                    <p><strong>Criado em:</strong> {new Date(usuario.criado_em).toLocaleString()}</p>
                                </section>
                            </>
                        )}

                        {!loading && usuario && usuario.perfil_id === 1 && (
                            <section>
                                <h2 className="sub-title">Chamados Abertos</h2>
                                {chamadosAbertos.length === 0 ? (
                                    <p className="no-data">Nenhum chamado aberto encontrado.</p>
                                ) : (
                                    <div className="chamados-list">
                                        {chamadosAbertos.map((chamado) => (
                                            <div key={chamado.id} className="chamado-user-item">
                                                <span className={`chamado-status status-${chamado.status.toLowerCase()}`}>
                                                    {chamado.status === "em_andamento" ? 'EM ANDAMENTO' : chamado.status.toUpperCase()}
                                                </span>
                                                <h2 className="chamado-titulo">{chamado.titulo}</h2>
                                                <p className="chamado-descricao">{chamado.descricao}</p>
                                                <div className="chamado-info">
                                                    <span className="chamado-categoria">Categoria: {chamado.categoria_nome || '—'}</span>
                                                </div>
                                                <div className="chamado-links">
                                                    <Link href={`/chamados/${chamado.id}`} className="link-detalhes">
                                                        Ver detalhes do chamado
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {!loading && usuario && usuario.perfil_id === 2 && (
                            <section>
                                <h2 className="sub-title">Chamados Respondidos</h2>
                                {chamadosRespondidos.length === 0 ? (
                                    <p className="no-data">Nenhum chamado respondido encontrado.</p>
                                ) : (
                                    <div className="chamados-list">
                                        {chamadosRespondidos.map((chamado) => (
                                            <div key={chamado.id} className="chamado-user-item">
                                                <span className={`chamado-status status-${chamado.status.toLowerCase()}`}>
                                                    {chamado.status === "em_andamento" ? 'EM ANDAMENTO' : chamado.status.toUpperCase()}
                                                </span>
                                                <h2 className="chamado-titulo">{chamado.titulo}</h2>
                                                <p className="chamado-descricao">{chamado.descricao}</p>
                                                <div className="chamado-info">
                                                    <span className="chamado-categoria">Categoria: {chamado.categoria_nome || '—'}</span>
                                                </div>
                                                <div className="chamado-links">
                                                    <Link href={`/chamados/${chamado.id}`} className="link-detalhes">
                                                        Ver detalhes do chamado
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
