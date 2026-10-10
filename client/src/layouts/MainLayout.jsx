import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function MainLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
