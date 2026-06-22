import { useState, useEffect, useRef } from 'react';
import { message, Spin, Modal } from 'antd';
import {
  ShoppingCartOutlined,
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
import { useAuth } from '../contexts/useAuth';
import { getImageUrl } from '../utils/image';
import '../styles/HomePage.css';

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
    cta: 'Xem Chi Tiết',
  },
  {
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    badge: '💪 Giàu Vitamin & Khoáng Chất',
    title: 'Giòn Ngọt',
    title2: 'Thơm Ngon',
    highlight: 'Bổ Dưỡng',
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

const ratingBars = [
  { label: '5 sao', pct: 82 },
  { label: '4 sao', pct: 14 },
  { label: '3 sao', pct: 3 },
  { label: '1–2 sao', pct: 1 },
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
   const { isAuthenticated } = useAuth();

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



  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      Modal.confirm({
        title: 'Bạn cần đăng nhập',
        content: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
        okText: 'Đăng nhập',
        cancelText: 'Để sau',
        okButtonProps: { style: { background: '#00a63e', borderColor: '#00a63e' } },
        onOk: () => navigate('/login'),
      });
      return;
    }
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

  const productsByCategory = categories
    .map((cat) => ({ category: cat, products: products.filter((p) => p.categoryId === cat.id) }))
    .filter((g) => g.products.length > 0);

  if (loading) return <div className="hp-loading"><Spin size="large" /></div>;

  return (
    <div className="hp-root">
      {/* ===== Hero slideshow ===== */}
      <div className="hp-hero">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="hp-slide"
            style={{ backgroundImage: `url("${slide.image}")`, opacity: currentSlide === index ? 1 : 0 }}
          >
            <div className="hp-slide-overlay-1" />
            <div className="hp-slide-overlay-2" />

            {floatingFruits.map((fr, fi) => (
              <div
                key={fi}
                className="hp-float-fruit float-fruit"
                style={{
                  left: `${58 + (fi % 4) * 11}%`,
                  top: `${8 + Math.floor(fi / 4) * 38 + (fi % 3) * 12}%`,
                  opacity: currentSlide === index ? 0.9 : 0,
                  animationDelay: `${fi * 0.4}s`,
                  animationDuration: `${3 + fi * 0.5}s`,
                }}
              >
                {fr}
              </div>
            ))}

            <div className="hp-slide-inner">
              <div
                className="hp-slide-text"
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  transform: currentSlide === index ? 'translateY(0)' : 'translateY(30px)',
                }}
              >
                <div className="hp-slide-badge">✨ {slide.badge}</div>
                <h1 className="hp-slide-title">
                  {slide.title}
                  <br />
                  {slide.title2 && <>{slide.title2}<br /></>}
                  <span className="hp-slide-title-highlight">{slide.highlight}</span>
                </h1>
                <p className="hp-slide-sub">{slide.subtitle}</p>

                <div className="hp-slide-actions">
                  <button onClick={() => navigate('/products')} className="hp-btn-primary">
                    {slide.cta} <ArrowRightOutlined />
                  </button>
                  <button onClick={() => navigate('/about')} className="hp-btn-outline">
                    Tìm Hiểu Thêm
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
        <div className="hp-hero-dots">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => goToSlide(i)}
              className="hp-hero-dot"
              style={{ width: currentSlide === i ? 32 : 10, background: currentSlide === i ? '#fff' : 'rgba(255,255,255,0.4)' }}
            />
          ))}
        </div>

      </div>

      {/* ===== Marquee ===== */}
      <div className="hp-marquee-bar">
        <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="hp-marquee-item">
              <span className="hp-marquee-icon">{item.icon}</span>
              {item.text}
              <span className="hp-marquee-sep">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Stats ===== */}
      <div className="hp-stats-section">
        <div className="hp-stats-grid">
          {[
            { icon: <TeamOutlined style={{ color: '#fff' }} />, value: '5000+', label: 'Khách hàng', bg: '#2196f3', cardBg: '#e3f2fd' },
            { icon: <TrophyOutlined style={{ color: '#fff' }} />, value: '100%', label: 'Tươi ngon', bg: '#4caf50', cardBg: '#e8f5e9' },
            { icon: <RiseOutlined style={{ color: '#fff' }} />, value: '99%', label: 'Đánh giá 5 sao', bg: '#ff9800', cardBg: '#fff3e0' },
            { icon: <CheckCircleOutlined style={{ color: '#fff' }} />, value: '50+', label: 'Loại trái cây', bg: '#009688', cardBg: '#e0f2f1' },
          ].map((stat, i) => (
            <div key={i} className="hp-stat-card" style={{ background: stat.cardBg }}>
              <div className="hp-stat-icon" style={{ background: stat.bg, boxShadow: `0 4px 14px ${stat.bg}44` }}>
                {stat.icon}
              </div>
              <div className="hp-stat-value">{stat.value}</div>
              <div className="hp-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Why choose us ===== */}
      <div className="hp-why-section">
        <div className="hp-why-grid">
          <div className="hp-why-img-wrap">
            <div className="hp-why-img-frame">
              <img src="https://i.pinimg.com/1200x/b6/52/d5/b652d55f57f69738cc36436f6f0c495f.jpg" alt="Farm" className="hp-why-img" />
              <div className="hp-why-img-overlay" />
            </div>
            <div className="hp-why-badge hp-why-badge--br float-badge">
              <div className="hp-why-badge-icon">
                <SafetyCertificateOutlined style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <div>
                <div className="hp-why-badge-title">VietGAP</div>
                <div className="hp-why-badge-sub">Chứng nhận an toàn</div>
              </div>
            </div>
            <div className="hp-why-badge hp-why-badge--tl float-badge">
              <span style={{ fontSize: 32 }}>🏆</span>
              <div>
                <div className="hp-why-badge-title">#1 Vietnam</div>
                <div className="hp-why-badge-sub">Top trái cây online</div>
              </div>
            </div>
          </div>

          <div className='hp-why-content'>
            <div className="hp-why-pill"><CheckCircleOutlined /> Tại sao chọn chúng tôi</div>
            <h2 className="hp-why-title">
              Cam Kết Mang Đến<br /><span className="hp-why-title-highlight">Điều Tốt Nhất</span>
            </h2>
            <p className="hp-why-desc">
              Chúng tôi không chỉ bán trái cây – chúng tôi mang đến sức khỏe và hạnh phúc cho mỗi gia đình Việt Nam.
            </p>

            {[
              { icon: <CarOutlined style={{ fontSize: 20, color: '#2196f3' }} />, bg: '#e3f2fd', title: 'Giao hàng siêu tốc', desc: 'Miễn phí ship đơn từ 200.000đ, giao trong ngày tại nội thành' },
              { icon: <SafetyCertificateOutlined style={{ fontSize: 20, color: '#4caf50' }} />, bg: '#e8f5e9', title: 'Cam kết chất lượng', desc: 'Hoàn tiền 100% nếu sản phẩm không đạt chất lượng' },
              { icon: <CheckCircleOutlined style={{ fontSize: 20, color: '#009688' }} />, bg: '#e0f2f1', title: 'Không hóa chất độc hại', desc: 'Kiểm tra dư lượng thuốc bảo vệ thực vật cho mọi sản phẩm' },
              { icon: <ClockCircleOutlined style={{ fontSize: 20, color: '#9c27b0' }} />, bg: '#f3e5f5', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn mọi lúc' },
            ].map((f, i) => (
              <div key={i} className="hp-feature-row">
                <div className="hp-feature-icon" style={{ background: f.bg }}>{f.icon}</div>
                <div>
                  <div className="hp-feature-title">{f.title}</div>
                  <div className="hp-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Process ===== */}
      <div className="hp-process-section">
        <div className="hp-process-circle-1" />
        <div className="hp-process-circle-2" />
        <div className="hp-process-inner">
          <div className="hp-section-head">
            <div className="hp-process-pill">
              <ThunderboltOutlined className="hp-process-pill-icon" /> Quy Trình Của Chúng Tôi
            </div>
            <h2 className="hp-process-title">Từ Vườn Đến Bàn Ăn</h2>
            <p className="hp-process-sub">4 bước đơn giản đảm bảo mỗi trái cây đến tay bạn luôn tươi ngon nhất</p>
          </div>

          <div className="hp-process-grid">
            {processSteps.map((step, i) => (
              <div key={i} className="hp-process-step">
                <div className="hp-process-step-icon" style={{ background: step.color, boxShadow: `0 8px 24px ${step.color}66` }}>
                  {step.icon}
                </div>
                <div className="hp-process-step-card">
                  <div className="hp-process-step-num">BƯỚC {step.step}</div>
                  <div className="hp-process-step-title">{step.title}</div>
                  <div className="hp-process-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Featured products ===== */}
      <div className="hp-featured-section">
        <div className="hp-featured-inner">
          <h2 className="hp-featured-title">Sản Phẩm Nổi Bật</h2>

          <div className="hp-products-grid">
            {products.filter((p) => p.isFeatured).slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={() => navigate(`/products/${product.id}`)} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>

          <div className="hp-view-all-wrap">
            <button onClick={() => navigate('/products')} className="hp-view-all-btn">
              Xem Tất Cả Sản Phẩm <ArrowRightOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* ===== Category sections ===== */}
      {productsByCategory.map((group, gi) => (
        <div key={group.category.id} className={`hp-cat-section ${gi % 2 === 0 ? 'hp-cat-section--even' : 'hp-cat-section--odd'}`}>
          <div className="hp-cat-inner">
            <div className="hp-cat-header">
              <div>
                <div className="hp-cat-title-row">
                  <div className="hp-cat-title-bar" />
                  <h2 className="hp-cat-title">{group.category.name}</h2>
                </div>
                <p className="hp-cat-desc">{group.category.description || 'Tuyển chọn từ nguồn cung cấp uy tín nhất'}</p>
              </div>
              <button onClick={() => navigate(`/products?category=${group.category.id}`)} className="hp-cat-viewall">
                Xem tất cả <ArrowRightOutlined />
              </button>
            </div>
            <div className="hp-products-grid">
              {group.products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={() => navigate(`/products/${product.id}`)} onAddToCart={() => handleAddToCart(product)} />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* ===== Testimonials ===== */}
      <div className="hp-testi-section">
        <div className="hp-testi-inner">
          <div className="hp-section-head">
            <div className="hp-testi-pill"><StarFilled /> Đánh Giá Thực Tế</div>
            <h2 className="hp-testi-title">Khách Hàng Nói Gì?</h2>
          </div>

          {testimonials.length === 0 ? (
            <p className="hp-testi-empty">Chưa có đánh giá nào từ khách hàng.</p>
          ) : (
            <div className="hp-testi-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="hp-testi-card">
                  <div className="hp-testi-quote">❝</div>
                  <div className="hp-testi-stars">
                    {[...Array(t.rating)].map((_, si) => <StarFilled key={si} className="hp-testi-star" />)}
                  </div>
                  <p className="hp-testi-content">"{t.content}"</p>
                  <div className="hp-testi-author">
                    <div className="hp-testi-avatar">
                      {t.avatar ? <img src={getImageUrl(t.avatar)} alt={t.name} /> : '👤'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="hp-testi-name">{t.name}</div>
                      <div className="hp-testi-role">{t.role}</div>
                    </div>
                    <div className="hp-testi-tag">{t.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="hp-rating-summary">
            <div style={{ textAlign: 'center' }}>
              <div className="hp-rating-big">{reviewStats?.average ?? 0}</div>
              <div className="hp-rating-stars">
                {[...Array(5)].map((_, i) => <StarFilled key={i} className="hp-rating-star" />)}
              </div>
              <div className="hp-rating-total">Trên {reviewStats?.total ?? 0} đánh giá</div>
            </div>
            <div className="hp-rating-divider" />
            <div className="hp-rating-bars">
              {ratingBars.map((r) => (
                <div key={r.label} className="hp-rating-bar-row">
                  <span className="hp-rating-bar-label">{r.label}</span>
                  <div className="hp-rating-bar-track">
                    <div className="hp-rating-bar-fill" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="hp-rating-bar-pct">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Newsletter ===== */}
      <div className="hp-news-section">
        <div className="hp-news-circle-1" />
        <div className="hp-news-circle-2" />
        <div className="hp-news-inner">
          <div className="hp-news-icon"><MailOutlined style={{ fontSize: 28, color: '#fff' }} /></div>
          <h2 className="hp-news-title">Nhận Ưu Đãi Đặc Biệt</h2>
          <p className="hp-news-sub">
            Đăng ký ngay để nhận <span className="hp-news-sub-highlight">mã giảm 15%</span> cho đơn đầu tiên!
          </p>

          {subscribed ? (
            <div className="hp-news-success"><CheckCircleOutlined /> Cảm ơn bạn đã đăng ký! 🎉</div>
          ) : (
            <div className="hp-news-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="hp-news-input"
              />
              <button onClick={handleSubscribe} className="hp-news-btn">
                Đăng Ký <ArrowRightOutlined />
              </button>
            </div>
          )}

          <p className="hp-news-note">Không spam. Hủy đăng ký bất kỳ lúc nào.</p>

          <div className="hp-news-tags">
            {['🎁 Quà cho thành viên mới', '🔥 Flash sale độc quyền', '📱 Thông báo SP mới'].map((p, i) => (
              <span key={i} className="hp-news-tag">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onNavigate, onAddToCart }: { product: Product; onNavigate: () => void; onAddToCart: () => void }) {
  const rounded = Math.round(product.avgRating);
  return (
    <div className="hp-card">
      <div onClick={onNavigate} className="hp-card-img-wrap">
        {product.thumbnail ? (
          <img className="prod-img hp-card-img" src={getImageUrl(product.thumbnail)} alt={product.name} />
        ) : (
          <div className="hp-card-img-placeholder">🍊</div>
        )}
        {product.isFeatured && <div className="hp-card-badge">Nổi bật</div>}
        {product.stock <= 0 && (
          <div className="hp-card-sold-out">
            <span className="hp-card-sold-out-label">Hết hàng</span>
          </div>
        )}
      </div>

      <div className="hp-card-info">
        <h3 onClick={onNavigate} className="hp-card-name">{product.name}</h3>

        <div className="hp-card-stock-row">
          <span className={`hp-card-stock-dot hp-card-stock-dot--${product.stock > 0 ? 'in' : 'out'}`} />
          <span className={`hp-card-stock-text hp-card-stock-text--${product.stock > 0 ? 'in' : 'out'}`}>
            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>

        <div className="hp-card-rating">
          <span className="hp-card-stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarFilled key={i} className={`hp-card-star${i <= rounded ? ' hp-card-star--filled' : ''}`} />
            ))}
          </span>
          <span className="hp-card-review-count">({product.reviewCount})</span>
        </div>

        <div className="hp-card-price-row">
          <span className="hp-card-price">{Number(product.price).toLocaleString('vi-VN')} đ</span>
          <span className="hp-card-unit">/{product.unit}</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          disabled={product.stock <= 0}
          className={`hp-card-add-btn hp-card-add-btn--${product.stock > 0 ? 'available' : 'disabled'}`}
        >
          <ShoppingCartOutlined />
          {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
}