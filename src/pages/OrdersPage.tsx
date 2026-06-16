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
import '../styles/OrdersPage.css';

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

const filterTabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'shipping', label: 'Đang giao' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

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
      <div className="orders-center">
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-center">
        <Empty description="Bạn chưa có đơn hàng nào" />
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          size="large"
          onClick={() => navigate('/products')}
          className="orders-empty-btn"
        >
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <Title level={3} style={{ margin: 0 }}>
          📋 Đơn hàng của tôi
        </Title>
        <Text type="secondary">{orders.length} đơn hàng</Text>
      </div>

      {/* Bộ lọc */}
      <div className="orders-filters">
        {filterTabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`orders-filter-btn${
              filter === item.key ? ' orders-filter-btn--active' : ''
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div className="orders-empty-filter">
          <Text type="secondary">Không có đơn hàng nào với trạng thái này</Text>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;

            return (
              <div key={order.id} className="orders-card">
                {/* Header đơn hàng */}
                <div
                  className="orders-card-head"
                  style={{
                    background: config.bg,
                    borderBottom: `2px solid ${config.color}22`,
                  }}
                >
                  <div className="orders-card-head-left">
                    <div
                      className="orders-card-icon"
                      style={{ color: config.color }}
                    >
                      {config.icon}
                    </div>
                    <div>
                      <div className="orders-card-id">Đơn hàng #{order.id}</div>
                      <div className="orders-card-date">
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <Tag color={config.color} className="orders-card-tag">
                    {config.label}
                  </Tag>
                </div>

                {/* Thanh tiến trình */}
                {order.status !== 'cancelled' && (
                  <div className="orders-steps">
                    <Steps
                      current={getStepCurrent(order.status)}
                      size="small"
                      items={[
                        {
                          title: <span className="orders-step-title">Chờ xác nhận</span>,
                          icon: <ClockCircleOutlined />,
                        },
                        {
                          title: <span className="orders-step-title">Đã xác nhận</span>,
                          icon: <CheckCircleOutlined />,
                        },
                        {
                          title: <span className="orders-step-title">Đang giao</span>,
                          icon: <CarOutlined />,
                        },
                        {
                          title: <span className="orders-step-title">Hoàn thành</span>,
                          icon: <SmileOutlined />,
                        },
                      ]}
                    />
                  </div>
                )}

                {/* Danh sách sản phẩm */}
                <div className="orders-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="orders-item">
                      <div className="orders-item-left">
                        <div className="orders-item-dot" />
                        <div>
                          <div className="orders-item-name">
                            {item.productName}
                          </div>
                          <div className="orders-item-meta">
                            {Number(item.productPrice).toLocaleString('vi-VN')}đ x {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="orders-item-subtotal">
                        {Number(item.subtotal).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>

                {/* Thông tin giao hàng + Tổng tiền */}
                <div className="orders-footer">
                  <div className="orders-shipping">
                    <div>
                      <span className="orders-shipping-muted">Giao đến: </span>
                      <span className="orders-shipping-name">
                        {order.receiverName} - {order.shippingPhone}
                      </span>
                    </div>
                    <div>
                      <span className="orders-shipping-muted">Địa chỉ: </span>
                      <span className="orders-shipping-val">{order.shippingAddress}</span>
                    </div>
                    <div>
                      <span className="orders-shipping-muted">Thanh toán: </span>
                      <span className="orders-shipping-val">
                        {paymentLabels[order.paymentMethod]}
                      </span>
                    </div>
                    {order.note && (
                      <div>
                        <span className="orders-shipping-muted">Ghi chú: </span>
                        <span className="orders-shipping-note">{order.note}</span>
                      </div>
                    )}
                  </div>

                  <div className="orders-total">
                    <div className="orders-total-label">Tổng cộng</div>
                    <div className="orders-total-value">
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