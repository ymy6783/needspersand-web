import { supabase } from "@/lib/supabaseClient";

export default async function SupabaseTestPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,category,pinned,created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return (
      <pre style={{ whiteSpace: "pre-wrap" }}>
        ERROR: {error.message}
      </pre>
    );
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
