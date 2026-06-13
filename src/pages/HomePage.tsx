import { useState, useEffect, useRef } from 'react';
import { message, Spin } from 'antd';
import {
  ShoppingCartOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  StarFilled,
  ArrowRightOutlined,
  MailOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  LikeOutlined,
  SyncOutlined,

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/useCart';
import { getImageUrl } from '../utils/image';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  isFeatured: boolean;
  price: number;
  thumbnail: string;
  unit: string;
  stock: number;
  categoryId: number;
  category: { id: number; name: string };
  avgRating: number;
  reviewCount: number;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  tag: string;
  avatar: string | null;
}

interface ReviewStats {
  average: number;
  total: number;
  distribution: { '5': number; '4': number; '3': number; '1-2': number };
}

const slides = [
  {
    image: 'https://i.pinimg.com/736x/75/ba/0d/75ba0d8dde71d06d049126d67c5d0dec.jpg',
    badge: '🌿 100% Organic & Tươi Sạch',
    title: 'Trái Cây',
    title2: 'Tươi Ngon',
    highlight: 'Mỗi Ngày',
    subtitle: 'Nguồn dinh dưỡng tự nhiên, an toàn cho sức khỏe gia đình bạn – từ vườn đến tay bạn trong 24 giờ.',
    cta: 'Khám Phá Ngay',
  },
  {
    image: 'https://i.pinimg.com/1200x/ef/aa/bb/efaabb0c7d7101460a35cc828cd167cb.jpg',
    badge: '🥭 Đặc Sản Việt Nam',
    title: 'Trái Cây',
    title2: 'Nhiệt Đới',
    highlight: 'Đặc Biệt',
    subtitle: 'Xoài, thanh long, vải thiều… Tươi ngon từ các vùng nổi tiếng nhất cả nước.',
    cta: 'Xem Nhiệt Đới',
  },
  {
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    badge: '💪 Giàu Vitamin & Khoáng Chất',
    title: 'Sống Khoẻ',
    highlight: 'Sống Đẹp',
    subtitle: 'Bổ sung vitamin và dưỡng chất thiết yếu mỗi ngày cho cả gia đình.',
    cta: 'Mua Ngay',
  },
];

const floatingFruits = ['🍎', '🥭', '🍊', '🍓', '🥝', '🍇', '🍋', '🫐'];

const marqueeItems = [
  { icon: <SafetyCertificateOutlined />, text: 'An Toàn Vệ Sinh' },
  { icon: <CheckCircleOutlined />, text: 'Organic Không Hóa Chất' },
  { icon: <TrophyOutlined />, text: 'Chứng Nhận VietGAP' },
  { icon: <HeartOutlined />, text: 'Tốt Cho Sức Khoẻ' },
  { icon: <LikeOutlined />, text: '5000+ Khách Hài Lòng' },
  { icon: <SyncOutlined />, text: 'Hoàn Tiền 100%' },
  { icon: <CarOutlined />, text: 'Giao Hàng Trong 24h' },
];



