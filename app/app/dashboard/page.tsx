"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function run() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserEmail(data.user.email ?? "");
    }

    run();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div>
      <h1>Dashboard AGF</h1>
      <p>Usuário logado: {userEmail}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}