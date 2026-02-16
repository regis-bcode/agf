"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

type Portfolio = {
  id: string;
  name: string;
  description: string | null;
  status?: string | null;
  created_at?: string;
};

export default function PortfolioPage() {
  const supabase = createClient();
  const router = useRouter();

  const [items, setItems] = useState<Portfolio[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      // Proteção simples (garante sessão)
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      await load();
    })();
  }, []);

  async function load() {
    setMsg("");
    const { data, error } = await supabase
      .from("portfolios")
      .select("id,name,description,status,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg("Erro ao carregar: " + error.message);
      return;
    }
    setItems((data ?? []) as Portfolio[]);
  }

  async function create() {
    setMsg("");
    if (!name.trim()) {
      setMsg("Informe o nome do portfólio.");
      return;
    }

    const { error } = await supabase.from("portfolios").insert({
      name: name.trim(),
      description: description.trim() || null,
      status: "ACTIVE",
      // owner_id existe no seu schema baseline; vamos preencher com o user logado
      owner_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      setMsg("Erro ao criar: " + error.message);
      return;
    }

    setName("");
    setDescription("");
    setMsg("Portfólio criado com sucesso.");
    await load();
  }

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 720 }}>
      <h1>Portfólio</h1>

      <div style={{ display: "grid", gap: 8, padding: 12, border: "1px solid #333" }}>
        <input
          placeholder="Nome do Portfólio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10 }}
        />
        <input
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 10 }}
        />
        <button onClick={create} style={{ padding: 10, cursor: "pointer" }}>
          Criar
        </button>
        {msg && <p>{msg}</p>}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {items.map((p) => (
          <div key={p.id} style={{ padding: 12, border: "1px solid #333" }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            {p.description && <div style={{ opacity: 0.8 }}>{p.description}</div>}
            {p.status && <div style={{ opacity: 0.8 }}>Status: {p.status}</div>}
          </div>
        ))}
        {items.length === 0 && <p>Nenhum portfólio cadastrado ainda.</p>}
      </div>
    </div>
  );
}