const processSteps = [
  { icon: '🌱', step: '01', title: 'Tuyển Chọn Tại Vườn', desc: 'Chúng tôi trực tiếp đến các vườn uy tín, chọn lựa trái cây đạt tiêu chuẩn VietGAP.', color: '#4caf50' },
  { icon: '🔍', step: '02', title: 'Kiểm Tra Chất Lượng', desc: 'Mỗi lô hàng được kiểm tra kỹ lưỡng về độ tươi và an toàn vệ sinh thực phẩm.', color: '#2196f3' },
  { icon: '📦', step: '03', title: 'Đóng Gói Cẩn Thận', desc: 'Đóng gói eco-friendly, giữ nguyên độ tươi và hương vị tự nhiên.', color: '#9c27b0' },
  { icon: '🚀', step: '04', title: 'Giao Nhanh Tận Nơi', desc: 'Vận chuyển xe lạnh, đảm bảo trái cây tươi ngon như mới hái.', color: '#ff5722' },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, reviewRes, statsRes] = await Promise.all([
          axiosClient.get('/categories'),
          axiosClient.get('/products'),
          axiosClient.get('/reviews/featured'),
          axiosClient.get('/reviews/stats'),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setTestimonials(reviewRes.data);
        setReviewStats(statsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => { if (slideInterval.current) clearInterval(slideInterval.current); };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) { message.warning('Sản phẩm đã hết hàng'); return; }
    addToCart({ productId: product.id, name: product.name, price: Number(product.price), thumbnail: product.thumbnail, unit: product.unit, quantity: 1, stock: product.stock });
    message.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const handleSubscribe = () => {
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const productsByCategory = categories.map((cat) => ({ category: cat, products: products.filter((p) => p.categoryId === cat.id) })).filter((g) => g.products.length > 0);

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  return (
    <div style={{ margin: '-24px -16px', overflow: 'hidden' }}>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes floatFruit {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-18px) rotate(8deg); }
          50% { transform: translateY(-8px) rotate(-5deg); }
          75% { transform: translateY(-22px) rotate(12deg); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progressBar {
          from { width: 0%; }
        }
        .marquee-track { animation: marqueeScroll 35s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .float-fruit { animation: floatFruit 4s ease-in-out infinite; }
        .float-badge { animation: floatBadge 3s ease-in-out infinite; }
      `}</style>

      <div style={{ position: 'relative', height: 750 }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url("${slide.image}")`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,58,26,0.88) 0%, rgba(46,125,50,0.65) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />

            {floatingFruits.map((fr, fi) => (
              <div
                key={fi}
                className="float-fruit"
                style={{
                  position: 'absolute',
                  left: `${58 + (fi % 4) * 11}%`,
                  top: `${8 + Math.floor(fi / 4) * 38 + (fi % 3) * 12}%`,
                  fontSize: 36,
                  opacity: currentSlide === index ? 0.9 : 0,
                  transition: 'opacity 0.5s',
                  animationDelay: `${fi * 0.4}s`,
                  animationDuration: `${3 + fi * 0.5}s`,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                {fr}
              </div>
            ))}

            <div
              style={{
                position: 'relative', zIndex: 2, height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                maxWidth: 1300, margin: '0 auto', padding: '0 60px',
              }}
            >
              <div style={{
                maxWidth: 560,
                opacity: currentSlide === index ? 1 : 0,
                transform: currentSlide === index ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease 0.3s',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff', padding: '8px 18px', borderRadius: 24,
                  fontSize: 14, fontWeight: 600, marginBottom: 18
                }}>
                  ✨ {slide.badge}
                </div>

                <h1 style={{ color: '#fff', fontSize: 90, fontWeight: 1000, margin: 0, lineHeight: 1.3, textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}>
                  {slide.title}
                  <br />
                  {slide.title2 && <>{slide.title2}<br /></>}
                  <span style={{ color: '#4caf50' }}>{slide.highlight}</span>
                </h1>

                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, marginTop: 16, lineHeight: 1.7 }}>
                  {slide.subtitle}
                </p>

                <div style={{ display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/products')}
                    style={{
                      padding: '14px 32px', background: '#fff', color: '#2e7d32',
                      border: 'none', borderRadius: 28, fontSize: 15, fontWeight: 700,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                      transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ffd600'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    {slide.cta} <ArrowRightOutlined />
                  </button>
                  <button
                    onClick={() => navigate('/about')}
                    style={{
                      padding: '14px 32px', background: 'transparent',
                      border: '2px solid rgba(255,255,255,0.5)', color: '#fff',
                      borderRadius: 28, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.3s', backdropFilter: 'blur(4px)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Tìm Hiểu Thêm
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 24, marginTop: 30 }}>
                  {[
                    { icon: <CarOutlined />, text: 'Giao 24h' },
                    { icon: <SafetyCertificateOutlined />, text: 'Hoàn tiền 100%' },
                    { icon: <CheckCircleOutlined />, text: 'Không hóa chất' },
                  ].map((b, bi) => (
                    <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      {b.icon} {b.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {[{ dir: 'left', fn: prevSlide, icon: <LeftOutlined /> }, { dir: 'right', fn: nextSlide, icon: <RightOutlined /> }].map((n) => (
          <button key={n.dir} onClick={n.fn} style={{
            position: 'absolute', [n.dir]: 20, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.25)', width: 48, height: 48, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3, color: '#fff', fontSize: 16, transition: 'all 0.3s',
          }}>{n.icon}</button>
        ))}

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 3 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => goToSlide(i)} style={{
              width: currentSlide === i ? 32 : 10, height: 10, borderRadius: 5,
              background: currentSlide === i ? '#fff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer', transition: 'all 0.4s',
            }} />
          ))}
        </div>

        <svg style={{ position: 'absolute', bottom: -1, left: 0, right: 0, zIndex: 2 }} viewBox="0 0 1440 60" fill="none">
          <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 28C672 36 768 40 864 38C960 36 1056 26 1152 20C1248 14 1344 12 1392 11L1440 10V60H0Z" fill="white" />
        </svg>
      </div>

      <div style={{ background: 'linear-gradient(to right, #2e7d32, #4caf50)', padding: '17px 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', color: '#fff', fontSize: 15, fontWeight: 600 }}>
              <span style={{ color: '#ffd600' }}>{item.icon}</span>
              {item.text}
              <span style={{ margin: '0 12px', color: 'rgba(255,255,255,0.3)' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', padding: '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { icon: <TeamOutlined style={{ fontSize: 28, color: '#fff' }} />, value: '5000+', label: 'Khách hàng hài lòng', bg: '#2196f3', cardBg: '#e3f2fd' },
            { icon: <TrophyOutlined style={{ fontSize: 28, color: '#fff' }} />, value: '100%', label: 'Tươi ngon đảm bảo', bg: '#4caf50', cardBg: '#e8f5e9' },
            { icon: <RiseOutlined style={{ fontSize: 28, color: '#fff' }} />, value: '99%', label: 'Đánh giá 5 sao', bg: '#ff9800', cardBg: '#fff3e0' },
            { icon: <CheckCircleOutlined style={{ fontSize: 28, color: '#fff' }} />, value: '50+', label: 'Loại trái cây', bg: '#009688', cardBg: '#e0f2f1' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.cardBg, borderRadius: 20, padding: '36px 24px', textAlign: 'center',
              transition: 'all 0.3s', cursor: 'default',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 4px 14px ${stat.bg}44` }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#222', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: '#888' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '80px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
              <img src="https://i.pinimg.com/1200x/b6/52/d5/b652d55f57f69738cc36436f6f0c495f.jpg" alt="Farm" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(46,125,50,0.3) 0%, transparent 50%)', borderRadius: 24 }} />
            </div>
            <div className="float-badge" style={{
              position: 'absolute', bottom: -20, right: -20, background: '#fff', borderRadius: 16,
              padding: '16px 20px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SafetyCertificateOutlined style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#333' }}>VietGAP</div>
                <div style={{ fontSize: 12, color: '#999' }}>Chứng nhận an toàn</div>
              </div>
            </div>
            <div className="float-badge" style={{
              position: 'absolute', top: -20, left: -20, background: '#fff', borderRadius: 16,
              padding: '16px 20px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12,
              animationDelay: '0.5s',
            }}>
              <span style={{ fontSize: 32 }}>🏆</span>
              <div>
                <div style={{ fontWeight: 700, color: '#333' }}>#1 Vietnam</div>
                <div style={{ fontSize: 12, color: '#999' }}>Top trái cây online</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e8f5e9', color: '#2e7d32', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20, border: '1px solid #c8e6c9' }}>
              <CheckCircleOutlined /> Tại sao chọn chúng tôi
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#222', margin: '0 0 8px', lineHeight: 1.2 }}>
              Cam Kết Mang Đến<br /><span style={{ color: '#4caf50' }}>Điều Tốt Nhất</span>
            </h2>
            <p style={{ color: '#888', marginBottom: 32, lineHeight: 1.7, fontSize: 15 }}>
              Chúng tôi không chỉ bán trái cây – chúng tôi mang đến sức khỏe và hạnh phúc cho mỗi gia đình Việt Nam.
            </p>

            {[
              { icon: <CarOutlined style={{ fontSize: 20, color: '#2196f3' }} />, bg: '#e3f2fd', title: 'Giao hàng siêu tốc', desc: 'Miễn phí ship đơn từ 200.000đ, giao trong ngày tại nội thành' },
              { icon: <SafetyCertificateOutlined style={{ fontSize: 20, color: '#4caf50' }} />, bg: '#e8f5e9', title: 'Cam kết chất lượng', desc: 'Hoàn tiền 100% nếu sản phẩm không đạt chất lượng' },
              { icon: <CheckCircleOutlined style={{ fontSize: 20, color: '#009688' }} />, bg: '#e0f2f1', title: 'Không hóa chất độc hại', desc: 'Kiểm tra dư lượng thuốc bảo vệ thực vật cho mọi sản phẩm' },
              { icon: <ClockCircleOutlined style={{ fontSize: 20, color: '#9c27b0' }} />, bg: '#f3e5f5', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn mọi lúc' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, padding: '16px', borderRadius: 14,
                marginBottom: 8, transition: 'all 0.2s', cursor: 'default',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#333', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#999', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a3a1a 0%, #2e7d32 100%)', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              <ThunderboltOutlined style={{ color: '#ffd600' }} /> Quy Trình Của Chúng Tôi
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#fff', margin: '0 0 8px', fontStyle: 'italic' }}>Từ Vườn Đến Bàn Ăn</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>4 bước đơn giản đảm bảo mỗi trái cây đến tay bạn luôn tươi ngon nhất</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {processSteps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 20, background: step.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 36, boxShadow: `0 8px 24px ${step.color}66`,
                  transition: 'transform 0.3s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {step.icon}
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '24px 18px',
                }}>
                  <div style={{ color: '#ffd600', fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>BƯỚC {step.step}</div>
                  <div style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{step.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#f8f6f2', padding: '70px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, color: '#222', marginBottom: 32, fontStyle: 'italic' }}>Sản Phẩm Nổi Bật</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {products.filter((p) => p.isFeatured).slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={() => navigate(`/products/${product.id}`)} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button onClick={() => navigate('/products')} style={{
              padding: '14px 40px', background: 'linear-gradient(135deg, #4caf50, #2e7d32)', color: '#fff',
              border: 'none', borderRadius: 28, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.3s',
              boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
            >
              Xem Tất Cả Sản Phẩm <ArrowRightOutlined />
            </button>
          </div>
        </div>
      </div>

      {productsByCategory.map((group, gi) => (
        <div key={group.category.id} style={{ padding: '60px 20px', background: gi % 2 === 0 ? '#fff' : '#f8f6f2' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 28, background: '#00a63e', borderRadius: 2 }} />
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: '#222', margin: 0 }}>{group.category.name}</h2>
                </div>
                <p style={{ color: '#999', fontSize: 14, margin: 0, paddingLeft: 16 }}>{group.category.description || 'Tuyển chọn từ nguồn cung cấp uy tín nhất'}</p>
              </div>
              <button onClick={() => navigate(`/products?category=${group.category.id}`)} style={{
                padding: '10px 24px', background: 'transparent', border: '1.5px solid #00a63e', color: '#00a63e',
                borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.3s', flexShrink: 0,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#00a63e'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00a63e'; }}
              >
                Xem tất cả <ArrowRightOutlined />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {group.products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={() => navigate(`/products/${product.id}`)} onAddToCart={() => handleAddToCart(product)} />
              ))}
            </div>
          </div>
        </div>
      ))}

      <div style={{ background: '#fff', padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fffde7', color: '#f57f17', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 14, border: '1px solid #fff9c4' }}>
              <StarFilled /> Đánh Giá Thực Tế
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#222', margin: '0 0 8px', fontStyle: 'italic' }}>Khách Hàng Nói Gì?</h2>
            <p style={{ color: '#999', fontSize: 15 }}>Hơn 5.000 khách hàng hài lòng – đây là những chia sẻ chân thực từ họ.</p>
          </div>

          {testimonials.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', fontSize: 15 }}>
              Chưa có đánh giá nào từ khách hàng.
            </p>
          ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, #f9f9f9, #fff)', borderRadius: 20, padding: '32px 28px',
                border: '1.5px solid #f0f0f0', transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                height: '100%', display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 48, color: 'rgba(76,175,80,0.08)', fontWeight: 900, lineHeight: 1 }}>❝</div>

                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, si) => <StarFilled key={si} style={{ color: '#f5a623', fontSize: 18 }} />)}
                </div>

                <p style={{
                    color: '#555', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic', fontSize: 14, flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>"{t.content}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '2px solid #c8e6c9', overflow: 'hidden' }}>
                    {t.avatar ? (
                      <img src={getImageUrl(t.avatar)} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '👤'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#333', fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{t.role}</div>
                  </div>
                  <div style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12, border: '1px solid #c8e6c9' }}>{t.tag}</div>
                </div>
              </div>
            ))}
          </div>
          )}

          <div style={{
            marginTop: 40, background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: 20, padding: '40px 48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, border: '1px solid #c8e6c9',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: '#2e7d32' }}>{reviewStats?.average ?? 0}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 3, margin: '8px 0' }}>
                {[...Array(5)].map((_, i) => <StarFilled key={i} style={{ color: '#f5a623', fontSize: 22 }} />)}
              </div>
              <div style={{ color: '#999', fontSize: 13 }}>Trên {reviewStats?.total ?? 0} đánh giá</div>
            </div>
            <div style={{ width: 1, height: 80, background: '#c8e6c9' }} />
            <div style={{ flex: 1, maxWidth: 320 }}>
              {[{ label: '5 sao', pct: 82 }, { label: '4 sao', pct: 14 }, { label: '3 sao', pct: 3 }, { label: '1–2 sao', pct: 1 }].map((r) => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 50, fontSize: 13, color: '#666' }}>{r.label}</span>
                  <div style={{ flex: 1, height: 8, background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${r.pct}%`, height: '100%', background: 'linear-gradient(to right, #4caf50, #2e7d32)', borderRadius: 4 }} />
                  </div>
                  <span style={{ width: 32, fontSize: 13, color: '#999', textAlign: 'right' }}>{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1b4f1b 0%, #2e7d32 50%, #4caf50 100%)', padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.12)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <MailOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <h2 style={{ color: '#fff', fontSize: 38, fontWeight: 900, margin: '0 0 12px', fontStyle: 'italic' }}>Nhận Ưu Đãi Đặc Biệt</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 32 }}>
            Đăng ký ngay để nhận <span style={{ color: '#ffd600', fontWeight: 700 }}>mã giảm 15%</span> cho đơn đầu tiên!
          </p>

          {subscribed ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: '#2e7d32', padding: '14px 32px', borderRadius: 28, fontWeight: 700, fontSize: 16 }}>
              <CheckCircleOutlined /> Cảm ơn bạn đã đăng ký! 🎉
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto' }}>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                style={{ flex: 1, padding: '14px 20px', borderRadius: 28, border: 'none', fontSize: 15, outline: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <button onClick={handleSubscribe} style={{
                padding: '14px 28px', background: '#ffd600', color: '#1a3a1a', border: 'none',
                borderRadius: 28, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.3s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2e7d32'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffd600'; e.currentTarget.style.color = '#1a3a1a'; }}
              >
                Đăng Ký <ArrowRightOutlined />
              </button>
            </div>
          )}

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 14 }}>Không spam. Hủy đăng ký bất kỳ lúc nào.</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            {['🎁 Quà cho thành viên mới', '🔥 Flash sale độc quyền', '📱 Thông báo SP mới'].map((p, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, padding: '6px 14px', borderRadius: 20 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function ProductCard({ product, onNavigate, onAddToCart }: { product: Product; onNavigate: () => void; onAddToCart: () => void }) {
  const rating = product.avgRating;
  const reviews = product.reviewCount;
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #ebebeb', transition: 'all 0.3s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div onClick={onNavigate} style={{ position: 'relative', overflow: 'hidden' }}>
        {product.thumbnail ? (
          <img src={getImageUrl(product.thumbnail)} alt={product.name} style={{ width: '100%', height: 260, objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ height: 260, background: '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>🍊</div>
        )}
        {product.isFeatured && <div style={{ position: 'absolute', top: 10, left: 10, background: '#00a63e', color: '#fff', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Nổi bật</div>}
      </div>
      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 onClick={onNavigate} style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 4, cursor: 'pointer', lineHeight: 1.3 }}>{product.name}</h3>
        <div style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>{product.category?.name || product.unit}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
          {reviews > 0 ? (
            <>
              <StarFilled style={{ color: '#f5a623', fontSize: 16 }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{rating}</span>
              <span style={{ fontSize: 14, color: '#bbb' }}>({reviews})</span>
            </>
          ) : (
            <span style={{ fontSize: 14, color: '#bbb' }}>Chưa có đánh giá</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#e04949' }}>{Number(product.price).toLocaleString('vi-VN')} đ</span>
          <span style={{ fontSize: 14, color: '#999' }}>/{product.unit}</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(); }} disabled={product.stock <= 0}
            style={{ width: '100%', padding: '10px 0', background: product.stock > 0 ? 'linear-gradient(135deg, #4caf50, #2e7d32)' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 550, cursor: product.stock > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.2s' }}
            onMouseEnter={(e) => { if (product.stock > 0) e.currentTarget.style.background = 'linear-gradient(135deg, #388e3c, #1b5e20)'; }}
            onMouseLeave={(e) => { if (product.stock > 0) e.currentTarget.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)'; }}
    >
            <ShoppingCartOutlined />{product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}