export default function RegistroPage() {
    return (
        <div className="container">
            <div className="inner">
                <p className="title">Criação de Conta</p>
                <div className="card">
                    <div className="card-content">
                        <h1 className="form-title">Registre-se</h1>
                        <form className="form">
                            <div className="form-group">
                                <label htmlFor="name">Nome completo</label>
                                <input type="text" name="name" id="name" placeholder="Seu nome" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">E-mail</label>
                                <input type="email" name="email" id="email" placeholder="exemplo@dominio.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Senha</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar senha</label>
                                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" required />
                            </div>
                            <button type="submit">Registrar</button>
                            <p className="register-text">
                                Já tem uma conta? <a href="/">Entre aqui</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}