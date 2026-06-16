import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined, HomeFilled,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge } from 'antd';
import { useCart } from '../contexts/useCart';

const BRAND = '#00a63e';

export default function MobileFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

    const cartCount = totalItems;

  const items = [
    { key: '/',         label: 'Trang chủ', icon: <HomeOutlined />,         activeIcon: <HomeFilled /> },
    { key: '/products', label: 'Sản phẩm',  icon: <AppstoreOutlined />,     activeIcon: <AppstoreOutlined /> },
    { key: '/cart',     label: 'Giỏ hàng',  icon: <ShoppingCartOutlined />, activeIcon: <ShoppingCartOutlined />, badge: cartCount },
    { key: '/profile',  label: 'Tài khoản', icon: <UserOutlined />,         activeIcon: <UserOutlined /> },
  ];

  const isActive = (key: string) =>
    key === '/' ? location.pathname === '/' : location.pathname.startsWith(key);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: 62,
        background: '#fff',
        borderTop: '1px solid #eee',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        display: 'flex',
        zIndex: 1000,
      }}
    >
      {items.map((item) => {
        const active = isActive(item.key);
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.key)}
            style={{
              flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, color: active ? BRAND : '#999', transition: 'color 0.18s',
            }}
          >
            <span style={{ fontSize: 20, color: active ? BRAND : '#999' }}>
              {item.badge ? (
                <Badge count={item.badge} size="small" offset={[2, -2]}>
                  <span style={{ fontSize: 20, color: active ? BRAND : '#999' }}>
                    {active ? item.activeIcon : item.icon}
                  </span>
                </Badge>
              ) : (
                active ? item.activeIcon : item.icon
              )}
            </span>
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}