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
} from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/useAuth';
import { getImageUrl } from '../utils/image';

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
  categoryId: number;
  category: { id: number; name: string };
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

    if (product.stock <= 0) {
      message.warning('Sản phẩm đã hết hàng');
      return;
    }

    if (quantity > product.stock) {
      message.warning(`Chỉ còn ${product.stock} ${product.unit}`);
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      thumbnail: product.thumbnail,
      unit: product.unit,
      quantity: quantity,
      stock: product.stock,
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
      <div style={{ textAlign: 'center', padding: 100 }}>
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
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        type="link"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, padding: 0, color: '#00a63e' }}
      >
        Quay lại
      </Button>

      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row gutter={[40, 24]}>
          <Col xs={24} md={11}>
            <div
              style={{
                width: '100%',
                height: 400,
                borderRadius: 12,
                overflow: 'hidden',
                background: '#fafafa',
                border: '1px solid #f0f0f0',
              }}
            >
              <img
                src={selectedImage ? getImageUrl(selectedImage) : undefined}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {allImages.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 14,
                  overflowX: 'auto',
                  paddingBottom: 4,
                }}
              >
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: 68,
                      height: 68,
                      minWidth: 68,
                      borderRadius: 10,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border:
                        selectedImage === img
                          ? '3px solid #00a63e'
                          : '2px solid #e8e8e8',
                      transition: 'all 0.2s ease',
                      background: '#fafafa',
                    }}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Ảnh ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>

          <Col xs={24} md={13}>
            {product.isFeatured && (
              <div
                style={{
                  display: 'inline-block',
                  background: '#00a63e',
                  color: '#fff',
                  padding: '4px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                Nổi bật
              </div>
            )}

            <Title
              level={2}
              style={{ margin: '0 0 4px 0', fontSize: 28, fontWeight: 800 }}
            >
              {product.name}
            </Title>

            {product.category && (
              <Text
                style={{
                  fontSize: 15,
                  color: '#888',
                  display: 'block',
                  marginBottom: 14,
                }}
              >
                {product.category.name}
              </Text>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <Rate
                disabled
                value={averageRating.average}
                allowHalf
                style={{ fontSize: 18 }}
              />
              <Text style={{ fontWeight: 600, fontSize: 15 }}>
                {averageRating.average}
              </Text>
              <Text style={{ color: '#888' }}>
                ({averageRating.total} đánh giá)
              </Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 32, color: '#333', fontWeight: 800 }}>
                {Number(product.price).toLocaleString('vi-VN')} đ
              </Text>
              <Text style={{ fontSize: 15, color: '#999' }}>/{product.unit}</Text>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
              }}
            >
              {product.stock > 0 ? (
                <>
                  <span style={{ color: '#00a63e', fontSize: 18 }}>✓</span>
                  <Text style={{ fontSize: 15, color: '#555' }}>
                    Còn {product.stock} {product.unit} trong kho
                  </Text>
                </>
              ) : (
                <Tag
                  color="red"
                  style={{ fontSize: 13, padding: '4px 12px' }}
                >
                  Hết hàng
                </Tag>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#333',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                Mô tả sản phẩm
              </Text>
              <Paragraph
                style={{
                  fontSize: 14,
                  color: '#666',
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {product.description}
              </Paragraph>
            </div>

            <Divider style={{ margin: '0 0 20px' }} />

            {product.stock > 0 && (
              <>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#e04949',
                    display: 'block',
                    marginBottom: 10,
                  }}
                >
                  Số lượng
                </Text>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: 44,
                        height: 44,
                        border: 'none',
                        background: '#fafafa',
                        cursor: 'pointer',
                        fontSize: 20,
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      −
                    </button>
                    <div
                      style={{
                        width: 56,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 17,
                        fontWeight: 600,
                        borderLeft: '1.5px solid #e0e0e0',
                        borderRight: '1.5px solid #e0e0e0',
                      }}
                    >
                      {quantity}
                    </div>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      style={{
                        width: 44,
                        height: 44,
                        border: 'none',
                        background: '#fafafa',
                        cursor: 'pointer',
                        fontSize: 20,
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </div>
                  <Text style={{ color: '#999', fontSize: 14 }}>
                    {product.unit}
                  </Text>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 12,
                      border: '2px solid #00a63e',
                      background: '#fff',
                      color: '#00a63e',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f6ffed';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <ShoppingCartOutlined style={{ fontSize: 18 }} />
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => {
                      navigate('/checkout');
                    }}
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 12,
                      border: 'none',
                      background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #388e3c, #1b5e20)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
                    }}
                  >
                    Mua ngay
                  </button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Tabs
          defaultActiveKey="description"
          size="large"
          items={[
            {
              key: 'description',
              label: <span style={{ fontWeight: 600 }}>MÔ TẢ</span>,
              children: (
                <Paragraph
                  style={{
                    fontSize: 15,
                    lineHeight: 2,
                    color: '#444',
                    whiteSpace: 'pre-wrap',
                    padding: '16px 0',
                  }}
                >
                  {product.description}
                </Paragraph>
              ),
            },
            {
              key: 'reviews',
              label: (
                <span style={{ fontWeight: 600 }}>
                  ĐÁNH GIÁ ({averageRating.total})
                </span>
              ),
              children: (
                <div style={{ padding: '16px 0' }}>
                  {isAuthenticated ? (
                    <Card
                      style={{
                        marginBottom: 24,
                        background: '#f9f9f9',
                        borderRadius: 10,
                      }}
                    >
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
                            {
                              required: true,
                              message: 'Vui lòng chọn số sao!',
                            },
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
                          style={{
                            background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                            borderColor: '#2e7d32',
                          }}
                        >
                          Gửi đánh giá
                        </Button>
                      </Form>
                    </Card>
                  ) : (
                    <Card
                      style={{
                        marginBottom: 24,
                        textAlign: 'center',
                        background: '#f9f9f9',
                        borderRadius: 10,
                      }}
                    >
                      <Text>
                        Vui lòng{' '}
                        <a
                          onClick={() => navigate('/login')}
                          style={{
                            color: '#00a63e',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
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
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                }}
                              >
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
                                <Text
                                  type="secondary"
                                  style={{ fontSize: 12 }}
                                >
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
        <div style={{ marginBottom: 24 }}>
          <Title
            level={3}
            style={{
              marginBottom: 20,
              fontWeight: 800,
              fontStyle: 'italic',
            }}
          >
            Sản phẩm liên quan
          </Title>

          <Row gutter={[16, 16]}>
            {relatedProducts.map((rp) => (
              <Col xs={12} sm={8} md={6} key={rp.id}>
                <div
                  onClick={() => navigate(`/products/${rp.id}`)}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '1.5px solid #ebebeb',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {rp.thumbnail ? (
                      <img
                        src={getImageUrl(rp.thumbnail)}
                        alt={rp.name}
                        style={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 200,
                          background: '#f6ffed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 48,
                        }}
                      >
                        🍊
                      </div>
                    )}
                    {rp.isFeatured && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: '#00a63e',
                          color: '#fff',
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Nổi bật
                      </div>
                    )}
                    
                  </div>

                  <div style={{ padding: '14px 14px 16px' }}>
                    <Text
                      strong
                      style={{
                        fontSize: 16,
                        display: 'block',
                        marginBottom: 2,
                        color: '#333',
                      }}
                    >
                      {rp.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#858484',
                        display: 'block',
                        marginBottom: 6,
                      }}
                    >
                      {rp.category?.name || rp.unit}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      {rp.reviewCount > 0 ? (
                        <>
                          <span style={{ color: '#f5a623', fontSize: 14 }}>★</span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{rp.avgRating}</span>
                          <span style={{ color: '#bbb', fontSize: 13 }}>({rp.reviewCount})</span>
                        </>
                      ) : (
                        <span style={{ color: '#bbb', fontSize: 13 }}>Chưa có đánh giá</span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 6,
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#e04949',
                        }}
                      >
                        {Number(rp.price).toLocaleString('vi-VN')} đ
                      </span>
                      
                      <span style={{ fontSize: 14, color: '#999' }}>
                        /{rp.unit}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
                      style={{
                        width: '100%',
                        padding: '10px 0',
                        background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 550,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'linear-gradient(135deg, #388e3c, #1b5e20)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)')
                      }
                    >
                      <ShoppingCartOutlined />
                      Thêm vào giỏ
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