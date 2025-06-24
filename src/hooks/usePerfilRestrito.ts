import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UsuarioPerfil = {
    perfil_nome: string;
};

export function usePerfilRestrito(perfisPermitidos: string[]) {
    const [permitido, setPermitido] = useState<boolean | null>(null);
    const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchPerfil = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    router.push('/');
                    return;
                }

                const data = await res.json();
                setUsuario(data);

                if (perfisPermitidos.includes(data.perfil_nome.toLowerCase())) {
                    setPermitido(true);
                } else {
                    setPermitido(false);
                }
            } catch (err) {
                console.error(err);
                router.push('/');
            }
        };

        fetchPerfil();
    }, [perfisPermitidos, router]);

    return { permitido, usuario };
}
