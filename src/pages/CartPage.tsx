import { useState } from 'react';
import {
  Button,
  Typography,
  Popconfirm,
  message,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MinusOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/useAuth';
import { getImageUrl } from '../utils/image';
import '../styles/CartPage.css';

const { Title, Text } = Typography;

const FREE_SHIP_THRESHOLD = 200000;
const SHIPPING_FEE = 25000;

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const isAllSelected =
    items.length > 0 && selectedIds.length === items.length;

  const toggleSelect = (productId: number) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.productId));
    }
  };

  const selectedItems = items.filter((item) =>
    selectedIds.includes(item.productId),
  );
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const selectedCount = selectedIds.length;

  const freeShip = selectedTotal >= FREE_SHIP_THRESHOLD;
  const shippingFee = freeShip ? 0 : SHIPPING_FEE;
  const grandTotal = selectedTotal + (selectedCount > 0 ? shippingFee : 0);
  const progressPct = Math.min((selectedTotal / FREE_SHIP_THRESHOLD) * 100, 100);

  const handleCheckout = () => {
    if (selectedCount === 0) {
      message.warning('Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/checkout');
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => removeFromCart(id));
    setSelectedIds([]);
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <Title level={3} style={{ color: '#333', marginBottom: 8 }}>
          Giỏ hàng trống
        </Title>
        <Text style={{ color: '#999', fontSize: 15, display: 'block', marginBottom: 24 }}>
          Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!
        </Text>
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          size="large"
          onClick={() => navigate('/products')}
          className="cart-empty-btn"
        >
          Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* ===== HEADER (giữ nguyên) ===== */}
      <div className="cart-header">
        <Title level={3} style={{ margin: 0 }}>
          🛒 Giỏ hàng
          <span className="cart-header-count">
            ({items.length} sản phẩm)
          </span>
        </Title>
      </div>

      <div className="cart-layout">
        <div className="cart-main">
          {/* ===== Select all ===== */}
          <div className="cart-selectall">
            <span
              className={`cart-cb${isAllSelected ? ' cart-cb--on' : ''}`}
              onClick={toggleSelectAll}
            >
              <CheckOutlined />
            </span>
            <Text className="cart-selectall-label">
              {isAllSelected
                ? 'Bỏ chọn tất cả'
                : `Chọn tất cả (${items.length})`}
            </Text>
            {selectedCount > 0 && (
              <Popconfirm
                title={`Xóa ${selectedCount} sản phẩm đã chọn?`}
                onConfirm={handleDeleteSelected}
                okText="Xóa"
                cancelText="Hủy"
              >
                <span className="cart-del-selected">
                  <DeleteOutlined /> Xóa ({selectedCount})
                </span>
              </Popconfirm>
            )}
          </div>

          {/* ===== Items ===== */}
          <div className="cart-list">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.productId);
              const canDecrease = item.quantity > 1;
              const canIncrease = item.quantity < item.stock;
              return (
                <div
                  key={item.productId}
                  className={`cart-item${isSelected ? ' cart-item--selected' : ''}`}
                  onClick={() => toggleSelect(item.productId)}
                >
                  {isSelected && <div className="cart-item-strip" />}

                  <div className="cart-item-inner">
                    <span
                      className={`cart-cb${isSelected ? ' cart-cb--on' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.productId);
                      }}
                    >
                      <CheckOutlined />
                    </span>

                    <div
                      className="cart-item-thumb"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${item.productId}`);
                      }}
                    >
                      {item.thumbnail ? (
                        <img src={getImageUrl(item.thumbnail)} alt={item.name} />
                      ) : (
                        <div className="cart-item-thumb-placeholder">🍊</div>
                      )}
                      <div className="cart-item-gloss" />
                    </div>

                    <div className="cart-item-body">
                      <div className="cart-item-name-row">
                        <span
                          className="cart-item-name"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${item.productId}`);
                          }}
                        >
                          {item.name}
                        </span>
                        <Popconfirm
                          title="Xóa sản phẩm này?"
                          onConfirm={() => {
                            removeFromCart(item.productId);
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== item.productId),
                            );
                          }}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <button
                            className="cart-item-remove"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CloseOutlined />
                          </button>
                        </Popconfirm>
                      </div>

                      <span className="cart-price-pill">
                        {Number(item.price).toLocaleString('vi-VN')}đ
                        <span className="cart-price-pill-unit"> /{item.unit}</span>
                      </span>

                      <div className="cart-qty-row">
                        <div
                          className="cart-qty"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="cart-qty-btn"
                            disabled={!canDecrease}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                          >
                            <MinusOutlined />
                          </button>
                          <div className="cart-qty-value">{item.quantity}</div>
                          <button
                            className="cart-qty-btn"
                            disabled={!canIncrease}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Math.min(item.stock, item.quantity + 1),
                              )
                            }
                          >
                            <PlusOutlined />
                          </button>
                        </div>

                        <span className="cart-item-subtotal">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== Actions ===== */}
          <div className="cart-actions">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/products')}
              className="cart-btn-rounded"
            >
              Tiếp tục mua sắm
            </Button>
            <Popconfirm
              title="Xóa toàn bộ giỏ hàng?"
              onConfirm={() => {
                clearCart();
                setSelectedIds([]);
              }}
              okText="Xóa hết"
              cancelText="Hủy"
            >
              <Button className="cart-btn-rounded">
                Xóa toàn bộ giỏ hàng
              </Button>
            </Popconfirm>
          </div>
        </div>

        {/* ===== Sidebar ===== */}
        <div className="cart-sidebar">
          {/* Free ship progress */}
          {selectedCount > 0 && !freeShip && (
            <div className="cart-freeship">
              <div className="cart-freeship-top">
                <div className="cart-freeship-icon">🚚</div>
                <div className="cart-freeship-msg">
                  Mua thêm{' '}
                  <span className="cart-freeship-hl">
                    {(FREE_SHIP_THRESHOLD - selectedTotal).toLocaleString('vi-VN')}đ
                  </span>{' '}
                  để miễn phí ship!
                </div>
              </div>
              <div className="cart-progress-track">
                <div
                  className="cart-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
                <div
                  className="cart-progress-dot"
                  style={{ left: `${progressPct}%` }}
                />
              </div>
              <div className="cart-progress-labels">
                <span className="cart-progress-label">0đ</span>
                <span className="cart-progress-label cart-progress-label--end">
                  200.000đ
                </span>
              </div>
            </div>
          )}

          {selectedCount > 0 && freeShip && (
            <div className="cart-freeship-won">
              <div className="cart-freeship-won-inner">
                <span style={{ fontSize: 20 }}>🎉</span>
                <span className="cart-freeship-won-txt">
                  Bạn được miễn phí vận chuyển!
                </span>
                <span className="cart-freeship-won-check">
                  <CheckOutlined />
                </span>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="cart-summary">
            <div className="cart-summary-head">
              <div className="cart-summary-head-icon">
                <FileTextOutlined />
              </div>
              <div className="cart-summary-title">Chi tiết đơn hàng</div>
            </div>

            <div className="cart-summary-dotted" />

            {selectedCount > 0 ? (
              <>
                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span className="cart-summary-label">
                      Tạm tính ({selectedItems.reduce((s, i) => s + i.quantity, 0)} sp)
                    </span>
                    <span className="cart-summary-val">
                      {selectedTotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="cart-summary-row">
                    <span className="cart-summary-label">
                      Phí vận chuyển
                      {freeShip && <span className="cart-free-pill">FREE</span>}
                    </span>
                    <span
                      className={`cart-summary-val${freeShip ? ' cart-summary-val--free' : ''}`}
                    >
                      {freeShip
                        ? 'Miễn phí'
                        : `+${shippingFee.toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                </div>

                <div className="cart-total-block">
                  <div className="cart-total-row">
                    <div>
                      <div className="cart-total-label">Tổng cộng</div>
                      <div className="cart-total-vat">Đã bao gồm VAT</div>
                    </div>
                    <div className="cart-total-val">
                      {grandTotal.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  <button
                    onClick={handleCheckout}
                    className="cart-checkout-btn cart-checkout-btn--active"
                  >
                    {!isAuthenticated
                      ? 'Đăng nhập để đặt hàng'
                      : `Đặt hàng (${selectedCount} sản phẩm)`}
                  </button>
                </div>
              </>
            ) : (
              <div className="cart-summary-empty">
                <div className="cart-summary-empty-icon">👆</div>
                <Text className="cart-summary-empty-text">
                  Hãy chọn sản phẩm mà bạn muốn mua
                </Text>
              </div> 
            )}
          </div>
           <div className="cart-trust">
            {[
              { icon: <CarOutlined />, text: 'Giao hàng miễn phí' },
              { icon: <SafetyCertificateOutlined />, text: 'Đổi trả trong 24 giờ' },
              { icon: <GiftOutlined />, text: 'Ưu đãi cho thành viên' },
            ].map((b, i) => (
              <div
                key={i}
                className={`cart-trust-row${i < 2 ? ' cart-trust-divider' : ''}`}
              >
                <span className="cart-trust-icon">{b.icon}</span>
                <span className="cart-trust-text">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Thanh đặt hàng cố định (chỉ hiện trên mobile) ===== */}
      <div className="cart-mobile-bar">
        <div className="cart-mobile-bar-info">
          {selectedCount > 0 ? (
            <>
              <div className="cart-mobile-bar-hint">
                {selectedCount} sản phẩm đã chọn
              </div>
              <div className="cart-mobile-bar-total">
                {grandTotal.toLocaleString('vi-VN')}đ
              </div>
            </>
          ) : (
            <span className="cart-mobile-bar-placeholder">
              Chọn sản phẩm để mua
            </span>
          )}
        </div>
        <button
          onClick={handleCheckout}
          disabled={selectedCount === 0}
          className={`cart-mobile-bar-btn ${
            selectedCount > 0
              ? 'cart-checkout-btn--active'
              : 'cart-checkout-btn--disabled'
          }`}
        >
          {!isAuthenticated
            ? 'Đăng nhập'
            : selectedCount > 0
              ? `Đặt hàng (${selectedCount})`
              : 'Đặt hàng'}
          {selectedCount > 0 && <ArrowRightOutlined />}
        </button>
      </div>
    </div>
  );
}