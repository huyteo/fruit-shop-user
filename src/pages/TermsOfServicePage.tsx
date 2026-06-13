import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      <Button icon={<ArrowLeftOutlined />} type="link" onClick={() => navigate(-1)}
        style={{ marginBottom: 12, padding: 0, color: '#00a63e' }}>
        Quay lại
      </Button>

      <div style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #2ecc71 100%)', borderRadius: 20, padding: '32px 28px', marginBottom: 20, color: '#fff' }}>
        <FileTextOutlined style={{ fontSize: 36, marginBottom: 10 }} />
        <Title level={2} style={{ color: '#fff', margin: 0 }}>Điều khoản sử dụng</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0' }}>
          Cập nhật lần cuối: 01/06/2026
        </Paragraph>
      </div>

      <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}>
        <Title level={4}>1. Chấp nhận điều khoản</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Khi sử dụng website và ứng dụng Halona Fruits, bạn đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
        </Paragraph>

        <Title level={4}>2. Tài khoản người dùng</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình. Mọi hoạt động diễn ra dưới tài khoản của bạn được xem là do bạn thực hiện. Vui lòng cung cấp thông tin chính xác khi đăng ký.
        </Paragraph>

        <Title level={4}>3. Đặt hàng và thanh toán</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Giá sản phẩm được niêm yết công khai và có thể thay đổi. Đơn hàng chỉ được xác nhận sau khi thanh toán thành công hoặc xác nhận đặt hàng (đối với thanh toán khi nhận hàng). Chúng tôi có quyền từ chối đơn hàng trong trường hợp hết hàng hoặc nghi ngờ gian lận.
        </Paragraph>

        <Title level={4}>4. Chính sách đổi trả</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Halona Fruits cam kết hoàn tiền 100% nếu sản phẩm không đạt chất lượng. Bạn cần thông báo trong vòng 24 giờ kể từ khi nhận hàng kèm hình ảnh minh chứng.
        </Paragraph>

        <Title level={4}>5. Quyền sở hữu nội dung</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Toàn bộ hình ảnh, nội dung, logo trên Halona Fruits thuộc quyền sở hữu của chúng tôi. Bạn không được sao chép, sử dụng cho mục đích thương mại khi chưa có sự đồng ý.
        </Paragraph>

        <Title level={4}>6. Thay đổi điều khoản</Title>
        <Paragraph style={{ color: '#555', lineHeight: 1.9 }}>
          Chúng tôi có quyền cập nhật điều khoản sử dụng bất kỳ lúc nào. Các thay đổi sẽ được thông báo trên website và có hiệu lực ngay khi đăng tải.
        </Paragraph>
      </Card>
    </div>
  );
}