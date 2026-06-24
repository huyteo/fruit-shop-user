import { useBreakpoint } from '../utils/useBreakpoint';

export default function FooterSection() {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <footer>
      {/* Main Footer */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)',
          padding: isMobile ? '40px 20px 0' : isTablet ? '48px 32px 0' : '56px 48px 0',
          color: '#fff',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.4fr 1fr 1fr 1fr',
            gap: isMobile ? 32 : 40,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #00a63e, #4caf50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                🍒
              </div>
              <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Halona</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#4caf50', marginLeft: 4 }}>Fruits</span>
              </div>
            </div>
            <p style={{ color: '#8899aa', fontSize: 14, lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
              Cung cấp trái cây tươi ngon, sạch sẽ và an toàn. Cam kết chất lượng hàng đầu, giao hàng tận nơi trong ngày.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: 'f', label: 'Facebook' },
                { icon: 'in', label: 'Instagram' },
                { icon: 'yt', label: 'YouTube' },
                { icon: 'tt', label: 'TikTok' },
              ].map((s) => (
                <div
                  key={s.label}
                  title={s.label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#8899aa',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#00a63e';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = '#00a63e';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#8899aa';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 20,
                position: 'relative',
                paddingBottom: 10,
              }}
            >
              Liên kết nhanh
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 32,
                  height: 2,
                  background: '#00a63e',
                  borderRadius: 1,
                }}
              />
            </h4>
            {['Trang chủ', 'Sản phẩm', 'Giới thiệu', 'Liên hệ', 'Chính sách đổi trả'].map((item) => (
              <p
                key={item}
                style={{
                  color: '#8899aa',
                  fontSize: 14,
                  marginBottom: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#4caf50';
                  e.currentTarget.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8899aa';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                <span style={{ fontSize: 10, color: '#4caf50' }}>›</span>
                {item}
              </p>
            ))}
          </div>

          {/* Danh mục */}
          <div>
            <h4
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 20,
                position: 'relative',
                paddingBottom: 10,
              }}
            >
              Danh mục
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 32,
                  height: 2,
                  background: '#00a63e',
                  borderRadius: 1,
                }}
              />
            </h4>
            {['Trái cây nội địa', 'Trái cây nhập khẩu', 'Trái cây nhiệt đới', 'Quả mọng', 'Trái cây ôn đới'].map((item) => (
              <p
                key={item}
                style={{
                  color: '#8899aa',
                  fontSize: 14,
                  marginBottom: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#4caf50';
                  e.currentTarget.style.paddingLeft = '4px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8899aa';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                <span style={{ fontSize: 10, color: '#4caf50' }}>›</span>
                {item}
              </p>
            ))}
          </div>

          {/* Liên hệ */}
          <div>
            <h4
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 20,
                position: 'relative',
                paddingBottom: 10,
              }}
            >
              Liên hệ
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 32,
                  height: 2,
                  background: '#00a63e',
                  borderRadius: 1,
                }}
              />
            </h4>
            {[
              { icon: '📍', text: '53 Nguyễn Minh Châu, Ngũ Hành Sơn, TP.ĐN' },
              { icon: '📞', text: '0376410304' },
              { icon: '✉️', text: 'huyteo1003@gmail.com' },
              { icon: '🕐', text: 'T2 - CN: 7:00 - 21:00' },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <span style={{ color: '#8899aa', fontSize: 14, lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + Bottom */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: 40,
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ color: '#556677', fontSize: 13 }}>
            © 2026 Halona Fruits. Tất cả quyền được bảo lưu.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Chính sách cookie'].map((item) => (
              <span
                key={item}
                style={{
                  color: '#556677',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#4caf50')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#556677')}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}