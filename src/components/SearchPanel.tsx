import { useState, useEffect } from 'react';
import { SearchOutlined, CloseOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface Category { id: number; name: string; }

const BRAND = '#00a63e';

export default function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open && categories.length === 0) {
      axiosClient.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
    }
  }, [open, categories.length]);

  if (!open) return null;

  const goSearch = (value: string) => {
    if (!value.trim()) return;
    navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    onClose();
    setKeyword('');
  };

  const goCategory = (id: number) => {
    navigate(`/products?category=${id}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop mờ phía sau */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1100 }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1101,
          background: '#fff', borderRadius: '0 0 16px 16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          padding: '16px', maxWidth: 720, margin: '0 auto',
        }}
      >
        {/* Ô nhập */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1.5px solid ${BRAND}`, borderRadius: 10, padding: '10px 14px' }}>
          <SearchOutlined style={{ color: BRAND, fontSize: 18 }} />
          <input
            autoFocus
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') goSearch(keyword); }}
            placeholder="Tìm kiếm nhanh"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15 }}
          />
          <CloseOutlined onClick={onClose} style={{ color: '#999', cursor: 'pointer' }} />
        </div>

        {/* Top tìm kiếm — từ categories */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: BRAND, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
            <FireOutlined /> Top tìm kiếm
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => goCategory(c.id)}
                style={{
                  padding: '7px 14px', borderRadius: 20, border: '1px solid #e0e0e0',
                  background: '#fafafa', color: '#444', fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; e.currentTarget.style.background = '#f0faf3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#444'; e.currentTarget.style.background = '#fafafa'; }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ưu đãi hot */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e07a3c', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            🎁 Ưu đãi hot
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, color: '#666', fontSize: 13 }}>
            <span>+ Nhập mã HALONA10 giảm 10% cho đơn đầu tiên</span>
            <span>+ Miễn phí giao hàng cho đơn từ 200.000đ</span>
            <span>+ Trái cây tươi mới mỗi ngày, đổi trả trong 24h</span>
          </div>
        </div>
      </div>
    </>
  );
}