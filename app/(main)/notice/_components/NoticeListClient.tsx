"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

const CATEGORY_LABEL: Record<string, string> = {
  뉴스: "NEWS",
  공지: "NOTICE",
  프로젝트: "PROJECT",
};

const TABS = [
  { id: "all" as const, label: "All" },
  { id: "news" as const, label: "News" },
  { id: "project" as const, label: "Project" },
  { id: "notice" as const, label: "Notice" },
];

function formatDateKR(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR");
}

function isNew(createdAt?: string) {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const diffHours = (Date.now() - created) / (1000 * 60 * 60);
  return diffHours <= 72;
}

type Post = {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  category?: string;
  published_at?: string;
  pinned?: boolean;
  created_at?: string;
  list_order?: number | null;
};

/* 카드 공통 내용 */
function CardContent({
  post,
  asLink = true,
}: {
  post: Post;
  asLink?: boolean;
}) {
  const inner = (
    <>
      <div className="aspect-[16/9] w-full bg-neutral-100">
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            이미지 없음
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500">
          <span className="rounded-full bg-neutral-800 px-2 py-0.5 font-medium text-white">
            {CATEGORY_LABEL[post.category ?? ""] ?? post.category}
          </span>
          <span>{formatDateKR(post.published_at)}</span>
          {post.pinned && <span>📌</span>}
          {isNew(post.created_at) && (
            <span className="font-semibold text-orange-500">N</span>
          )}
        </div>
        <h2 className="line-clamp-1 text-base font-semibold">{post.title}</h2>
        {post.content && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
            {post.content}
          </p>
        )}
      </div>
    </>
  );

  if (asLink) {
    return (
      <Link
        href={`/notice/${post.id}`}
        className="block overflow-hidden transition-shadow hover:shadow-md"
      >
        {inner}
      </Link>
    );
  }
  return <div className="block overflow-hidden">{inner}</div>;
}

/* 고객용: 카드 (링크만) */
function CustomerCard({ post }: { post: Post }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <CardContent post={post} />
    </div>
  );
}

/* 관리자용: 드래그·체크·휴지통 카드 */
function SortableAdminCard({
  post,
  isSelected,
  onToggleSelect,
  onDelete,
}: {
  post: Post;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
    attributes,
    listeners,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative overflow-hidden rounded-2xl border bg-white ${
        isDragging ? "z-10 opacity-80 shadow-lg" : ""
      } ${isSelected ? "ring-2 ring-neutral-900" : ""}`}
    >
      {/* 상단 우측: 체크박스, 드래그, 휴지통 */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-neutral-300"
          aria-label={`${post.title} 선택`}
        />
        <button
          type="button"
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg bg-white/90 text-neutral-500 hover:bg-white hover:text-neutral-700 active:cursor-grabbing"
          aria-label="드래그하여 순서 변경"
          {...attributes}
          {...listeners}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-500 hover:bg-red-50 hover:text-red-600"
          aria-label="삭제"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
      <CardContent post={post} />
    </div>
  );
}

export default function NoticeListClient({
  initialPosts,
  total,
  tab,
  page,
  perPage,
}: {
  initialPosts: Post[];
  total: number;
  tab: string;
  page: number;
  perPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserSupabase();
  const [posts, setPosts] = React.useState(initialPosts);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setIsAdmin(!!data.session);
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  function handleTabChange(newTab: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("tab", newTab);
    p.set("page", "1");
    router.push(`/notice?${p.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", String(newPage));
    router.push(`/notice?${p.toString()}`);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDeleteOne(postId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 글을 삭제할까요?")) return;
    await deletePosts([postId]);
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`선택한 ${selectedIds.size}개 글을 삭제할까요?`)) return;
    await deletePosts(Array.from(selectedIds));
    setSelectedIds(new Set());
  }

  async function deletePosts(ids: string[]) {
    setDeleting(true);
    try {
      for (const id of ids) {
        await supabase.from("post_attachments").delete().eq("post_id", id);
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (error) throw error;
      }
      setPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      router.refresh();
    } catch (e) {
      alert((e as Error).message ?? "삭제 중 오류");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !isAdmin) return;

    const oldIndex = posts.findIndex((p) => p.id === active.id);
    const newIndex = posts.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const prevPosts = [...posts];
    const newOrder = arrayMove(posts, oldIndex, newIndex);
    setPosts(newOrder);

    const from = (page - 1) * perPage;
    const updates = newOrder.map((p, i) => ({
      id: p.id,
      pinned_order: from + i,
    }));

    try {
      for (const u of updates) {
        const { error } = await supabase
          .from("posts")
          .update({ pinned_order: u.pinned_order })
          .eq("id", u.id);
        if (error) throw error;
      }
      router.refresh();
    } catch {
      setPosts(prevPosts);
    }
  }

  return (
    <div>
      {/* 탭 + 글쓰기 버튼 */}
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-neutral-200">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-b-2 border-neutral-900 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {isAdmin && (
          <div className="flex shrink-0 items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={deleting}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                선택 삭제 ({selectedIds.size})
              </button>
            )}
            <Link
              href="/admin/posts/new"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              글쓰기
            </Link>
          </div>
        )}
      </div>

      {/* 목록: 고객=카드 그리드, 관리자=드래그 가능 리스트 */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center text-neutral-500">
          등록된 글이 없습니다.
        </div>
      ) : isAdmin ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={posts.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <SortableAdminCard
                  key={post.id}
                  post={post}
                  isSelected={selectedIds.has(post.id)}
                  onToggleSelect={() => toggleSelect(post.id)}
                  onDelete={(e) => handleDeleteOne(post.id, e)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <CustomerCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ←
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`min-w-[36px] rounded-lg px-3 py-1.5 text-sm ${
                    page === p
                      ? "bg-neutral-900 text-white"
                      : "border hover:bg-neutral-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
