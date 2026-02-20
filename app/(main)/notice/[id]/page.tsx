import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import NoticeActions from "./_components/NoticeActions";

export const dynamic = "force-dynamic";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) return <div className="p-8">글을 찾을 수 없어요.</div>;

  const { data: files } = await supabase
    .from("post_attachments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-3 text-sm opacity-60">{post.category}</div>
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <div className="mt-2 text-sm opacity-60">
        {new Date(post.published_at).toLocaleDateString("ko-KR")}
      </div>
      <NoticeActions postId={id} />

      {post.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image_url}
          alt=""
          className="mt-6 w-full rounded-2xl border object-cover"
        />
      )}

      <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed">
        {post.content}
      </div>

      {files && files.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">첨부파일</h2>
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f.id}>
                <a className="underline" href={f.file_url} target="_blank" rel="noreferrer">
                  {f.file_name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 border-t pt-8">
        <Link
          href="/notice"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          ← 목록보기
        </Link>
      </div>
    </main>
  );
}
