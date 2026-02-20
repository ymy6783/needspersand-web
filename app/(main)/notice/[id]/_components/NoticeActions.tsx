"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

export default function NoticeActions({ postId }: { postId: string }) {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setIsAdmin(!!data.session);
      setLoading(false);
    })();
  }, []);

  if (loading || !isAdmin) return null;

  async function handleDelete() {
    if (!confirm("정말 이 글을 삭제할까요?")) return;
    setDeleting(true);
    try {
      await supabase.from("post_attachments").delete().eq("post_id", postId);
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw new Error(error.message);
      router.push("/notice");
      router.refresh();
    } catch (e) {
      alert((e as Error).message ?? "삭제 중 오류");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mt-6 flex gap-2">
      <Link
        href={`/admin/posts/${postId}/edit`}
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-black/5"
      >
        수정
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? "삭제 중…" : "삭제"}
      </button>
    </div>
  );
}
