import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  SendOutlined,
} from '@ant-design/icons';
import '../styles/ContactPage.css';

const { TextArea } = Input;

const infoCards = [
  {
    icon: <EnvironmentOutlined />,
    title: 'Địa chỉ',
    lines: ['53 Nguyễn Minh Châu, Hòa Hải', 'Đà Nẵng'],
  },
  {
    icon: <PhoneOutlined />,
    title: 'Điện thoại',
    lines: ['Hotline: 0376410304', 'Tư vấn: 0376410304'],
  },
  {
    icon: <MailOutlined />,
    title: 'Email',
    lines: ['huyteo1003@gmail.com', 'support@halonafruits.vn'],
  },
  {
    icon: <ClockCircleOutlined />,
    title: 'Giờ làm việc',
    lines: ['Thứ 2 - Thứ 7: 7:00 - 21:00', 'Chủ nhật: 8:00 - 18:00'],
  },
];

const faqs = [
  {
    q: 'Thời gian giao hàng là bao lâu?',
    a: 'Chúng tôi giao hàng trong ngày đối với nội thành TP.HCM với đơn đặt trước 12h trưa. Đơn hàng ngoại thành và tỉnh sẽ được giao trong 1-3 ngày làm việc.',
  },
  {
    q: 'Chính sách đổi trả như thế nào?',
    a: 'Nếu sản phẩm không đạt chất lượng cam kết (dập nát, hư hỏng, không tươi), chúng tôi sẽ hoàn tiền 100% hoặc giao lại sản phẩm mới miễn phí trong vòng 24 giờ.',
  },
  {
    q: 'Có hỗ trợ thanh toán online không?',
    a: 'Có, chúng tôi hỗ trợ thanh toán khi nhận hàng (COD) và chuyển khoản ngân hàng. Sắp tới sẽ tích hợp thêm ví điện tử MoMo, ZaloPay.',
  },
  {
    q: 'Đặt hàng số lượng lớn có được giảm giá không?',
    a: 'Có, chúng tôi có chính sách giá sỉ cho đơn hàng từ 10kg trở lên. Vui lòng liên hệ hotline 0901 234 567 để được tư vấn chi tiết.',
  },
  {
    q: 'Trái cây có nguồn gốc từ đâu?',
    a: 'Trái cây nội địa được thu mua trực tiếp từ các vùng trồng nổi tiếng: Đắk Lắk, Bến Tre, Tiền Giang, Đà Lạt... Trái cây nhập khẩu từ Mỹ, Úc, New Zealand, Nhật Bản đều có giấy tờ kiểm định.',
  },
];

const socials = [
  { icon: <FacebookOutlined />, label: 'Facebook', color: '#1877f2' },
  { icon: <InstagramOutlined />, label: 'Instagram', color: '#e4405f' },
  { icon: <YoutubeOutlined />, label: 'YouTube', color: '#ff0000' },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      message.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Liên hệ với chúng tôi</h1>
          <p className="contact-hero-sub">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="contact-info">
        <div className="contact-info-grid">
          {infoCards.map((info, index) => (
            <div key={index} className="contact-info-card">
              <div className="contact-info-icon">{info.icon}</div>
              <h3 className="contact-info-title">{info.title}</h3>
              {info.lines.map((line, i) => (
                <p key={i} className="contact-info-line">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Form + Map */}
      <div className="contact-form-section">
        <div className="contact-form-inner">
          <div className="contact-section-head">
            <div className="contact-divider-title">
              <div className="contact-divider-line" />
              <h2 className="contact-divider-heading">Gửi tin nhắn cho chúng tôi</h2>
              <div className="contact-divider-line" />
            </div>
            <p className="contact-section-sub">
              Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ
            </p>
          </div>

          <div className="contact-form-row">
            <div className="contact-form-box">
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="contact-form-fields">
                  <Form.Item
                    name="name"
                    label="Họ tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    className="contact-form-field"
                  >
                    <Input placeholder="Nguyễn Văn A" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                    className="contact-form-field"
                  >
                    <Input placeholder="example@gmail.com" size="large" />
                  </Form.Item>
                </div>

                <div className="contact-form-fields">
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    className="contact-form-field"
                  >
                    <Input placeholder="0901 234 567" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="Chủ đề"
                    rules={[{ required: true, message: 'Vui lòng nhập chủ đề!' }]}
                    className="contact-form-field"
                  >
                    <Input placeholder="VD: Hỏi về đơn hàng" size="large" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="message"
                  label="Nội dung tin nhắn"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <TextArea
                    rows={5}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    style={{ resize: 'none' }}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<SendOutlined />}
                  className="contact-submit-btn"
                >
                  Gửi tin nhắn
                </Button>
              </Form>
            </div>

            <div className="contact-map">
              <iframe
                title="Bản đồ Halona Fruits"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4694!2d106.7004!3d10.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM2LjgiTiAxMDbCsDQyJzAxLjQiRQ!5e0!3m2!1svi!2svn!4v1234567890"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="contact-faq">
        <div className="contact-faq-inner">
          <div className="contact-section-head">
            <h2 className="contact-faq-title">Câu hỏi thường gặp</h2>
            <p className="contact-section-sub">
              Giải đáp những thắc mắc phổ biến của khách hàng
            </p>
          </div>

          {faqs.map((faq, index) => (
            <div key={index} className="contact-faq-item">
              <h3 className="contact-faq-q">
                <span className="contact-faq-q-badge">?</span>
                {faq.q}
              </h3>
              <p className="contact-faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social */}
      <div className="contact-social">
        <h2 className="contact-social-title">Kết nối với chúng tôi</h2>
        <p className="contact-social-sub">
          Theo dõi để nhận ưu đãi và cập nhật sản phẩm mới nhất
        </p>

        <div className="contact-social-row">
          {socials.map((social, index) => (
            <div
              key={index}
              className="contact-social-icon"
              title={social.label}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = social.color;
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${social.color}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {social.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}