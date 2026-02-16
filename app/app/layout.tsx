import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, padding: 16, borderRight: "1px solid #333" }}>
        <h3>AGF</h3>
        <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
          <Link href="/app/dashboard">Dashboard</Link>
          <Link href="/app/portfolio">Portfólio</Link>
          <Link href="/app/projects">Projetos</Link>
          <Link href="/app/tasks">Tarefas</Link>
          <Link href="/app/agenda/day">Agenda</Link>
          <Link href="/app/kanban">Kanban</Link>
          <Link href="/app/admin/users">Admin</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}