import { useState } from 'react';
import {
  Button,
  Typography,
  Popconfirm,
  Checkbox,
  message,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  MinusOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/useAuth';

const { Title, Text } = Typography;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  const selectedTotal = items
    .filter((item) => selectedIds.includes(item.productId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedCount = selectedIds.length;

  const handleCheckout = () => {
    if (selectedCount === 0) {
      message.warning('Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const selectedItems = items.filter((item) =>
      selectedIds.includes(item.productId),
    );
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/checkout');
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => removeFromCart(id));
    setSelectedIds([]);
  };

  if (items.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px',
          maxWidth: 500,
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
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
          style={{
            background: '#00a63e',
            borderColor: '#00a63e',
            borderRadius: 8,
            height: 48,
            fontWeight: 600,
          }}
        >
          Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          🛒 Giỏ hàng
          <span style={{ color: '#999', fontSize: 16, fontWeight: 400, marginLeft: 8 }}>
            ({items.length} sản phẩm)
          </span>
        </Title>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 20px',
              background: '#f0f7ff',
              borderRadius: '12px 12px 0 0',
              border: '1.5px solid #f0f7ff',
              borderBottom: 'none',
              gap: 14,
            }}
          >
            <Checkbox
              checked={isAllSelected}
              onChange={toggleSelectAll}
              style={{ transform: 'scale(1.15)' }}
            />
            <Text strong style={{ flex: 1, fontSize: 14, color: '#333' }}>
              Chọn tất cả ({items.length})
            </Text>
            {selectedCount > 0 && (
              <Popconfirm
                title={`Xóa ${selectedCount} sản phẩm đã chọn?`}
                onConfirm={handleDeleteSelected}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ borderRadius: 6 }}
                >
                  Xóa đã chọn
                </Button>
              </Popconfirm>
            )}
          </div>

          <div
            style={{
              border: '1.5px solid #e8e8e8',
              borderTop: '1.5px solid #e5e7e9',
              borderRadius: '0 0 12px 12px',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            {items.map((item, index) => {
              const isSelected = selectedIds.includes(item.productId);
              return (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    gap: 16,
                    borderBottom:
                      index < items.length - 1
                        ? '1px solid #f0f0f0'
                        : 'none',
                    background: isSelected ? '#f0f7ff' : '#fff',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleSelect(item.productId)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleSelect(item.productId)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ transform: 'scale(1.15)' }}
                  />

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${item.productId}`);
                    }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid #f0f0f0',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={`${API_URL}${item.thumbnail}`}
                        alt={item.name}
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
                          background: '#f0f7ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 32,
                        }}
                      >
                        🍊
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${item.productId}`);
                      }}
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: '#333',
                        marginBottom: 6,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.name}
                    </div>
                    <div>
                      <span style={{ color: '#e04949', fontWeight: 600, fontSize: 15 }}>
                        {Number(item.price).toLocaleString('vi-VN')}đ
                      </span>
                      <span style={{ color: '#bbb', fontSize: 13, marginLeft: 2 }}>
                        /{item.unit}
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      style={{
                        width: 34,
                        height: 34,
                        border: 'none',
                        background: '#fafafa',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: '#666',
                      }}
                    >
                      <MinusOutlined />
                    </button>
                    <div
                      style={{
                        width: 42,
                        height: 34,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 14,
                        borderLeft: '1.5px solid #e0e0e0',
                        borderRight: '1.5px solid #e0e0e0',
                      }}
                    >
                      {item.quantity}
                    </div>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.min(item.stock, item.quantity + 1),
                        )
                      }
                      style={{
                        width: 34,
                        height: 34,
                        border: 'none',
                        background: '#fafafa',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: '#666',
                      }}
                    >
                      <PlusOutlined />
                    </button>
                  </div>

                  <div
                    style={{
                      width: 120,
                      textAlign: 'right',
                      fontWeight: 700,
                      color: '#e04949',
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>

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
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: 32,
                        height: 32,
                        border: 'none',
                        background: 'transparent',
                        color: '#ccc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6,
                        transition: 'all 0.2s',
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ff4d4f';
                        e.currentTarget.style.background = '#fff2f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ccc';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  </Popconfirm>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/products')}
              style={{ borderRadius: 6 }}
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
              <Button style={{ borderRadius: 6 }}>
                Xóa toàn bộ giỏ hàng
              </Button>
            </Popconfirm>
          </div>
        </div>

        <div style={{ width: 340, flexShrink: 0, position: 'sticky', top: 88 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1.5px solid #e8e8e8',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                background: '#f0f7ff',
                borderBottom: '1.5px solid #e8e8e8',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16, color: '#333' }}>
                Tóm tắt đơn hàng
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              {selectedCount > 0 ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                      fontSize: 14,
                    }}
                  >
                    <Text style={{ color: '#888' }}>Đã chọn:</Text>
                    <Text strong>{selectedCount} sản phẩm</Text>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                      fontSize: 14,
                    }}
                  >
                    <Text style={{ color: '#888' }}>Tạm tính:</Text>
                    <Text>{selectedTotal.toLocaleString('vi-VN')}đ</Text>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                      fontSize: 14,
                    }}
                  >
                    <Text style={{ color: '#888' }}>Phí vận chuyển:</Text>
                    <Text style={{ color: '#00a63e', fontWeight: 600 }}>
                      Miễn phí
                    </Text>
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: '#f0f0f0',
                      margin: '16px 0',
                    }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: 600 }}>
                      Tổng cộng:
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: '#e04949',
                      }}
                    >
                      {selectedTotal.toLocaleString('vi-VN')}đ
                    </Text>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px 0',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👆</div>
                  <Text style={{ color: '#999', fontSize: 14 }}>
                    Hãy chọn sản phẩm mà bạn muốn mua
                  </Text>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background:
                    selectedCount > 0
                      ? 'linear-gradient(135deg, #e04949 0%, #c0392b 100%)'
                      : '#e0e0e0',
                  color: selectedCount > 0 ? '#fff' : '#999',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedCount > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(224,73,73,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {!isAuthenticated
                  ? 'Đăng nhập để đặt hàng'
                  : selectedCount > 0
                    ? `Đặt hàng (${selectedCount} sản phẩm)`
                    : 'Chọn sản phẩm để đặt hàng'}
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              background: '#fff',
              borderRadius: 12,
              border: '1.5px solid #e8e8e8',
              padding: '16px 20px',
            }}
          >
            {[
              {
                icon: <CarOutlined style={{ color: '#00a63e', fontSize: 16 }} />,
                text: 'Giao hàng miễn phí',
              },
              {
                icon: <SafetyCertificateOutlined style={{ color: '#00a63e', fontSize: 16 }} />,
                text: 'Đổi trả trong 24 giờ',
              },
              {
                icon: <GiftOutlined style={{ color: '#00a63e', fontSize: 16 }} />,
                text: 'Ưu đãi cho thành viên',
              },
            ].map((badge, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom:
                    i < 2 ? '1px solid #f5f5f5' : 'none',
                }}
              >
                {badge.icon}
                <span style={{ fontSize: 13, color: '#666' }}>
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}