import { Suspense } from "react";
import { fetchPostListFiltered } from "@/lib/posts";
import NoticeListClient from "./_components/NoticeListClient";

export const dynamic = "force-dynamic";

type TabId = "all" | "news" | "project" | "notice";

export default async function NoticeListPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const params = await searchParams;
  const tab = (params.tab ?? "all") as TabId;
  const validTabs = ["all", "news", "project", "notice"];
  const safeTab = validTabs.includes(tab) ? tab : "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const perPage = 10;

  const { posts, total } = await fetchPostListFiltered(
    safeTab,
    page,
    perPage
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold">
        Updates &amp; Disclosures
      </h1>
      <Suspense fallback={<div className="py-12">불러오는 중…</div>}>
        <NoticeListClient
          initialPosts={posts}
          total={total}
          tab={safeTab}
          page={page}
          perPage={perPage}
        />
      </Suspense>
    </main>
  );
}
