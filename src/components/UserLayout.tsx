import { Outlet, useLocation } from 'react-router-dom';
import { useBreakpoint } from '../utils/useBreakpoint';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import MobileFooter from './MobileFooter';
import ChatWidget from './ChatWidget';

export default function UserLayout() {
  const { isSmallMobile } = useBreakpoint();
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, paddingBottom: isSmallMobile ? 62 : 0 }}>
        <Outlet />
      </div>

      {isSmallMobile ? <MobileFooter /> : <FooterSection />}

      {!isChatPage && <ChatWidget />}
    </div>
  );
}