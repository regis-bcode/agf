"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useParams, useRouter } from "next/navigation";

type ProjectDetails = {
  id: string;
  portfolio_id: string;
  name: string;
  client_name: string | null;
  manager_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  created_at: string;
  portfolios?: { id: string; name: string } | null;
};

type Feedback = {
  type: "success" | "error";
  text: string;
};

export default function ProjectDetailPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const loadProject = useCallback(async () => {
    setFeedback(null);

    const { data, error } = await supabase
      .from("projects")
      .select(
        "id,portfolio_id,name,client_name,manager_id,status,start_date,end_date,description,created_at,portfolios(id,name)",
      )
      .eq("id", projectId)
      .single();

    if (error) {
      setFeedback({ type: "error", text: `Erro ao carregar projeto: ${error.message}` });
      return;
    }

    setProject(data as ProjectDetails);
  }, [projectId, supabase]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      try {
        await loadProject();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadProject, router, supabase]);

  async function onDelete() {
    if (!project) return;

    const ok = window.confirm("Tem certeza que deseja excluir este projeto?");
    if (!ok) return;

    setDeleting(true);
    setFeedback(null);

    const { error } = await supabase.from("projects").delete().eq("id", project.id);

    setDeleting(false);

    if (error) {
      setFeedback({ type: "error", text: `Erro ao excluir projeto: ${error.message}` });
      return;
    }

    router.push("/app/projects");
  }

  if (loading) {
    return <p>Carregando projeto...</p>;
  }

  if (!project) {
    return (
      <div className="grid gap-3">
        <p>Projeto não encontrado.</p>
        {feedback ? <p className="text-sm text-red-600">{feedback.text}</p> : null}
        <Link className="underline" href="/app/projects">
          Voltar para Projetos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Projeto: {project.name}</h1>
        <div className="flex gap-3 text-sm">
          <Link className="underline" href={`/app/projects/${project.id}/edit`}>
            Editar
          </Link>
          <button
            type="button"
            onClick={() => void onDelete()}
            className="text-red-700 underline disabled:opacity-60"
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>

      <dl className="grid gap-3 rounded border border-gray-300 p-4">
        <div>
          <dt className="text-sm text-gray-600">ID</dt>
          <dd className="font-mono text-sm">{project.id}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Portfólio</dt>
          <dd>{project.portfolios?.name ?? project.portfolio_id}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Cliente</dt>
          <dd>{project.client_name ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Manager ID</dt>
          <dd className="font-mono text-sm">{project.manager_id}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Status</dt>
          <dd>{project.status}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Início</dt>
          <dd>{project.start_date ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Fim</dt>
          <dd>{project.end_date ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Descrição</dt>
          <dd>{project.description ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Criado em</dt>
          <dd>{new Date(project.created_at).toLocaleString()}</dd>
        </div>
      </dl>

      <Link className="w-fit underline" href={`/app/tasks?project=${project.id}`}>
        View Tasks for this Project
      </Link>

      <Link className="w-fit underline" href="/app/projects">
        Voltar para Projetos
      </Link>

      {feedback ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}
