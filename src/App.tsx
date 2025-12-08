import { useState } from 'react';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { UserPanel } from './components/UserPanel';
import { AdminPanel } from './components/AdminPanel';
import { Confirmation } from './components/Confirmation';

type Page = 'home' | 'auth' | 'user' | 'admin' | 'confirmation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userType, setUserType] = useState<string>('user');
  const [purchaseData, setPurchaseData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'user' || page === 'admin') {
      setUserType(data);
    }
    if (page === 'confirmation') {
      setPurchaseData(data);
    }
    setCurrentPage(page as Page);
  };

  return (
    <>
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'auth' && <Auth onNavigate={handleNavigate} />}
      {currentPage === 'user' && <UserPanel onNavigate={handleNavigate} />}
      {currentPage === 'admin' && <AdminPanel onNavigate={handleNavigate} />}
      {currentPage === 'confirmation' && (
        <Confirmation onNavigate={handleNavigate} purchaseData={purchaseData} />
      )}
    </>
  );
}
