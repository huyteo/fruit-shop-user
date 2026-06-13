import { Dropdown, Input } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useCart } from '../contexts/useCart';

const { Search } = Input;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

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
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Tài khoản của tôi',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'orders',
      icon: <HistoryOutlined />,
      label: 'Đơn hàng của tôi',
      onClick: () => navigate('/orders'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
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

  return (
    <div
      style={{
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
          onClick={() => navigate('/')}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00a63e 0%, #4caf50 50%, #81c784 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              border: '3px solid #1b5e20',
              boxShadow: '0 2px 8px rgba(46,125,50,0.3)',
            }}
          >
            🍒
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div
              style={{
                fontSize: 21,
                fontWeight: 800,
                color: '#00a63e',
                fontFamily: "'Georgia', serif",
                letterSpacing: -0.5,
              }}
            >
              Halona
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#4caf50',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              Fruits
            </div>
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: 400 }}>
          <Search
            placeholder="Tìm kiếm..."
            onSearch={handleSearch}
            size="large"
            allowClear
            style={{ width: '100%' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive(item.path) ? '#00a63e' : 'transparent',
                color: isActive(item.path) ? '#fff' : '#333',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexShrink: 0,
          }}
        >
          <div
            onClick={() => navigate('/cart')}
            style={{
              width: 40,
              height: 39,
              borderRadius: 8,
              border: '1px solid #648264',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00a63e';
              e.currentTarget.style.color = '#00a63e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#aba8a8';
              e.currentTarget.style.color = '#464444';
            }}
          >
            <ShoppingCartOutlined style={{ fontSize: 20 }} />
            {totalItems > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#f5222d',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalItems}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: 6,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = '#f0f0f0')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <UserOutlined style={{ fontSize: 16 }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {user?.name}
                </span>
              </div>
            </Dropdown>
          ) : (
            <div
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                background: '#00a63e',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#1b5e20')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = '#00a63e')
              }
            >
              <LoginOutlined />
              Đăng nhập
            </div>
          )}
        </div>
      </div>
    </div>
  );
}