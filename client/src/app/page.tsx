import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import LandingContent from "@/components/LandingContent";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">
        <LandingContent />
      </main>
      <Footer />
    </div>
  );
}
