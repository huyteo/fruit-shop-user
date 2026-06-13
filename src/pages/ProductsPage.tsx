import { useState, useEffect } from 'react';
import { Spin, Empty, Slider, message } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/useCart';
import { getImageUrl } from '../utils/image';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  unit: string;
  stock: number;
  description: string;
  isFeatured: boolean;
  category: { id: number; name: string };
  avgRating: number;
  reviewCount: number;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const categoryFilter = searchParams.get('category');
  const searchKeyword = searchParams.get('search') || '';

  useEffect(() => {
    axiosClient.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (searchKeyword) {
          response = await axiosClient.get(`/products/search?keyword=${searchKeyword}`);
        } else if (categoryFilter) {
          response = await axiosClient.get(`/products/category/${categoryFilter}`);
        } else {
          response = await axiosClient.get('/products');
        }
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter, searchKeyword]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      message.warning('Sản phẩm đã hết hàng');
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      thumbnail: product.thumbnail,
      unit: product.unit,
      quantity: 1,
      stock: product.stock,
    });
    message.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const filteredProducts = products
    .filter((p) => {
      const price = Number(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleCategoryClick = (catId: number | null) => {
    if (catId) {
      setSearchParams({ category: String(catId) });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilter = () => {
    setSearchParams({});
    setPriceRange([0, 500000]);
    setSortBy('featured');
  };


  return (
    <div
      style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '28px 32px',
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 280,
          flexShrink: 0,
          background: '#fff',
          borderRadius: 14,
          padding: '20px 18px',
          border: '1.5px solid #e8e8e8',
          position: 'sticky',
          top: 88,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          <FilterOutlined style={{ fontSize: 18, color: '#333' }} />
          <span style={{ fontSize: 18, fontWeight: 650, color: '#333' }}>
            Bộ lọc
          </span>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: '#333',
              marginBottom: 12,
              borderBottom: '2px solid #e8e8e8',
              paddingBottom: 8,
            }}
          >
            Danh mục
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              onClick={() => handleCategoryClick(null)}
              style={{
                padding: '9px 14px',
                borderRadius: 8,
                border: 'none',
                background: !categoryFilter ? '#00a63e' : 'transparent',
                color: !categoryFilter ? '#f3f3f3' : '#656161',
                fontSize: 15,
                fontWeight: !categoryFilter ? 550 : 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  padding: '9px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background:
                    categoryFilter === String(cat.id)
                      ? '#00a63e'
                      : 'transparent',
                  color:
                    categoryFilter === String(cat.id) ? '#f3f3f3' : '#656161',
                  fontSize: 14,
                  fontWeight:
                    categoryFilter === String(cat.id) ? 550 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (categoryFilter !== String(cat.id))
                    e.currentTarget.style.background = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  if (categoryFilter !== String(cat.id))
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#333',
              marginBottom: 12,
              borderBottom: '2px solid #e8e8e8',
              paddingBottom: 8,
            }}
          >
            Khoảng giá
          </div>
          <Slider
            range
            min={0}
            max={500000}
            step={10000}
            value={priceRange}
            onChange={(val) => setPriceRange(val as [number, number])}
            trackStyle={[{ backgroundColor: '#00a63e', height: 5 }]}
            railStyle={{ height: 5 }}
            handleStyle={[
              { borderColor: '#00a63e', width: 16, height: 16 },
              { borderColor: '#00a63e', width: 16, height: 16 },
            ]}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: '#888',
              marginTop: 6,
            }}
          >
            <span>{priceRange[0].toLocaleString('vi-VN')} đ</span>
            <span>{priceRange[1].toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        <button
          onClick={handleResetFilter}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 8,
            border: '1.5px solid #e0e0e0',
            background: '#fff',
            color: '#555',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00a63e';
            e.currentTarget.style.color = '#00a63e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.color = '#555';
          }}
        >
          Đặt lại bộ lọc
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1.5px solid #e8e8e8',
            padding: '14px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: '1.5px solid',
                borderColor: viewMode === 'grid' ? '#00a63e' : '#e0e0e0',
                background: viewMode === 'grid' ? '#f6ffed' : '#fff',
                color: viewMode === 'grid' ? '#00a63e' : '#999',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              <AppstoreOutlined />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: '1.5px solid',
                borderColor: viewMode === 'list' ? '#00a63e' : '#e0e0e0',
                background: viewMode === 'list' ? '#f6ffed' : '#fff',
                color: viewMode === 'list' ? '#00a63e' : '#999',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              <UnorderedListOutlined />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, color: '#888' }}>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1.5px solid #e0e0e0',
                fontSize: 14,
                color: '#333',
                cursor: 'pointer',
                outline: 'none',
                minWidth: 150,
              }}
            >
              <option value="featured">Nổi bật</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <Spin size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty description="Không tìm thấy sản phẩm nào" />
        ) : viewMode === 'grid' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}
          >
            {filteredProducts.map((product) => {
              const rating = product.avgRating;
              const reviews = product.reviewCount;

              return (
                <div
                  key={product.id}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '1.5px solid #ebebeb',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 28px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    onClick={() => navigate(`/products/${product.id}`)}
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    {product.thumbnail ? (
                      <img
                        src={getImageUrl(product.thumbnail)}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: 250,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 190,
                          background: '#f6ffed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 50,
                        }}
                      >
                        🍊
                      </div>
                    )}
                    {product.isFeatured && (
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

                  <div
                    style={{
                      padding: '14px 14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    <h3
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#333',
                        marginBottom: 3,
                        cursor: 'pointer',
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </h3>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#858484',
                        marginBottom: 8,
                      }}
                    >
                      {product.category?.name || product.unit}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                      {reviews > 0 ? (
                        <>
                          <StarFilled style={{ color: '#f5a623', fontSize: 14 }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{rating}</span>
                          <span style={{ fontSize: 14, color: '#bbb' }}>({reviews})</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 13, color: '#bbb' }}>Chưa có đánh giá</span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 6,
                        marginBottom: 14,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 19,
                          fontWeight: 700,
                          color: '#e04949',
                        }}
                      >
                        {Number(product.price).toLocaleString('vi-VN')} đ
                      </span>
                      
                      <span style={{ fontSize: 14, color: '#999' }}>
                        /{product.unit}
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={product.stock <= 0}
                        style={{
                          width: '100%',
                          padding: '10px 0',
                          background:
                            product.stock > 0 ? 'linear-gradient(135deg, #4caf50, #2e7d32)' : '#ccc',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 15,
                          fontWeight: 550,
                          cursor:
                            product.stock > 0
                              ? 'pointer'
                              : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 7,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (product.stock > 0)
                            e.currentTarget.style.background = 'linear-gradient(135deg, #388e3c, #1b5e20)';
                        }}
                        onMouseLeave={(e) => {
                          if (product.stock > 0)
                            e.currentTarget.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
                        }}
                      >
                        <ShoppingCartOutlined />
                        {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {filteredProducts.map((product) => {
              const rating = product.avgRating;
              const reviews = product.reviewCount;

              return (
                <div
                  key={product.id}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    border: '1.5px solid #ebebeb',
                    display: 'flex',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    onClick={() => navigate(`/products/${product.id}`)}
                    style={{
                      width: 170,
                      height: 150,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    {product.thumbnail ? (
                      <img
                        src={getImageUrl(product.thumbnail)}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#f6ffed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 44,
                        }}
                      >
                        🍊
                      </div>
                    )}
                    {product.isFeatured && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: '#00a63e',
                          color: '#fff',
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Nổi bật
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <h3
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#333',
                        marginBottom: 3,
                        cursor: 'pointer',
                      }}
                    >
                      {product.name}
                    </h3>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#999',
                        marginBottom: 6,
                      }}
                    >
                      {product.category?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                      {reviews > 0 ? (
                        <>
                          <StarFilled style={{ color: '#f5a623', fontSize: 13 }} />
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{rating}</span>
                          <span style={{ color: '#bbb', fontSize: 12 }}>({reviews})</span>
                        </>
                      ) : (
                        <span style={{ color: '#bbb', fontSize: 12 }}>Chưa có đánh giá</span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: '#e04949',
                        }}
                      >
                        {Number(product.price).toLocaleString('vi-VN')} đ
                      </span>
                      <span style={{ fontSize: 12, color: '#999' }}>
                        /{product.unit}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: 16,
                    }}
                  >
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        whiteSpace: 'nowrap',
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}