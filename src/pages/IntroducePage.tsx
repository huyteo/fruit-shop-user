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
import '../styles/IntroducePage.css';

const { Paragraph } = Typography;

const stats = [
  { icon: <SmileOutlined />, number: '10,000+', label: 'Khách hàng hài lòng' },
  { icon: <ShopOutlined />, number: '50+', label: 'Loại trái cây' },
  { icon: <CarOutlined />, number: '5,000+', label: 'Đơn hàng mỗi tháng' },
  { icon: <TrophyOutlined />, number: '5', label: 'Năm kinh nghiệm' },
];

const visionCards = [
  {
    icon: <HeartOutlined />,
    iconColor: '#00a63e',
    iconBg: '#e8f5e9',
    topBorder: '#00a63e',
    title: 'Sứ mệnh',
    desc: 'Mang đến cho mọi gia đình Việt Nam những loại trái cây tươi ngon, an toàn và giàu dinh dưỡng với giá cả hợp lý nhất. Chúng tôi cam kết đồng hành cùng sức khỏe của bạn mỗi ngày.',
  },
  {
    icon: <TeamOutlined />,
    iconColor: '#ff9800',
    iconBg: '#fff3e0',
    topBorder: '#ff9800',
    title: 'Tầm nhìn',
    desc: 'Trở thành thương hiệu trái cây trực tuyến hàng đầu Việt Nam, được yêu thích bởi chất lượng sản phẩm vượt trội và dịch vụ chăm sóc khách hàng tận tâm.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    iconColor: '#2196f3',
    iconBg: '#e3f2fd',
    topBorder: '#2196f3',
    title: 'Giá trị cốt lõi',
    desc: 'Tươi ngon - An toàn - Uy tín. Ba giá trị cốt lõi định hướng mọi hoạt động của Halona Fruits, từ khâu chọn lọc nguồn hàng đến giao hàng tận tay khách hàng.',
  },
];

const features = [
  {
    icon: <CheckCircleOutlined />,
    title: 'Tươi sạch 100%',
    desc: 'Trái cây được thu hoạch và giao đến bạn trong vòng 24 giờ, đảm bảo độ tươi ngon tối đa.',
  },
  {
    icon: <CarOutlined />,
    title: 'Giao hàng nhanh',
    desc: 'Giao hàng trong ngày nội thành, đóng gói cẩn thận bảo quản lạnh suốt hành trình.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Đổi trả dễ dàng',
    desc: 'Hoàn tiền 100% nếu sản phẩm không đạt chất lượng cam kết. Không câu hỏi, không rắc rối.',
  },
  {
    icon: <HeartOutlined />,
    title: 'Giá cả hợp lý',
    desc: 'Mua trực tiếp từ nông trại, cắt giảm trung gian, tiết kiệm cho bạn đến 30%.',
  },
];

const steps = [
  { step: '01', title: 'Thu hoạch', desc: 'Chọn lọc trái cây chín tự nhiên từ vườn' },
  { step: '02', title: 'Kiểm tra', desc: 'Kiểm định chất lượng nghiêm ngặt' },
  { step: '03', title: 'Đóng gói', desc: 'Bảo quản lạnh, đóng gói cẩn thận' },
  { step: '04', title: 'Giao hàng', desc: 'Vận chuyển nhanh đến tận nhà bạn' },
];

export default function IntroducePage() {
  const navigate = useNavigate();

  return (
    <div className="intro-page">
      {/* Hero */}
      <div className="intro-hero">
        <div className="intro-hero-overlay" />
        <div className="intro-hero-content">
          <h1 className="intro-hero-title">Halona Fruits</h1>
          <p className="intro-hero-sub">
            Mang đến trái cây tươi ngon, chất lượng cao từ nông trại đến bàn ăn của bạn
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="intro-story">
        <div className="intro-story-inner">
          <div className="intro-story-text">
            <div className="intro-eyebrow">
              <div className="intro-eyebrow-line" />
              <span className="intro-eyebrow-text">Câu chuyện của chúng tôi</span>
            </div>

            <h2 className="intro-story-heading">
              Từ nông trại Việt Nam
              <br />
              <span className="intro-accent">đến bàn ăn của bạn</span>
            </h2>

            <Paragraph className="intro-story-para">
              Halona Fruits được thành lập với sứ mệnh mang đến những loại trái cây
              tươi ngon nhất, được tuyển chọn kỹ lưỡng từ các vùng trồng trái cây
              nổi tiếng trên khắp Việt Nam và thế giới.
            </Paragraph>

            <Paragraph className="intro-story-para">
              Chúng tôi hợp tác trực tiếp với nông dân, đảm bảo quy trình thu hoạch
              và vận chuyển nghiêm ngặt, giữ nguyên độ tươi ngon và giá trị dinh dưỡng
              của từng trái cây đến tay người tiêu dùng.
            </Paragraph>
          </div>

          <div className="intro-story-img">
            <img
              src="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=600&q=80"
              alt="Nông trại trái cây"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="intro-stats">
        <div className="intro-stats-grid">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="intro-stat-icon">{stat.icon}</div>
              <div className="intro-stat-number">{stat.number}</div>
              <div className="intro-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="intro-vision">
        <div className="intro-vision-inner">
          <div className="intro-section-head-center">
            <div className="intro-divider-title">
              <div className="intro-divider-line" />
              <h2 className="intro-divider-heading">Tầm nhìn & Sứ mệnh</h2>
              <div className="intro-divider-line" />
            </div>
          </div>

          <div className="intro-cards-grid">
            {visionCards.map((card, index) => (
              <div
                key={index}
                className="intro-vision-card"
                style={{ borderTop: `4px solid ${card.topBorder}` }}
              >
                <div
                  className="intro-vision-icon"
                  style={{ background: card.iconBg }}
                >
                  <span style={{ fontSize: 24, color: card.iconColor }}>
                    {card.icon}
                  </span>
                </div>
                <h3 className="intro-vision-card-title">{card.title}</h3>
                <p className="intro-vision-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why choose us */}
      <div className="intro-why">
        <div className="intro-why-inner">
          <div className="intro-section-head">
            <h2 className="intro-section-title">Tại sao chọn Halona Fruits?</h2>
            <p className="intro-section-sub">
              Những lý do khách hàng tin tưởng chúng tôi
            </p>
          </div>

          <div className="intro-features-grid">
            {features.map((item, index) => (
              <div key={index} className="intro-feature">
                <div className="intro-feature-icon">{item.icon}</div>
                <h3 className="intro-feature-title">{item.title}</h3>
                <p className="intro-feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="intro-process">
        <div className="intro-process-inner">
          <div className="intro-section-head">
            <h2 className="intro-section-title">Quy trình của chúng tôi</h2>
            <p className="intro-section-sub">
              Từ nông trại đến tay bạn chỉ trong 4 bước
            </p>
          </div>

          <div className="intro-steps-grid">
            {steps.map((item, index) => (
              <div key={index} className="intro-step">
                <div className="intro-step-badge">{item.step}</div>
                <h3 className="intro-step-title">{item.title}</h3>
                <p className="intro-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="intro-cta">
        <h2 className="intro-cta-title">
          Hãy để chúng tôi chăm sóc sức khỏe gia đình bạn
        </h2>
        <p className="intro-cta-sub">
          Đặt hàng ngay hôm nay và trải nghiệm trái cây tươi ngon giao tận nhà
        </p>
        <button className="intro-cta-btn" onClick={() => navigate('/products')}>
          Mua sắm ngay
        </button>
      </div>
    </div>
  );
}