import { supabase } from "./supabaseClient";

function nowISO() {
  return new Date().toISOString();
}

function visibleQuery(q: any) {
  // is_published=true AND published_at<=now AND (expired_at null OR expired_at>now)
  return q
    .eq("is_published", true)
    .lte("published_at", nowISO())
    .or(`expired_at.is.null,expired_at.gt.${nowISO()}`);
}

// 좌측: 공지/프로젝트 중 1개 (pinned 우선)
export async function fetchNoticeHighlightOne() {
  const pinned = await visibleQuery(
    supabase
      .from("posts")
      .select("*")
      .in("category", ["공지", "프로젝트"])
      .eq("pinned", true)
      .order("pinned_order", { ascending: true })
      .order("published_at", { ascending: false })
      .limit(1)
  ).maybeSingle();

  if (pinned.data) return pinned.data;

  const latest = await visibleQuery(
    supabase
      .from("posts")
      .select("*")
      .in("category", ["공지", "프로젝트"])
      .order("published_at", { ascending: false })
      .limit(1)
  ).maybeSingle();

  return latest.data ?? null;
}

// 우측: 뉴스 리스트 (슬라이드용 데이터)
export async function fetchNewsCards(limit = 6) {
  const { data } = await visibleQuery(
    supabase
      .from("posts")
      .select("*")
      .eq("category", "뉴스")
      .order("pinned", { ascending: false })
      .order("pinned_order", { ascending: true })
      .order("published_at", { ascending: false })
      .limit(limit)
  );

  return data ?? [];
}

// 게시글 목록 (공지/프로젝트/뉴스 전체)
export async function fetchPostList(limit = 50) {
  const { data } = await visibleQuery(
    supabase
      .from("posts")
      .select("*")
      .order("pinned", { ascending: false })
      .order("pinned_order", { ascending: true })
      .order("published_at", { ascending: false })
      .limit(limit)
  );

  return data ?? [];
}

const CATEGORY_MAP: Record<string, string[]> = {
  all: [],
  news: ["뉴스"],
  project: ["프로젝트"],
  notice: ["공지"],
};

// 게시글 목록 (카테고리 필터, 페이지네이션)
export async function fetchPostListFiltered(
  category: "all" | "news" | "project" | "notice",
  page: number,
  perPage = 10
) {
  const cats = CATEGORY_MAP[category] ?? [];
  let q = visibleQuery(
    supabase.from("posts").select("*", { count: "exact" })
  );
  if (cats.length > 0) q = q.in("category", cats);

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, count, error } = await q
    .order("pinned", { ascending: false })
    .order("pinned_order", { ascending: true })
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) return { posts: [], total: 0 };
  return { posts: data ?? [], total: count ?? 0 };
}