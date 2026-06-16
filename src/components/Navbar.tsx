import { useState } from 'react';
import { Dropdown, Input, Drawer } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  LoginOutlined,
  MenuOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useCart } from '../contexts/useCart';
import { useBreakpoint } from '../utils/useBreakpoint';
import SearchPanel from './SearchPanel';

const { Search } = Input;

function CartButton({ onNavigate, totalItems }: { onNavigate: () => void; totalItems: number }) {
  return (
    <div
      onClick={onNavigate}
      style={{
        width: 38, height: 38, borderRadius: 8,
        border: '1px solid #d0d0d0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00a63e'; e.currentTarget.style.color = '#00a63e'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d0d0d0'; e.currentTarget.style.color = 'inherit'; }}
    >
      <ShoppingCartOutlined style={{ fontSize: 18 }} />
      {totalItems > 0 && (
        <div style={{
          position: 'absolute', top: -8, right: -8,
          background: '#f5222d', color: '#fff',
          fontSize: 10, fontWeight: 700,
          width: 18, height: 18, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {totalItems > 99 ? '99+' : totalItems}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { isMobile, isTablet } = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Tài khoản của tôi', onClick: () => navigate('/profile') },
    { key: 'orders', icon: <HistoryOutlined />, label: 'Đơn hàng của tôi', onClick: () => navigate('/orders') },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: handleLogout },
  ];

  const menuItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/products' },
    { label: 'Giới thiệu', path: '/introduce' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 1001 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 54 }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/')}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #00a63e 0%, #4caf50 50%, #81c784 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid #1b5e20', boxShadow: '0 2px 8px rgba(46,125,50,0.3)' }}>
              🍒
            </div>
            <span style={{ fontSize: 19, fontWeight: 900, color: '#00a63e', fontFamily: "'Georgia', serif" }}>Halona</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <button
              onClick={() => setSearchOpen(true)}
              style={{ width: 38, height: 38, borderRadius: 8, border: '1px solid #d0d0d0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#333' }}
            >
              <SearchOutlined />
            </button>
            <CartButton onNavigate={() => navigate('/cart')} totalItems={totalItems} />
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20, color: '#333', display: 'flex', alignItems: 'center', padding: '6px 4px' }}
            >
              <MenuOutlined />
            </button>
          </div>
        </div>
        {/* <div style={{ padding: '0 16px 10px' }}>
          <Search placeholder="Tìm kiếm sản phẩm..." onSearch={handleSearch} allowClear style={{ width: '100%' }} />
        </div> */}

        <Drawer
          title={<span style={{ color: '#00a63e', fontWeight: 700 }}>🍒 Halona Fruits</span>}
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          zIndex={1100}
           width={260}
          styles={{ body: { padding: 0 } }}
        >
          <div>
            {menuItems.map((item) => (
              <div
                key={item.path}
                onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                style={{
                  padding: '14px 20px',
                  fontSize: 15, fontWeight: isActive(item.path) ? 700 : 500,
                  cursor: 'pointer',
                  color: isActive(item.path) ? '#00a63e' : '#333',
                  background: isActive(item.path) ? '#f0faf3' : 'transparent',
                  borderLeft: `3px solid ${isActive(item.path) ? '#00a63e' : 'transparent'}`,
                  borderBottom: '1px solid #f5f5f5',
                  transition: 'all 0.15s',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: <UserOutlined />, label: 'Tài khoản của tôi', path: '/profile' },
                  { icon: <HistoryOutlined />, label: 'Đơn hàng của tôi', path: '/orders' },
                ].map((item) => (
                  <div
                    key={item.path}
                    onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                    style={{ padding: '11px 0', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#333', borderBottom: '1px solid #f5f5f5' }}
                  >
                    {item.icon} {item.label}
                  </div>
                ))}
                <div
                  onClick={() => { handleLogout(); setDrawerOpen(false); }}
                  style={{ padding: '11px 0', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#ff4d4f' }}
                >
                  <LogoutOutlined /> Đăng xuất
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  onClick={() => { navigate('/login'); setDrawerOpen(false); }}
                  style={{ padding: '12px 0', background: '#00a63e', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
                >
                  <LoginOutlined /> Đăng nhập
                </div>
                <div
                  onClick={() => { navigate('/register'); setDrawerOpen(false); }}
                  style={{ padding: '12px 0', background: '#fff', color: '#00a63e', border: '1px solid #00a63e', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
                >
                  Đăng ký
                </div>
              </div>
            )}
          </div>
        </Drawer>
        <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    );
  }

  /* ── Tablet ── */
  if (isTablet) {
    return (
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 1001 }}>
        <div style={{ maxWidth: 1200, margin: '3px 0', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} onClick={() => navigate('/')}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00a63e 0%, #4caf50 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '2px solid #1b5e20' }}>🍒</div>
            <span style={{ fontSize: 19, fontWeight: 800, color: '#00a63e', fontFamily: "'Georgia', serif" }}>Halona</span>
          </div>
          <div style={{ flex: 1 }}>
            <Search placeholder="Tìm kiếm..." onSearch={handleSearch} allowClear style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <div key={item.path} onClick={() => navigate(item.path)} style={{ padding: '7px 11px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: isActive(item.path) ? '#00a63e' : 'transparent', color: isActive(item.path) ? '#fff' : '#333', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = '#f0f0f0'; }}
                onMouseLeave={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = 'transparent'; }}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <CartButton onNavigate={() => navigate('/cart')} totalItems={totalItems} />
            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <UserOutlined style={{ fontSize: 16 }} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{user?.name?.split(' ').pop()}</span>
                </div>
              </Dropdown>
           ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div onClick={() => navigate('/register')} style={{ padding: '7px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#00a63e', border: '1px solid #00a63e', whiteSpace: 'nowrap' }}>
                  Đăng ký
                </div>
                <div onClick={() => navigate('/login')} style={{ padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#00a63e', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <LoginOutlined /> Đăng nhập
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Desktop ── */
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 1001 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} onClick={() => navigate('/')}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #00a63e 0%, #4caf50 50%, #81c784 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '3px solid #1b5e20', boxShadow: '0 2px 8px rgba(46,125,50,0.3)' }}>
            🍒
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: '#00a63e', fontFamily: "'Georgia', serif", letterSpacing: -0.5 }}>Halona</div>
            <div style={{ fontSize: 12, color: '#4caf50', fontWeight: 600, letterSpacing: 1 }}>Fruits</div>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: 400 }}>
          <Search placeholder="Tìm kiếm..." onSearch={handleSearch} size="large" allowClear style={{ width: '100%' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {menuItems.map((item) => (
            <div key={item.path} onClick={() => navigate(item.path)} style={{ padding: '8px 18px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', background: isActive(item.path) ? '#00a63e' : 'transparent', color: isActive(item.path) ? '#fff' : '#333' }}
              onMouseEnter={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = '#f0f0f0'; }}
              onMouseLeave={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = 'transparent'; }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <CartButton onNavigate={() => navigate('/cart')} totalItems={totalItems} />
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 6, transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <UserOutlined style={{ fontSize: 16 }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div onClick={() => navigate('/register')} style={{ padding: '8px 18px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#00a63e', border: '1px solid #00a63e', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f0faf3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
              >
                Đăng ký
              </div>
              <div onClick={() => navigate('/login')} style={{ padding: '8px 18px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#00a63e', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1b5e20')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#00a63e')}
              >
                <LoginOutlined /> Đăng nhập
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
