import { Typography } from 'antd';
import {
  CheckCircleOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  TeamOutlined,
  ShopOutlined,
  SmileOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

export default function IntroducePage() {
  const navigate = useNavigate();

  return (
    <div style={{ margin: '-24px -16px' }}>
      <div
        style={{
          position: 'relative',
          height: 400,
          backgroundImage:
            'url("https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(0,100,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <h1
            style={{
              color: '#fff',
              fontSize: 46,
              fontWeight: 800,
              margin: 0,
              fontFamily: "'Georgia', serif",
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
             Halona Fruits
          </h1>
          <p
            style={{
              color: '#e0e0e0',
              fontSize: 18,
              marginTop: 14,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.7,
            }}
          >
            Mang đến trái cây tươi ngon, chất lượng cao từ nông trại đến bàn ăn của bạn
          </p>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '64px 48px' }}>
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            gap: 48,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{ width: 50, height: 3, background: '#00a63e' }}
              />
              <span
                style={{
                  color: '#00a63e',
                  fontWeight: 700,
                  fontSize: 19,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                Câu chuyện của chúng tôi
              </span>
            </div>

            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#222',
                marginBottom: 20,
                lineHeight: 1.3,
              }}
            >
              Từ nông trại Việt Nam
              <br />
              <span style={{ color: '#00a63e' }}>đến bàn ăn của bạn</span>
            </h2>

            <Paragraph
              style={{
                fontSize: 15,
                color: '#555',
                lineHeight: 1.9,
                marginBottom: 16,
              }}
            >
              Halona Fruits được thành lập với sứ mệnh mang đến những loại trái cây
              tươi ngon nhất, được tuyển chọn kỹ lưỡng từ các vùng trồng trái cây
              nổi tiếng trên khắp Việt Nam và thế giới.
            </Paragraph>

            <Paragraph
              style={{
                fontSize: 15,
                color: '#555',
                lineHeight: 1.9,
              }}
            >
              Chúng tôi hợp tác trực tiếp với nông dân, đảm bảo quy trình thu hoạch
              và vận chuyển nghiêm ngặt, giữ nguyên độ tươi ngon và giá trị dinh dưỡng
              của từng trái cây đến tay người tiêu dùng.
            </Paragraph>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 300,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=600&q=80"
              alt="Nông trại trái cây"
              style={{ width: '100%', height: 350, objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #00a63e 0%, #1b5e20 100%)',
          padding: '48px 20px',
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            textAlign: 'center',
          }}
        >
          {[
            { icon: <SmileOutlined />, number: '10,000+', label: 'Khách hàng hài lòng' },
            { icon: <ShopOutlined />, number: '50+', label: 'Loại trái cây' },
            { icon: <CarOutlined />, number: '5,000+', label: 'Đơn hàng mỗi tháng' },
            { icon: <TrophyOutlined />, number: '5', label: 'Năm kinh nghiệm' },
          ].map((stat, index) => (
            <div key={index}>
              <div style={{ fontSize: 32, color: '#c8e6c9', marginBottom: 8 }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 4,
                }}
              >
                {stat.number}
              </div>
              <div style={{ color: '#c8e6c9', fontSize: 15 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#f9f6f1', padding: '64px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  flex: 1,
                  maxWidth: 150,
                  height: 2,
                  background: '#8b7355',
                }}
              />
              <h2
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#333',
                  margin: 0,
                }}
              >
                Tầm nhìn & Sứ mệnh
              </h2>
              <div
                style={{
                  flex: 1,
                  maxWidth: 150,
                  height: 2,
                  background: '#8b7355',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 32,
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                borderTop: '4px solid #00a63e',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <HeartOutlined style={{ fontSize: 24, color: '#00a63e' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                Sứ mệnh
              </h3>
              <p style={{ color: '#666', lineHeight: 1.8, fontSize: 14 }}>
                Mang đến cho mọi gia đình Việt Nam những loại trái cây tươi ngon,
                an toàn và giàu dinh dưỡng với giá cả hợp lý nhất. Chúng tôi cam kết
                đồng hành cùng sức khỏe của bạn mỗi ngày.
              </p>
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                borderTop: '4px solid #ff9800',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#fff3e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <TeamOutlined style={{ fontSize: 24, color: '#ff9800' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                Tầm nhìn
              </h3>
              <p style={{ color: '#666', lineHeight: 1.8, fontSize: 14 }}>
                Trở thành thương hiệu trái cây trực tuyến hàng đầu Việt Nam,
                được yêu thích bởi chất lượng sản phẩm vượt trội và dịch vụ
                chăm sóc khách hàng tận tâm.
              </p>
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                borderTop: '4px solid #2196f3',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <SafetyCertificateOutlined
                  style={{ fontSize: 24, color: '#2196f3' }}
                />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                Giá trị cốt lõi
              </h3>
              <p style={{ color: '#666', lineHeight: 1.8, fontSize: 14 }}>
                Tươi ngon - An toàn - Uy tín. Ba giá trị cốt lõi định hướng
                mọi hoạt động của Halona Fruits, từ khâu chọn lọc nguồn hàng
                đến giao hàng tận tay khách hàng.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '64px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#333' }}>
              Tại sao chọn Halona Fruits?
            </h2>
            <p style={{ color: '#888', fontSize: 15, marginTop: 8 }}>
              Những lý do khách hàng tin tưởng chúng tôi
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 32,
            }}
          >
            {[
              {
                icon: (
                  <CheckCircleOutlined
                    style={{ fontSize: 28, color: '#00a63e' }}
                  />
                ),
                title: 'Tươi sạch 100%',
                desc: 'Trái cây được thu hoạch và giao đến bạn trong vòng 24 giờ, đảm bảo độ tươi ngon tối đa.',
              },
              {
                icon: (
                  <CarOutlined style={{ fontSize: 28, color: '#00a63e' }} />
                ),
                title: 'Giao hàng nhanh',
                desc: 'Giao hàng trong ngày nội thành, đóng gói cẩn thận bảo quản lạnh suốt hành trình.',
              },
              {
                icon: (
                  <SafetyCertificateOutlined
                    style={{ fontSize: 28, color: '#00a63e' }}
                  />
                ),
                title: 'Đổi trả dễ dàng',
                desc: 'Hoàn tiền 100% nếu sản phẩm không đạt chất lượng cam kết. Không câu hỏi, không rắc rối.',
              },
              {
                icon: (
                  <HeartOutlined style={{ fontSize: 28, color: '#00a63e' }} />
                ),
                title: 'Giá cả hợp lý',
                desc: 'Mua trực tiếp từ nông trại, cắt giảm trung gian, tiết kiệm cho bạn đến 30%.',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  borderRadius: 12,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f6ffed';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: '#333',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#f9f6f1', padding: '64px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#333' }}>
              Quy trình của chúng tôi
            </h2>
            <p style={{ color: '#888', fontSize: 15, marginTop: 8 }}>
              Từ nông trại đến tay bạn chỉ trong 4 bước
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 24,
            }}
          >
            {[
              { step: '01', title: 'Thu hoạch', desc: 'Chọn lọc trái cây chín tự nhiên từ vườn' },
              { step: '02', title: 'Kiểm tra', desc: 'Kiểm định chất lượng nghiêm ngặt' },
              { step: '03', title: 'Đóng gói', desc: 'Bảo quản lạnh, đóng gói cẩn thận' },
              { step: '04', title: 'Giao hàng', desc: 'Vận chuyển nhanh đến tận nhà bạn' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: 20,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: '#00a63e',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: '#333',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #00a63e 0%, #1b5e20 100%)',
          padding: '64px 20px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Hãy để chúng tôi chăm sóc sức khỏe gia đình bạn
        </h2>
        <p
          style={{
            color: '#c8e6c9',
            fontSize: 16,
            marginBottom: 32,
            maxWidth: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Đặt hàng ngay hôm nay và trải nghiệm trái cây tươi ngon giao tận nhà
        </p>
        <button
          onClick={() => navigate('/products')}
          style={{
            background: '#fff',
            color: '#00a63e',
            border: 'none',
            padding: '14px 40px',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Mua sắm ngay
        </button>
      </div>
    </div>
  );
}