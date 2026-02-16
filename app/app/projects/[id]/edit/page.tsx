"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "../../../../lib/supabase/client";
import { useParams, useRouter } from "next/navigation";

type Portfolio = {
  id: string;
  name: string;
};

type ProjectFormData = {
  id: string;
  portfolio_id: string;
  name: string;
  client_name: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

type Feedback = {
  type: "success" | "error";
  text: string;
};

export default function EditProjectPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [portfolioId, setPortfolioId] = useState("");
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const loadPortfolios = useCallback(async () => {
    const { data, error } = await supabase
      .from("portfolios")
      .select("id,name")
      .order("name", { ascending: true });

    if (error) {
      setFeedback({ type: "error", text: `Erro ao carregar portfólios: ${error.message}` });
      return;
    }

    setPortfolios((data ?? []) as Portfolio[]);
  }, [supabase]);

  const loadProject = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id,portfolio_id,name,client_name,status,start_date,end_date,description")
      .eq("id", projectId)
      .single();

    if (error) {
      setFeedback({ type: "error", text: `Erro ao carregar projeto: ${error.message}` });
      return;
    }

    const project = data as ProjectFormData;
    setPortfolioId(project.portfolio_id);
    setName(project.name);
    setClientName(project.client_name ?? "");
    setStatus(project.status ?? "ACTIVE");
    setStartDate(project.start_date ?? "");
    setEndDate(project.end_date ?? "");
    setDescription(project.description ?? "");
  }, [projectId, supabase]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      try {
        await Promise.all([loadPortfolios(), loadProject()]);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadPortfolios, loadProject, router, supabase]);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    if (!portfolioId) {
      setFeedback({ type: "error", text: "Selecione um portfólio." });
      return;
    }

    if (!name.trim()) {
      setFeedback({ type: "error", text: "Nome do projeto é obrigatório." });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("projects")
      .update({
        portfolio_id: portfolioId,
        name: name.trim(),
        client_name: clientName.trim() || null,
        status,
        start_date: startDate || null,
        end_date: endDate || null,
        description: description.trim() || null,
      })
      .eq("id", projectId);

    setSaving(false);

    if (error) {
      setFeedback({ type: "error", text: `Erro ao atualizar projeto: ${error.message}` });
      return;
    }

    setFeedback({ type: "success", text: "Projeto atualizado com sucesso." });
    router.push(`/app/projects/${projectId}`);
  }

  if (loading) {
    return <p>Carregando formulário...</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">Editar Projeto</h1>

      <form className="grid gap-3 rounded border border-gray-300 p-4" onSubmit={onSave}>
        <label className="grid gap-1">
          <span className="text-sm">Portfólio *</span>
          <select
            className="rounded border border-gray-300 p-2"
            value={portfolioId}
            onChange={(e) => setPortfolioId(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {portfolios.map((portfolio) => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Nome do Projeto *</span>
          <input
            className="rounded border border-gray-300 p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Cliente</span>
          <input
            className="rounded border border-gray-300 p-2"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Status</span>
          <select
            className="rounded border border-gray-300 p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="PAUSED">PAUSED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm">Início</span>
            <input
              className="rounded border border-gray-300 p-2"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Fim</span>
            <input
              className="rounded border border-gray-300 p-2"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Descrição</span>
          <textarea
            className="rounded border border-gray-300 p-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <Link className="self-center underline" href={`/app/projects/${projectId}`}>
            Cancelar
          </Link>
        </div>
      </form>

      {feedback ? (
        <p
          className={`rounded border p-3 text-sm ${
            feedback.type === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-green-300 bg-green-50 text-green-700"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}
