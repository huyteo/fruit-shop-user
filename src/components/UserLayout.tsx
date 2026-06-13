import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import ChatWidget from './ChatWidget';

export default function UserLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <FooterSection />
      <ChatWidget />
    </div>
  );
}