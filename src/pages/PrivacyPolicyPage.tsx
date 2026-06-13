import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      <Button icon={<ArrowLeftOutlined />} type="link" onClick={() => navigate(-1)}
        style={{ marginBottom: 12, padding: 0, color: '#00a63e' }}>
        Quay lại
      </Button>

      <div style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #2ecc71 100%)', borderRadius: 20, padding: '32px 28px', marginBottom: 20, color: '#fff' }}>
        <SafetyCertificateOutlined style={{ fontSize: 36, marginBottom: 10 }} />
        <Title level={2} style={{ color: '#fff', margin: 0 }}>Chính sách bảo mật</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0' }}>
          Cập nhật lần cuối: 01/06/2026
        </Paragraph>
      </div>

      <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}>
        <Title level={4}>1. Thông tin chúng tôi thu thập</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Halona Fruits thu thập các thông tin bạn cung cấp khi đăng ký tài khoản và đặt hàng, bao gồm: họ tên, email, số điện thoại, địa chỉ giao hàng. Chúng tôi cũng ghi nhận lịch sử đơn hàng và đánh giá sản phẩm để cải thiện trải nghiệm mua sắm.
        </Paragraph>

        <Title level={4}>2. Mục đích sử dụng thông tin</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Thông tin của bạn được dùng để xử lý đơn hàng, giao hàng, hỗ trợ khách hàng, và gửi thông báo về tình trạng đơn hàng. Chúng tôi không sử dụng thông tin cho mục đích nằm ngoài hoạt động kinh doanh trái cây.
        </Paragraph>

        <Title level={4}>3. Bảo mật thông tin</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Mật khẩu của bạn được mã hóa và lưu trữ an toàn. Chúng tôi áp dụng các biện pháp kỹ thuật để bảo vệ dữ liệu cá nhân khỏi truy cập trái phép. Thông tin thanh toán được xử lý qua các cổng thanh toán uy tín (MoMo, VNPay, ZaloPay).
        </Paragraph>

        <Title level={4}>4. Chia sẻ thông tin với bên thứ ba</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Chúng tôi chỉ chia sẻ thông tin cần thiết cho đơn vị vận chuyển để giao hàng. Halona Fruits cam kết không bán hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.
        </Paragraph>

        <Title level={4}>5. Quyền của bạn</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất kỳ lúc nào trong trang Hồ sơ. Nếu cần hỗ trợ, vui lòng liên hệ qua Trung tâm hỗ trợ.
        </Paragraph>

        <Title level={4}>6. Liên hệ</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ: support@halonafruits.vn hoặc hotline 1900 1234.
        </Paragraph>
      </Card>
    </div>
  );
}