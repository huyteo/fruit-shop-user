import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Button,
  Typography,
  Divider,
  List,
  Image,
  message,
  Result,
  Spin,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/useAuth';
import type { CartItem } from '../contexts/CartContext';
import { getImageUrl } from '../utils/image';
import '../styles/CheckoutPage.css';

const { Text } = Typography;

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const { items: cartItems, removeFromCart } = useCart();
  const [form] = Form.useForm();

  // Lấy sản phẩm đã chọn từ localStorage
  const checkoutData = localStorage.getItem('checkoutItems');
  const items: CartItem[] = checkoutData ? JSON.parse(checkoutData) : cartItems;
  const totalAmount = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 20000;
  const finalTotal = totalAmount + shippingFee;
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lấy hồ sơ đầy đủ (tên, SĐT, địa chỉ) để tự điền vào form
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }
      try {
        const res = await axiosClient.get(`/users/${user.id}`);
        form.setFieldsValue({
          receiverName: res.data.name || '',
          shippingPhone: res.data.phone || '',
          shippingAddress: res.data.address || '',
          paymentMethod: 'cod',
        });
      } catch (error) {
        console.error(error);
        // Nếu lỗi, ít nhất điền tên từ context
        form.setFieldsValue({
          receiverName: user.name || '',
          paymentMethod: 'cod',
        });
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [user, form]);

  if (items.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  if (orderSuccess) {
    return (
      <Result
        status="success"
        title="Đặt hàng thành công!"
        subTitle={`Mã đơn hàng: #${orderId}. Chúng tôi sẽ liên hệ xác nhận sớm nhất.`}
        extra={[
          <Button
            type="primary"
            key="orders"
            onClick={() => navigate('/orders')}
          >
            Xem đơn hàng
          </Button>,
          <Button key="home" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>,
        ]}
      />
    );
  }

  const handleSubmit = async (values: {
    receiverName: string;
    shippingPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    note?: string;
  }) => {
    if (!values.shippingPhone?.trim() || !values.shippingAddress?.trim()) {
      message.warning(
        'Bạn chưa có số điện thoại hoặc địa chỉ. Vui lòng cập nhật trong trang Hồ sơ trước khi đặt hàng.',
      );
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        receiverName: values.receiverName,
        shippingPhone: values.shippingPhone,
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod,
        note: values.note || '',
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await axiosClient.post('/orders', orderData);
      const newOrderId = response.data.id;

      if (values.paymentMethod === 'momo') {
        items.forEach((item) => removeFromCart(item.productId));
        localStorage.removeItem('checkoutItems');

        const payRes = await axiosClient.post('/payment/momo/create', {
          orderId: newOrderId,
          amount: finalTotal,
          platform: 'web',
        });

        window.location.href = payRes.data.payUrl;
        return;
      }

      setOrderId(newOrderId);
      setOrderSuccess(true);
      items.forEach((item) => removeFromCart(item.productId));
      localStorage.removeItem('checkoutItems');
      message.success('Đặt hàng thành công!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="co-page">
      {/* Page header */}
      <div className="co-page-header">
        <div className="co-page-header-icon">📦</div>
        <div>
          <h1 className="co-page-title">Đặt hàng</h1>
          <div className="co-page-subtitle">Xác nhận thông tin và hoàn tất đơn hàng</div>
        </div>
      </div>

      <div className="co-layout">
        {/* Left: shipping form */}
        <div className="co-col-form">
          <div className="co-card">
            <div className="co-card-head">
              <span className="co-card-head-bar" />
              <span className="co-card-head-title">Thông tin giao hàng</span>
            </div>
            <div className="co-card-body">
              {profileLoading ? (
                <div className="co-loading">
                  <Spin />
                </div>
              ) : (
                <>
                  <div className="co-info-banner">
                    ℹ️ Thông tin được lấy từ hồ sơ của bạn. Muốn thay đổi, vui lòng cập nhật trong{' '}
                    <a className="co-info-link" onClick={() => navigate('/profile')}>
                      trang Hồ sơ
                    </a>
                    .
                  </div>

                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ paymentMethod: 'cod' }}
                    className="co-form"
                  >
                    <Form.Item
                      name="receiverName"
                      label="Tên người nhận"
                      rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}
                    >
                      <Input placeholder="Nguyễn Văn A" size="large" readOnly />
                    </Form.Item>

                    <Form.Item
                      name="shippingPhone"
                      label="Số điện thoại"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                      <Input placeholder="Chưa có trong hồ sơ" size="large" readOnly />
                    </Form.Item>

                    <Form.Item
                      name="shippingAddress"
                      label="Địa chỉ giao hàng"
                      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                      <Input.TextArea rows={2} placeholder="Chưa có trong hồ sơ" readOnly />
                    </Form.Item>

                    <Form.Item
                      name="paymentMethod"
                      label="Phương thức thanh toán"
                      rules={[{ required: true }]}
                    >
                      <Radio.Group className="co-pay-group">
                        <Radio value="cod" className="co-pay-option">
                          <span className="co-pay-label">
                            <span className="co-pay-emoji">💵</span>
                            Thanh toán khi nhận hàng (COD)
                          </span>
                        </Radio>
                        <Radio value="momo" className="co-pay-option">
                          <span className="co-pay-label">
                            <span className="co-pay-emoji">📱</span>
                            Thanh toán qua MoMo
                          </span>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item name="note" label="Ghi chú">
                      <Input.TextArea
                        rows={2}
                        placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      loading={loading}
                      className="co-submit"
                    >
                      Xác nhận đặt hàng
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <div className="co-col-summary">
          <div className="co-card">
            <div className="co-card-head">
              <span className="co-card-head-bar" />
              <span className="co-card-head-title">Đơn hàng của bạn</span>
            </div>
            <div className="co-card-body">
              <List
                dataSource={items}
                renderItem={(item: CartItem) => (
                  <List.Item>
                    <div className="co-summary-item">
                      {item.thumbnail ? (
                        <div className="co-summary-thumb-wrap">
                          <Image
                            src={getImageUrl(item.thumbnail)}
                            width={56}
                            height={56}
                            className="co-summary-thumb"
                            preview={false}
                          />
                        </div>
                      ) : (
                        <div className="co-summary-thumb-placeholder">🍊</div>
                      )}
                      <div className="co-summary-info">
                        <Text className="co-summary-name">{item.name}</Text>
                        <div className="co-summary-meta">
                          {Number(item.price).toLocaleString('vi-VN')}đ x {item.quantity}
                        </div>
                      </div>
                      <Text className="co-summary-line-price">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </Text>
                    </div>
                  </List.Item>
                )}
              />

              <Divider />

              <div className="co-total-row">
                <span className="co-total-label">Tạm tính</span>
                <span className="co-total-value">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="co-total-row">
                <span className="co-total-label">Phí giao hàng</span>
                <span className="co-total-value">+{shippingFee.toLocaleString('vi-VN')}đ</span>
              </div>

              <Divider />

              <div className="co-grand-row">
                <span className="co-grand-label">Tổng cộng</span>
                <span className="co-grand-value">
                  {finalTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}