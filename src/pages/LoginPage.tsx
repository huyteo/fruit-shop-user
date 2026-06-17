import { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import '../styles/LoginPage.css';

const perks = [
  { icon: '🛒', text: 'Mua trái cây tươi giao tận nhà' },
  { icon: '📦', text: 'Xem lại đơn và mua lại nhanh' },
  { icon: '🎁', text: 'Ưu đãi & mã giảm cho thành viên' },
];

const fruits = [
  { emoji: '🍓', top: '14%', left: '8%', delay: '0s' },
  { emoji: '🍇', top: '30%', right: '12%', delay: '1.2s' },
  { emoji: '🥝', bottom: '26%', left: '14%', delay: '0.6s' },
  { emoji: '🍋', bottom: '14%', right: '18%', delay: '1.8s' },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Đăng nhập thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-shell">
        {/* Panel thương hiệu */}
        <aside className="login-aside">
          <div className="login-aside-deco login-aside-deco--1" />
          <div className="login-aside-deco login-aside-deco--2" />
          <div className="login-aside-frame" />

          {fruits.map((f, i) => (
            <span
              key={i}
              className="login-fruit"
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

          <div className="login-brand">
            <div className="login-brand-logo">🍒</div>
            <span className="login-brand-name">Halona Fruits</span>
          </div>

          <div className="login-stamp">
            <div className="login-stamp-seal">🌱</div>
            <div>
              <div className="login-stamp-title">Chào mừng trở lại</div>
              <div className="login-stamp-sub">Trái cây tươi đang đợi bạn</div>
            </div>
          </div>

          <div className="login-aside-body">
            <h2 className="login-aside-title">
              Đăng nhập để
              <br />
              bắt đầu mua sắm
            </h2>
            <p className="login-aside-sub">
              Đăng nhập để chọn trái cây tươi, đặt hàng nhanh và nhận ưu đãi
              dành riêng cho thành viên Halona.
            </p>

            <div className="login-perks">
              {perks.map((p, i) => (
                <div key={i} className="login-perk">
                  <span className="login-perk-dot">{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="login-main">
          <div className="login-head">
            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-subtitle">
              Vui lòng nhập thông tin tài khoản của bạn.
            </p>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              style={{ marginBottom: 0 }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <div className="login-forgot-row">
              <span
                className="login-forgot"
                onClick={() => navigate('/forgot-password')}
              >
                Quên mật khẩu?
              </span>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="login-submit"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <Divider className="login-divider">hoặc</Divider>

          <div className="login-foot">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}