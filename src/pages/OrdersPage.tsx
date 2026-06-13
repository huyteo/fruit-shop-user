import { useState, useEffect } from 'react';
import {
  Tag,
  Typography,
  Spin,
  Empty,
  Steps,
  message,
  Button,
} from 'antd';
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SmileOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

interface OrderItem {
  id: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  totalAmount: number;
  shippingAddress: string;
  shippingPhone: string;
  receiverName: string;
  status: string;
  paymentMethod: string;
  note: string;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  pending: {
    color: '#fa8c16',
    bg: '#fff7e6',
    icon: <ClockCircleOutlined />,
    label: 'Chờ xác nhận',
  },
  confirmed: {
    color: '#1890ff',
    bg: '#e6f7ff',
    icon: <CheckCircleOutlined />,
    label: 'Đã xác nhận',
  },
  shipping: {
    color: '#13c2c2',
    bg: '#e6fffb',
    icon: <CarOutlined />,
    label: 'Đang giao hàng',
  },
  completed: {
    color: '#52c41a',
    bg: '#f6ffed',
    icon: <SmileOutlined />,
    label: 'Hoàn thành',
  },
  cancelled: {
    color: '#ff4d4f',
    bg: '#fff2f0',
    icon: <CloseCircleOutlined />,
    label: 'Đã hủy',
  },
};

const paymentLabels: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  banking: 'Chuyển khoản ngân hàng',
};

function getStepCurrent(status: string): number {
  const steps: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    shipping: 2,
    completed: 3,
  };
  return steps[status] ?? 0;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        message.error('Lỗi tải đơn hàng');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Empty description="Bạn chưa có đơn hàng nào" />
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          size="large"
          onClick={() => navigate('/products')}
          style={{ marginTop: 16, background: '#00a63e', borderColor: '#00a63e' }}
        >
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          📋 Đơn hàng của tôi
        </Title>
        <Text type="secondary">{orders.length} đơn hàng</Text>
      </div>

      {/* Bộ lọc */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'pending', label: 'Chờ xác nhận' },
          { key: 'confirmed', label: 'Đã xác nhận' },
          { key: 'shipping', label: 'Đang giao' },
          { key: 'completed', label: 'Hoàn thành' },
          { key: 'cancelled', label: 'Đã hủy' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              border: filter === item.key ? '2px solid #00a63e' : '1.5px solid #e0e0e0',
              background: filter === item.key ? '#f6ffed' : '#fff',
              color: filter === item.key ? '#00a63e' : '#666',
              fontWeight: filter === item.key ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">Không có đơn hàng nào với trạng thái này</Text>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;

            return (
              <div
                key={order.id}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1.5px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header đơn hàng */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    background: config.bg,
                    borderBottom: `2px solid ${config.color}22`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: config.color,
                        fontSize: 16,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      }}
                    >
                      {config.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>
                        Đơn hàng #{order.id}
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <Tag
                    color={config.color}
                    style={{
                      fontSize: 13,
                      padding: '4px 14px',
                      borderRadius: 20,
                      fontWeight: 600,
                      border: 'none',
                    }}
                  >
                    {config.label}
                  </Tag>
                </div>

                {/* Thanh tiến trình */}
                {order.status !== 'cancelled' && (
                  <div style={{ padding: '20px 24px 8px' }}>
                    <Steps
                      current={getStepCurrent(order.status)}
                      size="small"
                      items={[
                        {
                          title: <span style={{ fontSize: 12 }}>Chờ xác nhận</span>,
                          icon: <ClockCircleOutlined />,
                        },
                        {
                          title: <span style={{ fontSize: 12 }}>Đã xác nhận</span>,
                          icon: <CheckCircleOutlined />,
                        },
                        {
                          title: <span style={{ fontSize: 12 }}>Đang giao</span>,
                          icon: <CarOutlined />,
                        },
                        {
                          title: <span style={{ fontSize: 12 }}>Hoàn thành</span>,
                          icon: <SmileOutlined />,
                        },
                      ]}
                    />
                  </div>
                )}

                {/* Danh sách sản phẩm */}
                <div style={{ padding: '12px 24px' }}>
                  {order.items.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom:
                          index < order.items.length - 1
                            ? '1px solid #f5f5f5'
                            : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#00a63e',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14, color: '#333' }}>
                            {item.productName}
                          </div>
                          <div style={{ fontSize: 12, color: '#999' }}>
                            {Number(item.productPrice).toLocaleString('vi-VN')}đ x {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>
                        {Number(item.subtotal).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>

                {/* Thông tin giao hàng + Tổng tiền */}
                <div
                  style={{
                    padding: '16px 24px',
                    background: '#fafafa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
                    <div>
                      <span style={{ color: '#999' }}>Giao đến: </span>
                      <span style={{ color: '#333', fontWeight: 500 }}>
                        {order.receiverName} - {order.shippingPhone}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#999' }}>Địa chỉ: </span>
                      <span style={{ color: '#333' }}>{order.shippingAddress}</span>
                    </div>
                    <div>
                      <span style={{ color: '#999' }}>Thanh toán: </span>
                      <span style={{ color: '#333' }}>
                        {paymentLabels[order.paymentMethod]}
                      </span>
                    </div>
                    {order.note && (
                      <div>
                        <span style={{ color: '#999' }}>Ghi chú: </span>
                        <span style={{ color: '#333', fontStyle: 'italic' }}>
                          {order.note}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                      Tổng cộng
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: '#e04949',
                      }}
                    >
                      {Number(order.totalAmount).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}