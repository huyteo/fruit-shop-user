import { useState, useEffect, useRef } from 'react';
import {
  Spin, Empty, Slider, message, Breadcrumb, Tag, Tooltip,
  Badge, Pagination, ConfigProvider, Modal
} from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  StarFilled,
  HomeOutlined,
  DownOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/useCart';
import { getImageUrl } from '../utils/image';
import '../styles/ProductsPage.css';
import { useAuth } from '../contexts/useAuth';

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

const ACCENT   = 'rgb(249 174 91)';
const BRAND    = '#00a63e';
const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Nổi bật' },
  { value: 'price_asc',  label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name',       label: 'Tên A-Z' },
];

function ProductRating({ rating, reviews }: { rating: number; reviews: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="pp-rating">
      <span className="pp-rating-stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarFilled key={i} className={`pp-star${i <= rounded ? ' pp-star--filled' : ''}`} />
        ))}
      </span>
      <span className="pp-rating-count">({reviews})</span>
    </div>
  );
}

export default function ProductsPage() {
  const [products,         setProducts]         = useState<Product[]>([]);
  const [categories,       setCategories]       = useState<Category[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [viewMode,         setViewMode]         = useState<'grid' | 'list'>('grid');
  const [sortBy,           setSortBy]           = useState('featured');
  const [priceRange,       setPriceRange]       = useState<[number, number]>([0, 500000]);
  const [filterPopupOpen,  setFilterPopupOpen]  = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage,      setCurrentPage]      = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate   = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const gridRef    = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const categoryFilter = searchParams.get('category');
  const searchKeyword  = searchParams.get('search') || '';

  /* ── Data fetching ── */
  useEffect(() => {
    axiosClient.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetch = async () => {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [categoryFilter, searchKeyword]);

  /* ── Reset page when filters / sort change ── */
  const priceMin = priceRange[0];
  const priceMax = priceRange[1];
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchKeyword, sortBy, priceMin, priceMax]);

  /* ── Handlers ── */
  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
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

    if (product.stock <= 0) { message.warning('Sản phẩm đã hết hàng'); return; }
    addToCart({
      productId: product.id, name: product.name,
      price: Number(product.price), thumbnail: product.thumbnail,
      unit: product.unit, quantity: 1, stock: product.stock,
    });
    message.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  /* ── Derived data ── */
  const filteredProducts = products
    .filter((p) => { const price = Number(p.price); return price >= priceRange[0] && price <= priceRange[1]; })
    .sort((a, b) => {
      if (sortBy === 'price_asc')  return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      return 0;
    });

  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const categoryCounts = products.reduce<Record<number, number>>((acc, p) => {
    if (p.category?.id) acc[p.category.id] = (acc[p.category.id] || 0) + 1;
    return acc;
  }, {});

  const categoryName      = categoryFilter ? categories.find((c) => String(c.id) === categoryFilter)?.name : null;
  const isPriceFiltered   = priceRange[0] > 0 || priceRange[1] < 500000;
  const activeFilterCount = (categoryFilter ? 1 : 0) + (isPriceFiltered ? 1 : 0);
  const currentSortLabel  = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Nổi bật';

  /* ── Hero images ── */
  const heroImages = products.filter((p) => p.thumbnail).slice(0, 4);

  /* ── Filter popup content ── */
  const categoryList = [
    { id: null as number | null, name: 'Tất cả', count: products.length },
    ...categories.map((c) => ({ id: c.id as number | null, name: c.name, count: categoryCounts[c.id] ?? 0 })),
  ];

  const FilterContent = (
    <div className="pp-fc-grid">
      {/* Column 1: Category */}
      <div>
        <div className="pp-fc-col-header">Danh mục</div>
        <div className="pp-fc-cat-list">
          {categoryList.map((item) => {
            const isActive = item.id === null ? !categoryFilter : categoryFilter === String(item.id);
            return (
              <button
                key={item.id ?? 'all'}
                onClick={() => handleCategoryClick(item.id)}
                className={`pp-fc-cat-btn${isActive ? ' pp-fc-cat-btn--active' : ''}`}
              >
                <span>{item.name}</span>
                <span className={`pp-fc-cat-count${isActive ? ' pp-fc-cat-count--active' : ''}`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Column 2: Price range */}
      <div>
        <div className="pp-fc-col-header">Khoảng giá</div>
        <div className="pp-fc-price-display">
          <span className="pp-fc-price-text">{priceRange[0].toLocaleString('vi-VN')} đ</span>
          <span className="pp-fc-price-sep">—</span>
          <span className="pp-fc-price-text">{priceRange[1].toLocaleString('vi-VN')} đ</span>
        </div>
        <Slider
          range min={0} max={500000} step={10000}
          value={priceRange}
          onChange={(val) => setPriceRange(val as [number, number])}
          styles={{
            track:  { backgroundColor: BRAND, height: 5 },
            rail:   { height: 5 },
            handle: { borderColor: BRAND, width: 16, height: 16 },
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="pp-page">
      <div className="pp-inner">

        {/* ── Breadcrumb ── */}
        <div className="pp-breadcrumb-wrap">
          <Breadcrumb
            items={[
              { title: <Link to="/" className="pp-breadcrumb-link"><HomeOutlined /> Trang chủ</Link> },
              { title: <span className="pp-breadcrumb-current">Sản phẩm</span> },
            ]}
          />
        </div>

        {/* ── Hero Banner ── */}
        <div className="pp-hero">
          <div className="pp-hero-content">
            <div className="pp-hero-label">Cửa hàng trái cây tươi</div>
            <h1 className="pp-hero-title">Trái cây tươi mỗi ngày 🌿</h1>
            <p className="pp-hero-sub">Tươi ngon từ vườn — giao tận nhà trong 2 giờ</p>
            <div className="pp-hero-coupon">
              <span className="pp-hero-coupon-label">Mã giảm giá:</span>
              <span className="pp-hero-coupon-code">HALONA10</span>
            </div>
          </div>
          {heroImages.length > 0 ? (
            <div className="pp-hero-images">
              {heroImages.map((p) => (
                <div key={p.id} className="pp-hero-img-cell">
                  <img src={getImageUrl(p.thumbnail)} alt={p.name} />
                </div>
              ))}
            </div>
          ) : (
            <div className="pp-hero-emoji">🍊🍇<br />🥝🍓</div>
          )}
        </div>

        {/* ── Toolbar + popup wrapper ── */}
        <div ref={toolbarRef} className="pp-toolbar-wrap">

          {/* Toolbar bar */}
          <div className="pp-toolbar-bar">
            {/* ── Filter button ── */}
            <Badge count={activeFilterCount} size="small" color={ACCENT} offset={[-4, 4]} className="pp-filter-badge">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const opening = !filterPopupOpen;
                  setFilterPopupOpen((v) => !v);
                  setSortDropdownOpen(false);
                  if (opening) {
                    setTimeout(() => {
                      if (toolbarRef.current) {
                        const top = toolbarRef.current.getBoundingClientRect().top + window.scrollY - 90;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }, 10);
                  }
                }}
                className={`pp-filter-btn${filterPopupOpen ? ' pp-filter-btn--open' : activeFilterCount > 0 ? ' pp-filter-btn--active' : ''}`}
              >
                <FilterOutlined className="pp-filter-btn-icon" />
                Bộ lọc nâng cao
                <DownOutlined className={`pp-chevron-filter${filterPopupOpen ? ' pp-chevron--open' : ''}`} />
              </button>
            </Badge>

            {/* Active chips */}
            {categoryName && (
              <Tag closable onClose={() => handleCategoryClick(null)}
                style={{ borderRadius: 8, fontSize: 13, padding: '4px 10px', background: '#fff8ee', borderColor: `${ACCENT}55`, color: ACCENT, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {categoryName}
              </Tag>
            )}
            {isPriceFiltered && (
              <Tag closable onClose={() => setPriceRange([0, 500000])}
                style={{ borderRadius: 8, fontSize: 13, padding: '4px 10px', background: '#fff8ee', borderColor: `${ACCENT}55`, color: ACCENT, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                {priceRange[0].toLocaleString('vi-VN')}đ – {priceRange[1].toLocaleString('vi-VN')}đ
              </Tag>
            )}

            {/* Right side */}
            <div className="pp-toolbar-right">
              <span className="pp-product-count">{filteredProducts.length} sản phẩm</span>
              <div className="pp-divider-v" />

              {/* View mode */}
              <div className="pp-view-btns">
                {(['grid', 'list'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`pp-view-btn${viewMode === mode ? ' pp-view-btn--active' : ''}`}
                  >
                    {mode === 'grid' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
                  </button>
                ))}
              </div>

              {/* ── Sort dropdown ── */}
              <div className="pp-sort-wrap">
                <button
                  onClick={() => { setSortDropdownOpen((v) => !v); setFilterPopupOpen(false); }}
                  className={`pp-sort-btn${sortDropdownOpen ? ' pp-sort-btn--open' : ''}`}
                >
                  <span>{currentSortLabel}</span>
                  <DownOutlined className={`pp-chevron-sort${sortDropdownOpen ? ' pp-chevron--open' : ''}`} />
                </button>

                {sortDropdownOpen && (
                  <>
                    <div className="pp-sort-backdrop" onClick={() => setSortDropdownOpen(false)} />
                    <div className="pp-sort-list">
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = sortBy === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); setCurrentPage(1); }}
                            className={`pp-sort-opt${isSelected ? ' pp-sort-opt--selected' : ''}`}
                          >
                            {opt.label}
                            {isSelected && <CheckOutlined className="pp-check-icon" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Filter popup (absolute, overlays product grid) ── */}
          {filterPopupOpen && (
            <>
              <div className="pp-filter-backdrop" onClick={() => setFilterPopupOpen(false)} />
              <div className="pp-filter-popup">
                {/* Header */}
                <div className="pp-filter-header">
                  <span className="pp-filter-title">
                    <FilterOutlined className="pp-icon-brand" />
                    Bộ lọc nâng cao
                  </span>
                  <button onClick={() => setFilterPopupOpen(false)} className="pp-filter-close">✕</button>
                </div>

                {/* 2-column content */}
                {FilterContent}

                {/* Footer */}
                <div className="pp-filter-footer">
                  <button onClick={handleResetFilter} className="pp-filter-reset">Đặt lại</button>
                  <button onClick={() => setFilterPopupOpen(false)} className="pp-filter-apply">Áp dụng</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Products ── */}
        <div ref={gridRef}>
          {loading ? (
            <div className="pp-loading"><Spin size="large" /></div>
          ) : filteredProducts.length === 0 ? (
            <div className="pp-empty-wrap">
              <Empty description="Không tìm thấy sản phẩm nào" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="pp-grid">
              {pagedProducts.map((product) => (
                <div key={product.id} className="pp-card">
                  {/* Image */}
                  <div onClick={() => navigate(`/products/${product.id}`)} className="pp-card-img-wrap">
                    {product.thumbnail ? (
                      <img className="prod-img pp-card-img" src={getImageUrl(product.thumbnail)} alt={product.name} />
                    ) : (
                      <div className="pp-card-img-placeholder">🍊</div>
                    )}
                    {product.isFeatured && <div className="pp-card-badge">Nổi bật</div>}
                    {product.stock <= 0 && (
                      <div className="pp-card-sold-out">
                        <span className="pp-card-sold-out-label">Hết hàng</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="pp-card-info">
                    <h3 onClick={() => navigate(`/products/${product.id}`)} className="pp-card-name">
                      {product.name}
                    </h3>
                    <div className="pp-card-stock-row">
                      <span className={`pp-card-stock-dot pp-card-stock-dot--${product.stock > 0 ? 'in' : 'out'}`} />
                      <span className={`pp-card-stock-text pp-card-stock-text--${product.stock > 0 ? 'in' : 'out'}`}>
                        {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </div>
                    <div className="pp-card-rating">
                      <ProductRating rating={product.avgRating} reviews={product.reviewCount} />
                    </div>
                    <div className="pp-card-price-row">
                      <span className="pp-card-price">{Number(product.price).toLocaleString('vi-VN')} đ</span>
                      <span className="pp-card-unit">/{product.unit}</span>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={product.stock <= 0}
                      className={`pp-card-add-btn pp-card-add-btn--${product.stock > 0 ? 'available' : 'disabled'}`}
                    >
                      <ShoppingCartOutlined />
                      {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LIST */
            <div className="pp-list-view">
              {pagedProducts.map((product) => (
                <div key={product.id} className="pp-list-card">
                  <div onClick={() => navigate(`/products/${product.id}`)} className="pp-list-img-wrap">
                    {product.thumbnail ? (
                      <img src={getImageUrl(product.thumbnail)} alt={product.name} className="pp-list-img" />
                    ) : (
                      <div className="pp-list-img-placeholder">🍊</div>
                    )}
                    {product.isFeatured && <div className="pp-list-badge">Nổi bật</div>}
                  </div>
                  <div className="pp-list-info">
                    <h3 onClick={() => navigate(`/products/${product.id}`)} className="pp-list-name">
                      {product.name}
                    </h3>
                    <div className="pp-list-stock-row">
                      <span className={`pp-list-stock-dot pp-list-stock-dot--${product.stock > 0 ? 'in' : 'out'}`} />
                      <span className={`pp-list-stock-text pp-list-stock-text--${product.stock > 0 ? 'in' : 'out'}`}>
                        {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </div>
                    <ProductRating rating={product.avgRating} reviews={product.reviewCount} />
                    <div className="pp-list-price-row">
                      <span className="pp-list-price">{Number(product.price).toLocaleString('vi-VN')} đ</span>
                      <span className="pp-list-unit">/{product.unit}</span>
                    </div>
                  </div>
                  <div className="pp-list-action">
                    <Tooltip title={product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={product.stock <= 0}
                        className={`pp-list-add-btn pp-list-add-btn--${product.stock > 0 ? 'available' : 'disabled'}`}
                      >
                        <ShoppingCartOutlined />
                        {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {!loading && filteredProducts.length > PAGE_SIZE && (
            <div className="pp-pagination">
              <ConfigProvider theme={{ token: { colorPrimary: BRAND } }}>
                <Pagination
                  current={currentPage}
                  total={filteredProducts.length}
                  pageSize={PAGE_SIZE}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={false}
                />
              </ConfigProvider>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
