import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import { useCollection } from '../../hooks/useFirestore';
import { getMembersNeedingTransition } from '../../utils/ageUtils';

export default function Layout() {
  const { documents: members } = useCollection('members');
  const alertCount = getMembersNeedingTransition(members).length;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar alertCount={alertCount} />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-auto">
        <div>
          <p>Gia Đình Phật Tử Vĩnh An - Chùa Vĩnh An</p>
        </div>
      </footer>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'oklch(var(--b1))',
            color: 'oklch(var(--bc))',
          },
        }}
      />
    </div>
  );
}
