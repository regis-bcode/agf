"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

type Portfolio = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  portfolio_id: string;
  name: string;
  client_name: string | null;
  manager_id: string;
  status: "ACTIVE" | "PAUSED" | "CLOSED" | string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  created_at: string;
  portfolios?: { name: string } | null;
};

export default function ProjectsPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [filterPortfolioId, setFilterPortfolioId] = useState("ALL");

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
      setMsg(`Erro ao carregar portfólios: ${error.message}`);
      return;
    }

    const list = (data ?? []) as Portfolio[];
    setPortfolios(list);
    if (!portfolioId && list.length > 0) {
      setPortfolioId(list[0].id);
    }
  }, [portfolioId, supabase]);

  const loadProjects = useCallback(async (portfolioFilter: string) => {
    setMsg("");

    let query = supabase
      .from("projects")
      .select(
        "id,portfolio_id,name,client_name,manager_id,status,start_date,end_date,description,created_at,portfolios(name)",
      )
      .order("created_at", { ascending: false });

    if (portfolioFilter !== "ALL") {
      query = query.eq("portfolio_id", portfolioFilter);
    }

    const { data, error } = await query;

    if (error) {
      setMsg(`Erro ao carregar projetos: ${error.message}`);
      return;
    }

    setProjects((data ?? []) as Project[]);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      await Promise.all([loadPortfolios(), loadProjects("ALL")]);
      setLoading(false);
    })();
  }, [loadPortfolios, loadProjects, router, supabase]);

  async function onCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    if (!portfolioId) {
      setMsg("Selecione um portfólio.");
      return;
    }

    if (!name.trim()) {
      setMsg("Informe o nome do projeto.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);
      setMsg("Sessão inválida. Faça login novamente.");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("projects").insert({
      portfolio_id: portfolioId,
      name: name.trim(),
      client_name: clientName.trim() || null,
      manager_id: user.id,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
      description: description.trim() || null,
    });

    setSaving(false);

    if (error) {
      setMsg(`Erro ao criar projeto: ${error.message}`);
      return;
    }

    setName("");
    setClientName("");
    setStatus("ACTIVE");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setMsg("Projeto criado com sucesso.");
    await loadProjects(filterPortfolioId);
  }

  async function onChangeFilter(nextFilter: string) {
    setFilterPortfolioId(nextFilter);
    await loadProjects(nextFilter);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">Projetos</h1>

      <section className="rounded border border-gray-300 p-4">
        <h2 className="mb-3 text-lg font-medium">Criar Projeto</h2>
        <form className="grid gap-3" onSubmit={onCreateProject}>
          <label className="grid gap-1">
            <span className="text-sm">Portfólio *</span>
            <select
              className="rounded border border-gray-300 p-2"
              value={portfolioId}
              onChange={(e) => setPortfolioId(e.target.value)}
              required
            >
              {portfolios.length === 0 ? <option value="">Sem portfólios</option> : null}
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

          <button
            className="w-fit rounded bg-black px-4 py-2 text-white disabled:opacity-60"
            type="submit"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Criar Projeto"}
          </button>
        </form>
      </section>

      <section className="rounded border border-gray-300 p-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-medium">Lista de Projetos</h2>
          <label className="grid gap-1">
            <span className="text-sm">Filtrar por Portfólio</span>
            <select
              className="rounded border border-gray-300 p-2"
              value={filterPortfolioId}
              onChange={(e) => void onChangeFilter(e.target.value)}
            >
              <option value="ALL">Todos</option>
              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? <p>Carregando projetos...</p> : null}

        {!loading && projects.length === 0 ? <p>Nenhum projeto encontrado.</p> : null}

        <div className="grid gap-3">
          {projects.map((project) => (
            <article key={project.id} className="rounded border border-gray-200 p-3">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">
                Portfólio: {project.portfolios?.name ?? "-"} · Status: {project.status}
              </p>
              {project.client_name ? <p className="text-sm">Cliente: {project.client_name}</p> : null}
              <div className="mt-2 flex gap-4 text-sm">
                <Link className="underline" href={`/app/projects/${project.id}`}>
                  Ver detalhes
                </Link>
                <Link className="underline" href={`/app/projects/${project.id}/edit`}>
                  Editar
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {msg ? <p className="rounded border border-gray-300 bg-gray-50 p-3 text-sm">{msg}</p> : null}
    </div>
  );
}
