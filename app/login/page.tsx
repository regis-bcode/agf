"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("regis@teste.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/app/dashboard");
  }

  return (
    <main className="login-page">
      <div className="blur blur-one" />
      <div className="blur blur-two" />

      <section className="card">
        <aside className="hero">
          <p className="tag">AGF Portfolio</p>
          <h1>Bem-vindo de volta.</h1>
          <p className="subtitle">
            Acesse sua área para acompanhar projetos, resultados e atualizar seu
            portfólio com uma experiência rápida e segura.
          </p>

          <ul>
            <li>⚡ Gestão centralizada de projetos</li>
            <li>🔒 Ambiente seguro com autenticação</li>
            <li>📈 Visão clara do seu progresso</li>
          </ul>
        </aside>

        <div className="form-side">
          <h2>Login AGF</h2>
          <p className="form-subtitle">Entre com suas credenciais para continuar.</p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleLogin();
            }}
          >
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p className={`message ${message ? "error" : "hint"}`}>
              {message || "Use seu email e senha cadastrados para acessar."}
            </p>
          </form>
        </div>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: radial-gradient(circle at 15% 10%, #312e81 0%, #020617 40%),
            radial-gradient(circle at 90% 80%, #155e75 0%, transparent 45%),
            #020617;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .blur {
          position: absolute;
          border-radius: 999px;
          filter: blur(60px);
          pointer-events: none;
        }

        .blur-one {
          width: 280px;
          height: 280px;
          top: -80px;
          left: -60px;
          background: rgba(99, 102, 241, 0.45);
        }

        .blur-two {
          width: 360px;
          height: 360px;
          right: -90px;
          bottom: -100px;
          background: rgba(6, 182, 212, 0.25);
        }

        .card {
          width: min(100%, 980px);
          min-height: 620px;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          overflow: hidden;
          background: rgba(15, 23, 42, 0.85);
          box-shadow: 0 35px 90px rgba(2, 6, 23, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1;
        }

        .hero {
          padding: 44px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            135deg,
            rgba(79, 70, 229, 0.24),
            rgba(15, 23, 42, 0.25) 55%,
            rgba(34, 211, 238, 0.14)
          );
        }

        .tag {
          display: inline-flex;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.08);
        }

        h1 {
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.1;
          margin: 0;
        }

        .subtitle {
          margin-top: 16px;
          color: #cbd5e1;
          line-height: 1.7;
          max-width: 420px;
        }

        ul {
          margin: 34px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 12px;
          color: #e2e8f0;
        }

        .form-side {
          padding: 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        h2 {
          margin: 0;
          font-size: 34px;
        }

        .form-subtitle {
          margin: 10px 0 0;
          color: #cbd5e1;
          font-size: 14px;
        }

        form {
          margin-top: 30px;
          display: grid;
          gap: 14px;
        }

        label {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
        }

        input {
          margin-top: 8px;
          width: 100%;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(30, 41, 59, 0.82);
          color: #f8fafc;
          padding: 13px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        input:focus {
          border-color: rgba(34, 211, 238, 0.9);
          box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.2);
        }

        button {
          margin-top: 8px;
          border: 0;
          border-radius: 14px;
          color: #ffffff;
          font-weight: 700;
          padding: 13px 16px;
          background: linear-gradient(90deg, #4f46e5, #06b6d4);
          cursor: pointer;
          transition: transform 0.15s ease, filter 0.15s ease;
        }

        button:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }

        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .message {
          min-height: 24px;
          margin: 2px 0 0;
          font-size: 14px;
        }

        .hint {
          color: #94a3b8;
        }

        .error {
          color: #fda4af;
        }

        @media (max-width: 900px) {
          .card {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .hero {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 30px;
          }

          .form-side {
            padding: 30px;
          }
        }
      `}</style>
    </main>
  );
}
