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
    console.log("BOTÃO CLICADO");
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("ERRO:", error.message);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    console.log("LOGIN OK");
    router.push("/app/dashboard");
  }

  return (
    <div style={{ padding: 40, display: "grid", gap: 12, maxWidth: 400 }}>
      <h1>Login AGF</h1>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ padding: 8 }}
      />

      <input
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        style={{ padding: 8 }}
      />

      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: 10,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p>{message}</p>
    </div>
  );
}
