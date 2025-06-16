import "./Login.module.css";

export default function LoginPage() {
  return (
    <div className="container">
      <div className="inner">
        <p className="title">Quadro de Chamados Técnicos</p>
        <div className="card">
          <div className="card-content">
            <h1 className="form-title">Entre com seus dados</h1>
            <form className="form">
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" placeholder="exemplo@dominio.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input type="password" name="password" id="password" placeholder="••••••••" required />
              </div>
              <div className="form-options">
                <div className="remember">
                  <input id="remember" type="checkbox" required />
                  <label htmlFor="remember">Lembre de mim</label>
                </div>
              </div>
              <button type="submit">Entrar</button>
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
