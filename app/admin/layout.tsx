import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col bg-neutral-50">
        <div className="mx-auto w-full max-w-5xl flex-1 px-8 py-12">{children}</div>
      </main>
      <Footer />
    </div>
  );
}