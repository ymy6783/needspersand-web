"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();

  const [email, setEmail] = useState("ymy.needspersand@gmail.com");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push("/admin/posts/new");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">관리자 로그인</h1>

      <form onSubmit={onLogin} className="mt-6 space-y-3">
        <label className="block">
          <div className="mb-1 text-sm opacity-70">Email</div>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm opacity-70">Password</div>
          <input
            className="w-full rounded-xl border px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button className="w-full rounded-xl border px-3 py-2 font-medium hover:bg-black/5">
          로그인
        </button>

        {msg && <p className="text-sm text-red-600">{msg}</p>}
      </form>
    </main>
  );
}