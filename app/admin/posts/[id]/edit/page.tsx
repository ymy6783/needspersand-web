"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

type Category = "뉴스" | "공지" | "프로젝트";

export default function AdminEditPostPage() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("뉴스");
  const [pinned, setPinned] = useState(false);
  const [pinnedOrder, setPinnedOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState(true);
  const [publishedAt, setPublishedAt] = useState<string>("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    })();
  }, [router]);

  useEffect(() => {
    if (!ready || !postId) return;
    (async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();
      if (error || !post) {
        setMsg("글을 찾을 수 없어요.");
        setLoading(false);
        return;
      }
      setTitle(post.title ?? "");
      setContent(post.content ?? "");
      setCategory((post.category as Category) ?? "뉴스");
      setPinned(!!post.pinned);
      setPinnedOrder(Number(post.pinned_order) ?? 0);
      setIsPublished(!!post.is_published);
      setPublishedAt(
        post.published_at
          ? new Date(post.published_at).toISOString().slice(0, 16)
          : ""
      );
      setLoading(false);
    })();
  }, [ready, postId]);

  if (!ready) return null;
  if (loading) return <div className="p-10">불러오는 중…</div>;

  function safeFileName(name: string) {
    return name.replace(/[^\w.\-]+/g, "_");
  }

  function getContentType(file: File): string {
    if (file.type && file.type !== "application/octet-stream") return file.type;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      txt: "text/plain",
      zip: "application/zip",
    };
    return map[ext ?? ""] ?? "application/octet-stream";
  }

  async function uploadToBucket(bucket: string, file: File): Promise<string> {
    const ext = (file.name.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "");
    const path = `${Date.now()}_${Math.random().toString(16).slice(2)}.${ext}`;
    const contentType = getContentType(file);

    let result = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType,
    });

    // 400/InvalidMimeType 등 MIME 제한 시 octet-stream으로 재시도
    if (result.error) {
      const msg = result.error.message ?? "";
      const err = result.error as { statusCode?: number };
      const shouldRetry =
        err.statusCode === 400 ||
        msg.includes("400") ||
        msg.toLowerCase().includes("mime") ||
        msg.toLowerCase().includes("bad request") ||
        msg.toLowerCase().includes("invalid");
      if (shouldRetry && contentType !== "application/octet-stream") {
        result = await supabase.storage.from(bucket).upload(path, file, {
          upsert: false,
          contentType: "application/octet-stream",
        });
      }
    }
    if (result.error) throw new Error(result.error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit() {
    setMsg("");
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      const { data: existing } = await supabase
        .from("posts")
        .select("image_url")
        .eq("id", postId)
        .single();

      if (imageFile) {
        imageUrl = await uploadToBucket("notice-images", imageFile);
      } else if (existing?.image_url) {
        imageUrl = existing.image_url;
      }

      const updatePayload: Record<string, unknown> = {
        title,
        content,
        category,
        image_url: imageUrl ?? null,
        pinned,
        pinned_order: pinnedOrder,
        is_published: isPublished,
      };
      if (publishedAt)
        updatePayload.published_at = new Date(publishedAt).toISOString();

      const { error: postErr } = await supabase
        .from("posts")
        .update(updatePayload)
        .eq("id", postId);

      if (postErr) throw new Error(postErr.message);

      for (const f of attachmentFiles) {
        const url = await uploadToBucket("notice-attachments", f);
        const row = {
          post_id: postId,
          file_name: safeFileName(f.name),
          file_url: url,
          mime_type: f.type || getContentType(f) || null,
          file_size: f.size ?? null,
        };
        const { error: attErr } = await supabase.from("post_attachments").insert(row);
        if (attErr) throw new Error(`첨부파일 저장 실패: ${attErr.message}`);
      }

      setMsg("수정 완료!");
      router.push(`/notice/${postId}`);
      router.refresh();
    } catch (e: unknown) {
      setMsg((e as Error).message ?? "수정 중 오류");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">게시글 수정</h1>
        <div className="flex items-center gap-4">
          <Link
            href={`/notice/${postId}`}
            className="text-sm opacity-70 hover:opacity-100"
          >
            상세보기
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/admin/login");
            }}
            className="text-sm opacity-70 hover:opacity-100"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-sm opacity-70">카테고리</div>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              <option value="뉴스">뉴스</option>
              <option value="공지">공지</option>
              <option value="프로젝트">프로젝트</option>
            </select>
          </label>
          <label className="block">
            <div className="mb-1 text-sm opacity-70">게시 여부</div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span className="text-sm">노출(is_published)</span>
            </div>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-sm opacity-70">고정</div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
              <span className="text-sm">pinned</span>
            </div>
          </label>
          <label className="block">
            <div className="mb-1 text-sm opacity-70">고정 순서</div>
            <input
              className="w-full rounded-xl border px-3 py-2"
              type="number"
              value={pinnedOrder}
              onChange={(e) => setPinnedOrder(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="block">
          <div className="mb-1 text-sm opacity-70">예약 발행 시간(선택)</div>
          <input
            className="w-full rounded-xl border px-3 py-2"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm opacity-70">제목</div>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm opacity-70">본문</div>
          <textarea
            className="h-40 w-full rounded-xl border px-3 py-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm opacity-70">대표 이미지 변경</div>
          <label
            htmlFor="thumb-input-edit"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>파일 선택</span>
          </label>
          <input
            id="thumb-input-edit"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          <p className="mt-1 text-xs opacity-60">
            선택하지 않으면 기존 이미지 유지
          </p>
        </label>

        <label className="block">
          <div className="mb-1 text-sm opacity-70">추가 첨부파일</div>
          <label
            htmlFor="attach-input-edit"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>파일 선택</span>
          </label>
          <input
            id="attach-input-edit"
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              setAttachmentFiles((prev) => [...prev, ...files]);
              e.target.value = "";
            }}
          />
          {attachmentFiles.length > 0 && (
            <ul className="mt-2 space-y-1">
              {attachmentFiles.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-2 rounded-lg border bg-neutral-50 px-3 py-2"
                >
                  <span className="flex-1 truncate text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachmentFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-red-200 hover:text-red-600"
                    aria-label="삭제"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "저장 중…" : "수정 저장"}
        </button>

        {msg && <p className="text-sm opacity-70">{msg}</p>}
      </div>
    </main>
  );
}
