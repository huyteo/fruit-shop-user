import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Divider,
  Rate,
  List,
  Avatar,
  Form,
  Input,
  Spin,
  message,
  Card,
  Tabs,
  Modal 
} from 'antd';
import { ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/useAuth';
import { getImageUrl } from '../utils/image';
import '../styles/ProductDetailPage.css';

const { Title, Text, Paragraph } = Typography;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  stock: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string; avatar: string };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState({ average: 0, total: 0 });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, reviewsRes, ratingRes] = await Promise.all([
          axiosClient.get(`/products/${id}`),
          axiosClient.get(`/reviews/product/${id}`),
          axiosClient.get(`/reviews/product/${id}/average`),
        ]);

        const productData = productRes.data;
        setProduct(productData);
        setReviews(reviewsRes.data);
        setAverageRating(ratingRes.data);
        setSelectedImage(productData.thumbnail || '');
        setQuantity(1);

        if (productData.categoryId) {
          const relatedRes = await axiosClient.get(
            `/products/category/${productData.categoryId}`,
          );
          setRelatedProducts(
            relatedRes.data
              .filter((p: Product) => p.id !== productData.id)
              .slice(0, 4),
          );
        }
      } catch (error) {
        message.error('Không tìm thấy sản phẩm');
        navigate('/products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

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

    if (product.stock <= 0) {
      message.warning('Sản phẩm đã hết hàng');
      return;
    }
    if (quantity > product.stock) {
      message.warning(`Chỉ còn ${product.stock} ${product.unit}`);
      return;
    }
    addToCart({
      productId: product.id, name: product.name, price: Number(product.price),
      thumbnail: product.thumbnail, unit: product.unit, quantity: quantity, stock: product.stock,
    });
    message.success('Đã thêm vào giỏ hàng!');
  };

  const handleSubmitReview = async (values: {
    rating: number;
    comment: string;
  }) => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để đánh giá');
      navigate('/login');
      return;
    }

    setReviewLoading(true);
    try {
      await axiosClient.post('/reviews', {
        productId: Number(id),
        rating: values.rating,
        comment: values.comment,
      });

      message.success('Đánh giá thành công!');
      form.resetFields();

      const [reviewsRes, ratingRes] = await Promise.all([
        axiosClient.get(`/reviews/product/${id}`),
        axiosClient.get(`/reviews/product/${id}/average`),
      ]);
      setReviews(reviewsRes.data);
      setAverageRating(ratingRes.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Gửi đánh giá thất bại');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) return null;

  const allImages = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(product.images || []),
  ];

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <span className="pd-breadcrumb-link" onClick={() => navigate('/')}>
          <HomeOutlined /> Trang chủ
        </span>
        <span className="pd-breadcrumb-sep">/</span>
        <span className="pd-breadcrumb-current">Chi tiết sản phẩm</span>
      </div>

      <Card className="pd-card">
        <Row gutter={[40, 24]}>
          <Col xs={24} md={11}>
            <div className="pd-main-img">
              <img
                src={selectedImage ? getImageUrl(selectedImage) : undefined}
                alt={product.name}
              />
            </div>

            {allImages.length > 1 && (
              <div className="pd-thumbs">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`pd-thumb${selectedImage === img ? ' pd-thumb--active' : ''}`}
                  >
                    <img src={getImageUrl(img)} alt={`Ảnh ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </Col>

          <Col xs={24} md={13}>
            {product.isFeatured && (
              <div className="pd-featured-badge">Nổi bật</div>
            )}

            <Title level={2} className="pd-title">
              {product.name}
            </Title>

            <div className="pd-rating-row">
              <span className="pd-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="pd-star"
                    style={{
                      color:
                        i <= Math.round(averageRating.average)
                          ? '#f5a623'
                          : '#e0e0e0',
                    }}
                  >
                    ★
                  </span>
                ))}
              </span>
              <Text className="pd-rating-count">
                ({averageRating.total} đánh giá)
              </Text>
            </div>

            <div className="pd-price-row">
              <Text className="pd-price">
                {Number(product.price).toLocaleString('vi-VN')} đ
              </Text>
              <Text className="pd-price-unit">/{product.unit}</Text>
            </div>

            <div className="pd-stock-row">
              {product.stock > 0 ? (
                <>
                  <span className="pd-stock-check">✓</span>
                  <Text className="pd-stock-text">
                    Còn {product.stock} {product.unit} trong kho
                  </Text>
                </>
              ) : (
                <Tag color="red" style={{ fontSize: 13, padding: '4px 12px' }}>
                  Hết hàng
                </Tag>
              )}
            </div>

            <div className="pd-desc-block">
              <Text className="pd-desc-label">Mô tả sản phẩm</Text>
              <Paragraph className="pd-desc-text">
                {product.description}
              </Paragraph>
            </div>

            <Divider style={{ margin: '0 0 20px' }} />

            {product.stock > 0 && (
              <>
                <Text className="pd-qty-label">Số lượng</Text>
                <div className="pd-qty-row">
                  <div className="pd-qty">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="pd-qty-btn"
                    >
                      −
                    </button>
                    <div className="pd-qty-value">{quantity}</div>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="pd-qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <Text className="pd-qty-unit">{product.unit}</Text>
                </div>

                <div className="pd-actions">
                  <button onClick={handleAddToCart} className="pd-btn-cart">
                    <ShoppingCartOutlined style={{ fontSize: 18 }} />
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        Modal.confirm({
                          title: 'Bạn cần đăng nhập',
                          content: 'Vui lòng đăng nhập để mua hàng.',
                          okText: 'Đăng nhập',
                          cancelText: 'Để sau',
                          okButtonProps: { style: { background: '#00a63e', borderColor: '#00a63e' } },
                          onOk: () => navigate('/login'),
                        });
                        return;
                      }

                      if (product.stock <= 0) {
                        message.warning('Sản phẩm đã hết hàng');
                        return;
                      }
                      if (quantity > product.stock) {
                        message.warning(`Chỉ còn ${product.stock} ${product.unit}`);
                        return;
                      }

                      // Đưa đúng sản phẩm hiện tại (kèm số lượng) sang checkout
                      const buyNowItem = {
                        productId: product.id,
                        name: product.name,
                        price: Number(product.price),
                        thumbnail: product.thumbnail,
                        unit: product.unit,
                        quantity: quantity,
                        stock: product.stock,
                      };
                      localStorage.setItem('checkoutItems', JSON.stringify([buyNowItem]));
                      navigate('/checkout');
                    }}
                    className="pd-btn-buy"
                  >
                    Mua ngay
                  </button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Card>

      <Card className="pd-tabs-card">
        <Tabs
          defaultActiveKey="description"
          size="large"
          items={[
            {
              key: 'description',
              label: <span className="pd-tab-label">MÔ TẢ</span>,
              children: (
                <Paragraph className="pd-tab-desc">
                  {product.description}
                </Paragraph>
              ),
            },
            {
              key: 'reviews',
              label: (
                <span className="pd-tab-label">
                  ĐÁNH GIÁ ({averageRating.total})
                </span>
              ),
              children: (
                <div className="pd-tab-reviews">
                  {isAuthenticated ? (
                    <Card className="pd-review-form-card">
                      <Title level={5}>Viết đánh giá của bạn</Title>
                      <Form
                        form={form}
                        onFinish={handleSubmitReview}
                        layout="vertical"
                      >
                        <Form.Item
                          name="rating"
                          label="Đánh giá"
                          rules={[
                            { required: true, message: 'Vui lòng chọn số sao!' },
                          ]}
                        >
                          <Rate style={{ fontSize: 28 }} />
                        </Form.Item>

                        <Form.Item name="comment" label="Nội dung">
                          <Input.TextArea
                            rows={3}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                          />
                        </Form.Item>

                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={reviewLoading}
                          className="pd-review-submit"
                        >
                          Gửi đánh giá
                        </Button>
                      </Form>
                    </Card>
                  ) : (
                    <Card className="pd-login-card">
                      <Text>
                        Vui lòng{' '}
                        <a
                          onClick={() => navigate('/login')}
                          className="pd-login-link"
                        >
                          đăng nhập
                        </a>{' '}
                        để đánh giá sản phẩm
                      </Text>
                    </Card>
                  )}

                  {reviews.length > 0 ? (
                    <List
                      dataSource={reviews}
                      renderItem={(review: Review) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar icon={<span>👤</span>} />}
                            title={
                              <div className="pd-review-head">
                                <Text strong>{review.user?.name}</Text>
                                <Rate
                                  disabled
                                  value={review.rating}
                                  style={{ fontSize: 14 }}
                                />
                              </div>
                            }
                            description={
                              <div>
                                <Paragraph style={{ margin: '4px 0' }}>
                                  {review.comment || 'Không có nội dung'}
                                </Paragraph>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString('vi-VN')}
                                </Text>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text type="secondary">
                      Chưa có đánh giá nào cho sản phẩm này
                    </Text>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>

      {relatedProducts.length > 0 && (
        <div className="pd-related">
          <Title level={3} className="pd-related-title">
            Sản phẩm liên quan
          </Title>

          <Row gutter={[16, 16]}>
            {relatedProducts.map((rp) => (
              <Col xs={12} sm={8} md={6} key={rp.id}>
                <div
                  onClick={() => navigate(`/products/${rp.id}`)}
                  className="pd-rp-card"
                >
                  <div className="pd-rp-imgwrap">
                    {rp.thumbnail ? (
                      <img
                        src={getImageUrl(rp.thumbnail)}
                        alt={rp.name}
                        className="pd-rp-img"
                      />
                    ) : (
                      <div className="pd-rp-img-placeholder">🍊</div>
                    )}
                    {rp.isFeatured && (
                      <div className="pd-rp-featured">Nổi bật</div>
                    )}
                  </div>

                  <div className="pd-rp-body">
                    <Text strong className="pd-rp-name">
                      {rp.name}
                    </Text>

                    {/* Stock indicator */}
                    <div className="pd-rp-stock">
                      <span
                        className="pd-rp-stock-dot"
                        style={{ background: rp.stock > 0 ? '#00a63e' : '#ff4d4f' }}
                      />
                      <span
                        className="pd-rp-stock-text"
                        style={{ color: rp.stock > 0 ? '#00a63e' : '#ff4d4f' }}
                      >
                        {rp.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="pd-rp-rating">
                      <span className="pd-rp-stars">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className="pd-rp-star"
                            style={{
                              color:
                                i <= Math.round(rp.avgRating)
                                  ? '#f5a623'
                                  : '#e0e0e0',
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                      <span className="pd-rp-review-count">
                        ({rp.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="pd-rp-price-row">
                      <span className="pd-rp-price">
                        {Number(rp.price).toLocaleString('vi-VN')} đ
                      </span>
                      <span className="pd-rp-price-unit">/{rp.unit}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
                        addToCart({
                          productId: rp.id,
                          name: rp.name,
                          price: Number(rp.price),
                          thumbnail: rp.thumbnail,
                          unit: rp.unit,
                          quantity: 1,
                          stock: rp.stock,
                        });
                        message.success(`Đã thêm "${rp.name}" vào giỏ`);
                      }}
                      disabled={rp.stock <= 0}
                      className={`pd-rp-cart-btn ${rp.stock > 0 ? 'pd-rp-cart-btn--active' : 'pd-rp-cart-btn--disabled'}`}
                    >
                      <ShoppingCartOutlined />
                      {rp.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}