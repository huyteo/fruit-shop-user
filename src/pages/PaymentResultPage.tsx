import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const resultCode = params.get('resultCode');
  const success = resultCode === '0';

  const rawOrderId = params.get('orderId') || '';
  const realOrderId = rawOrderId.split('-')[0];

  return (
    <Result
      status={success ? 'success' : 'error'}
      title={success ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
      subTitle={
        success
          ? `Đơn hàng #${realOrderId} đã được thanh toán qua MoMo.`
          : `Đơn hàng #${realOrderId} chưa được thanh toán. Bạn có thể thử lại.`
      }
      extra={[
        <Button type="primary" key="orders" onClick={() => navigate('/orders')}>
          Xem đơn hàng
        </Button>,
        <Button key="home" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>,
      ]}
    />
  );
}