import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />
      <main className="flex-1 pt-11">{children}</main>
      <Footer />
    </div>
  );
}