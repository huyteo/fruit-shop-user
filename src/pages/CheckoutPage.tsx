import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Button,
  Card,
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

const { Title, Text } = Typography;


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
        amount: totalAmount,
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
    <div>
      <Title level={3}>📦 Đặt hàng</Title>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 400 }}>
          <Card title="Thông tin giao hàng">
            {profileLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin />
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: 8,
                    padding: '10px 14px',
                    marginBottom: 20,
                    fontSize: 13,
                    color: '#389e0d',
                  }}
                >
                  ℹ️ Thông tin được lấy từ hồ sơ của bạn. Muốn thay đổi, vui lòng
                  cập nhật trong{' '}
                  <a
                    onClick={() => navigate('/profile')}
                    style={{ color: '#389e0d', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    trang Hồ sơ
                  </a>
                  .
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{ paymentMethod: 'cod' }}
                >
                  <Form.Item
                    name="receiverName"
                    label="Tên người nhận"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên người nhận!' },
                    ]}
                  >
                    <Input placeholder="Nguyễn Văn A" size="large" readOnly />
                  </Form.Item>

                  <Form.Item
                    name="shippingPhone"
                    label="Số điện thoại"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    ]}
                  >
                    <Input placeholder="Chưa có trong hồ sơ" size="large" readOnly />
                  </Form.Item>

                  <Form.Item
                    name="shippingAddress"
                    label="Địa chỉ giao hàng"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                  >
                    <Input.TextArea
                      rows={2}
                      placeholder="Chưa có trong hồ sơ"
                      readOnly
                    />
                  </Form.Item>

                  <Form.Item
                    name="paymentMethod"
                    label="Phương thức thanh toán"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      <Radio
                        value="cod"
                        style={{ display: 'block', marginBottom: 8 }}
                      >
                        💵 Thanh toán khi nhận hàng (COD)
                      </Radio>
                      <Radio value="momo" style={{ display: 'block' }}>
                        📱 Thanh toán qua MoMo
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
                    style={{ background: '#f5222d', borderColor: '#f5222d' }}
                  >
                    Xác nhận đặt hàng
                  </Button>
                </Form>
              </>
            )}
          </Card>
        </div>

        <Card
          title="Đơn hàng của bạn"
          style={{ width: 380, height: 'fit-content' }}
        >
          <List
            dataSource={items}
            renderItem={(item: CartItem) => (
              <List.Item>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                  }}
                >
                  {item.thumbnail ? (
                    <Image
                      src={getImageUrl(item.thumbnail)}
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                      preview={false}
                    />
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        background: '#f6ffed',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      🍊
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <Text strong>{item.name}</Text>
                    <div style={{ color: '#888', fontSize: 13 }}>
                      {Number(item.price).toLocaleString('vi-VN')}đ x{' '}
                      {item.quantity}
                    </div>
                  </div>
                  <Text strong style={{ color: '#f5222d' }}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </Text>
                </div>
              </List.Item>
            )}
          />

          <Divider />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text>Tạm tính:</Text>
            <Text>{totalAmount.toLocaleString('vi-VN')}đ</Text>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text>Phí giao hàng:</Text>
            <Text style={{ color: '#52c41a' }}>Miễn phí</Text>
          </div>

          <Divider />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text strong style={{ fontSize: 16 }}>
              Tổng cộng:
            </Text>
            <Text strong style={{ fontSize: 20, color: '#f5222d' }}>
              {totalAmount.toLocaleString('vi-VN')}đ
            </Text>
          </div>
        </Card>
        </div>
      </div>
  );
}