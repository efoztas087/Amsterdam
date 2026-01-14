import "../globals.css";

import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-root">
      <PublicNav />
      {children}
      <Footer />
    </div>
  );
}