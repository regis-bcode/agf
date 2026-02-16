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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-12 text-slate-100">
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-indigo-950/40 backdrop-blur md:grid-cols-2">
          <div className="hidden border-r border-white/10 bg-gradient-to-br from-indigo-500/25 via-transparent to-cyan-400/15 p-10 md:block">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-100">
              AGF Portfolio
            </p>
            <h1 className="text-4xl font-black leading-tight text-white">
              Bem-vindo de volta.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-200/90">
              Acesse sua área para acompanhar projetos, resultados e atualizar
              seu portfólio com uma experiência rápida e segura.
            </p>
            <div className="mt-10 space-y-3 text-sm text-slate-200/80">
              <p>⚡ Gestão centralizada de projetos</p>
              <p>🔒 Ambiente seguro com autenticação</p>
              <p>📈 Visão clara do seu progresso</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="text-3xl font-bold text-white">Login AGF</h2>
            <p className="mt-2 text-sm text-slate-300">
              Entre com suas credenciais para continuar.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleLogin();
              }}
            >
              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-200">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-200">Senha</span>
                <input
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <p
                className={`min-h-6 text-sm ${
                  message ? "text-rose-300" : "text-slate-400"
                }`}
              >
                {message || "Use seu email e senha cadastrados para acessar."}
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
