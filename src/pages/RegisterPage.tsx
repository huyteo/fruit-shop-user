import { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import '../styles/RegisterPage.css';

const perks = [
  { icon: '🚚', text: 'Giao trong ngày tại nội thành' },
  { icon: '🌿', text: 'Trái cây tươi, không hóa chất' },
  { icon: '🎁', text: 'Giảm 15% cho đơn đầu tiên' },
];

const fruits = [
  { emoji: '🍎', top: '14%', left: '8%', delay: '0s' },
  { emoji: '🥭', top: '30%', right: '12%', delay: '1.2s' },
  { emoji: '🍇', bottom: '26%', left: '14%', delay: '0.6s' },
  { emoji: '🍊', bottom: '14%', right: '18%', delay: '1.8s' },
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Đăng ký thành công!');
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-wrap">
      <div className="reg-shell">
        {/* Panel thương hiệu */}
        <aside className="reg-aside">
          <div className="reg-aside-deco reg-aside-deco--1" />
          <div className="reg-aside-deco reg-aside-deco--2" />
          <div className="reg-aside-frame" />

          {fruits.map((f, i) => (
            <span
              key={i}
              className="reg-fruit"
              style={{
                top: f.top,
                left: f.left,
                right: f.right,
                bottom: f.bottom,
                animationDelay: f.delay,
              }}
            >
              {f.emoji}
            </span>
          ))}

          <div className="reg-brand">
            <div className="reg-brand-logo">🍒</div>
            <span className="reg-brand-name">Halona Fruits</span>
          </div>

          <div className="reg-stamp">
            <div className="reg-stamp-seal">
              <span className="reg-stamp-seal-icon">🌱</span>
            </div>
            <div>
              <div className="reg-stamp-title">Nông trại Việt</div>
              <div className="reg-stamp-sub">Tuyển chọn từ vườn · Từ 2024</div>
            </div>
          </div>

          <div className="reg-chips">
            <span className="reg-chip">✓ Chứng nhận VietGAP</span>
            <span className="reg-chip">100% tự nhiên</span>
          </div>

          <div className="reg-aside-body">
            <h2 className="reg-aside-title">
              Tươi ngon mỗi ngày,
              <br />
              giao tận tay bạn
            </h2>
            <p className="reg-aside-sub">
              Tạo tài khoản để đặt trái cây tươi từ nông trại và nhận ưu đãi
              dành riêng cho thành viên.
            </p>

            <div className="reg-perks">
              {perks.map((p, i) => (
                <div key={i} className="reg-perk">
                  <span className="reg-perk-dot">{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="reg-main">
          <div className="reg-head">
            <h1 className="reg-title">Đăng ký tài khoản</h1>
            <p className="reg-subtitle">
              Chỉ mất một phút để bắt đầu mua sắm.
            </p>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ tên" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item name="phone">
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Số điện thoại (không bắt buộc)"
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="reg-submit"
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <Divider className="reg-divider">hoặc</Divider>

          <div className="reg-foot">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}