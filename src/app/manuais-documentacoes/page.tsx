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

        setDocumentos([
          {
            id: 1,
            titulo: "Procedimento para Restauração UV",
            descricao: "Documento para restauração do sistema do laptop militar.",
            url: "/docs/Procedimentos para restauração UV atualizado.pdf",
            criado_em: new Date().toISOString(),
          },
        ]);
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

            {loading && <p>Carregando documentos...</p>}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {!loading && documentos.length === 0 && (
              <p className="no-data">Nenhum documento encontrado.</p>
            )}

            {!loading && documentos.length > 0 && (
              <div className="documentos-wrapper">
                <table className="documentos-tabela">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Descrição</th>
                      <th>Data</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.titulo}</td>
                        <td>{doc.descricao}</td>
                        <td>{new Date(doc.criado_em).toLocaleDateString()}</td>
                        <td>
                          <Link
                            href="/docs/Procedimentos para restauração UV atualizado.pdf"
                            target="_blank"
                            className="link-detalhes"
                          >
                            📄 Abrir PDF
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
