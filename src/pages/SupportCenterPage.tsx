import { Typography, Card, Button, Collapse } from 'antd';
import {
  ArrowLeftOutlined, QuestionCircleOutlined, MailOutlined,
  PhoneOutlined, MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const faqs = [
  { q: 'Làm sao để đặt hàng?', a: 'Bạn chọn sản phẩm, thêm vào giỏ hàng, sau đó vào giỏ hàng và tiến hành thanh toán. Điền địa chỉ giao hàng và chọn phương thức thanh toán để hoàn tất.' },
  { q: 'Thời gian giao hàng bao lâu?', a: 'Đơn hàng nội thành được giao trong vòng 2-24 giờ. Các khu vực khác có thể mất 2-3 ngày tùy địa điểm.' },
  { q: 'Tôi có thể đổi trả sản phẩm không?', a: 'Có. Halona Fruits hoàn tiền 100% nếu sản phẩm không đạt chất lượng. Vui lòng thông báo trong 24 giờ kèm hình ảnh.' },
  { q: 'Có những phương thức thanh toán nào?', a: 'Chúng tôi hỗ trợ thanh toán khi nhận hàng (COD), MoMo, VNPay và ZaloPay.' },
  { q: 'Làm sao để theo dõi đơn hàng?', a: 'Bạn vào mục "Đơn hàng của tôi" trong trang Hồ sơ để xem trạng thái và lịch sử đơn hàng.' },
];

export default function SupportCenterPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      <Button icon={<ArrowLeftOutlined />} type="link" onClick={() => navigate(-1)}
        style={{ marginBottom: 12, padding: 0, color: '#00a63e' }}>
        Quay lại
      </Button>

      <div style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #2ecc71 100%)', borderRadius: 20, padding: '32px 28px', marginBottom: 20, color: '#fff' }}>
        <QuestionCircleOutlined style={{ fontSize: 36, marginBottom: 10 }} />
        <Title level={2} style={{ color: '#fff', margin: 0 }}>Trung tâm hỗ trợ</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0' }}>
          Chúng tôi luôn sẵn sàng giúp đỡ bạn
        </Paragraph>
      </div>

      {/* Liên hệ nhanh */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: <PhoneOutlined />, label: 'Hotline', value: '1900 1234', color: '#4caf50', bg: '#e8f5e9' },
          { icon: <MailOutlined />, label: 'Email', value: 'support@halonafruits.vn', color: '#2196f3', bg: '#e3f2fd' },
          { icon: <MessageOutlined />, label: 'Chat AI', value: 'Tư vấn ngay', color: '#9c27b0', bg: '#f3e5f5' },
        ].map((c, i) => (
          <Card key={i} style={{ borderRadius: 14, textAlign: 'center', border: '1px solid #f0f0f0', cursor: c.label === 'Chat AI' ? 'pointer' : 'default' }}
            onClick={() => { if (c.label === 'Chat AI') navigate('/chat'); }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: c.color, fontSize: 20 }}>
              {c.icon}
            </div>
            <Text style={{ display: 'block', fontSize: 12, color: '#999' }}>{c.label}</Text>
            <Text strong style={{ fontSize: 13 }}>{c.value}</Text>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Title level={4} style={{ marginBottom: 12 }}>Câu hỏi thường gặp</Title>
      <Collapse
        accordion
        style={{ borderRadius: 16, overflow: 'hidden' }}
        items={faqs.map((f, i) => ({
          key: String(i),
          label: <Text strong>{f.q}</Text>,
          children: <Paragraph style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>{f.a}</Paragraph>,
        }))}
      />
    </div>
  );
}