'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import "./Documentos.css";
import BotaoRetorno from '@/components/BotaoRetorno';

type Documento = {
    id: number;
    titulo: string;
    descricao: string;
    url: string;
    criado_em: string;
};

export default function DocumentosPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token não encontrado.');

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documentos`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error('Erro ao buscar documentos');
                const data = await res.json();
                setDocumentos(data);
            } catch (error: any) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return <p>Carregando...</p>;

    return (
        <div className="container">
            <div className="inner">
                <div className="card">
                    <BotaoRetorno path='/dashboard' />
                    <div className="card-content">
                        <h1 className="form-title">Documentos Disponíveis</h1>
                        <div className="documentos-list">
                            <div className="documento-item">
                                <div className="documento-header">
                                    <h2 className="documento-titulo">Procedimento para Restauração UV</h2>
                                    <span className="documento-data">{new Date().toLocaleDateString()}</span>
                                </div>
                                <p className="documento-descricao">Documento para restauração do sistema do laptop militar.</p>
                                <div className="documento-links">
                                    <Link href="/docs/Procedimentos para restauração UV atualizado.pdf" className='link-detalhes' target="_blank" rel="noopener noreferrer">
                                        📄 Abrir PDF
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
