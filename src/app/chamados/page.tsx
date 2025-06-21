'use client';

import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./chamados.module.css";

export default function ChamadosPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

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
                        <form className="form">
                            <div className="form-group">
                                <label htmlFor="titulo">Título do Chamado</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    id="titulo"
                                    placeholder="Escreva aqui"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="categoria">Categoria</label>
                                <select name="categoria" id="categoria" required>
                                    <option value="">Selecione uma categoria</option>
                                    <option value="hardware"> </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="categoria">Técnico</label>
                                <select name="categoria" id="categoria" required>
                                    <option value="">Selecione o técnico que irá receber sua dúvida</option>
                                    <option value="hardware"> </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="descricao">Descrição detalhada</label>
                                <textarea
                                    name="descricao"
                                    id="descricao"
                                    placeholder="Descreva a dúvida com o máximo de detalhes possível..."
                                    required
                                ></textarea>
                            </div>

                            <button type="submit">Abrir Chamado</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}