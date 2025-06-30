'use client';

import Link from "next/link";
import Image from "next/image";
import "./BotaoRetorno.css";

export default function BotaoRetorno({ path }: { path: string }) {
    return (
        <div className="botao-retorno">
            <Link href={path}>
                <Image
                    src="/img/back-arrow.png"
                    alt="Voltar"
                    width={17}
                    height={17}
                />
            </Link>
        </div>
    )
}
