import { useState, useEffect } from 'react';
import {
  Input, Button, Spin, message, Upload, Modal, Form, Select,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined,
  CameraOutlined, EditOutlined, CheckOutlined, CloseOutlined,
  CalendarOutlined, RightOutlined, ShoppingOutlined,
  MessageOutlined, ScanOutlined, SafetyCertificateOutlined,
  FileTextOutlined, QuestionCircleOutlined, StarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/useAuth';
import { getImageUrl } from '../utils/image';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: string;
  createdAt: string;
}

interface District { name: string; wards: string[]; }
interface Province { name: string; districts: District[]; }

const vietnamData: Province[] = [
  {
    name: 'TP. Hồ Chí Minh',
    districts: [
      { name: 'Quận 1', wards: ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho', 'Phường Cô Giang', 'Phường Đa Kao', 'Phường Nguyễn Cư Trinh', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Tân Định'] },
      { name: 'Quận 2', wards: ['Phường An Khánh', 'Phường An Lợi Đông', 'Phường An Phú', 'Phường Bình An', 'Phường Bình Khánh', 'Phường Bình Trưng Đông', 'Phường Bình Trưng Tây', 'Phường Cát Lái', 'Phường Thạnh Mỹ Lợi', 'Phường Thảo Điền'] },
      { name: 'Quận 3', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường Võ Thị Sáu'] },
      { name: 'Quận 7', wards: ['Phường Bình Thuận', 'Phường Phú Mỹ', 'Phường Phú Thuận', 'Phường Tân Hưng', 'Phường Tân Kiểng', 'Phường Tân Phong', 'Phường Tân Phú', 'Phường Tân Quy'] },
      { name: 'Quận Bình Thạnh', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'] },
      { name: 'Quận Gò Vấp', wards: ['Phường 1', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12'] },
      { name: 'Quận Tân Bình', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10'] },
      { name: 'Quận Phú Nhuận', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11'] },
      { name: 'Thủ Đức', wards: ['Phường Linh Trung', 'Phường Linh Xuân', 'Phường Linh Chiểu', 'Phường Linh Đông', 'Phường Linh Tây', 'Phường Trường Thọ', 'Phường Hiệp Bình Chánh', 'Phường Hiệp Bình Phước'] },
    ],
  },
  {
    name: 'Hà Nội',
    districts: [
      { name: 'Quận Ba Đình', wards: ['Phường Cống Vị', 'Phường Điện Biên', 'Phường Đội Cấn', 'Phường Giảng Võ', 'Phường Kim Mã', 'Phường Liễu Giai', 'Phường Ngọc Hà', 'Phường Ngọc Khánh', 'Phường Phúc Xá', 'Phường Quán Thánh'] },
      { name: 'Quận Hoàn Kiếm', wards: ['Phường Chương Dương', 'Phường Cửa Đông', 'Phường Cửa Nam', 'Phường Đồng Xuân', 'Phường Hàng Bạc', 'Phường Hàng Bài', 'Phường Hàng Bồ', 'Phường Hàng Bông', 'Phường Hàng Buồm', 'Phường Hàng Đào'] },
      { name: 'Quận Đống Đa', wards: ['Phường Cát Linh', 'Phường Hàng Bột', 'Phường Khâm Thiên', 'Phường Khương Thượng', 'Phường Kim Liên', 'Phường Láng Hạ', 'Phường Láng Thượng', 'Phường Nam Đồng', 'Phường Ngã Tư Sở'] },
      { name: 'Quận Cầu Giấy', wards: ['Phường Dịch Vọng', 'Phường Dịch Vọng Hậu', 'Phường Mai Dịch', 'Phường Nghĩa Đô', 'Phường Nghĩa Tân', 'Phường Quan Hoa', 'Phường Trung Hòa', 'Phường Yên Hòa'] },
      { name: 'Quận Thanh Xuân', wards: ['Phường Hạ Đình', 'Phường Khương Đình', 'Phường Khương Mai', 'Phường Khương Trung', 'Phường Kim Giang', 'Phường Nhân Chính', 'Phường Phương Liệt', 'Phường Thanh Xuân Bắc'] },
    ],
  },
  {
    name: 'Đà Nẵng',
    districts: [
      { name: 'Quận Hải Châu', wards: ['Phường Bình Hiên', 'Phường Bình Thuận', 'Phường Hải Châu I', 'Phường Hải Châu II', 'Phường Hòa Cường Bắc', 'Phường Hòa Cường Nam', 'Phường Hòa Thuận Đông', 'Phường Hòa Thuận Tây'] },
      { name: 'Quận Thanh Khê', wards: ['Phường An Khê', 'Phường Chính Gián', 'Phường Hòa Khê', 'Phường Tam Thuận', 'Phường Tân Chính', 'Phường Thanh Khê Đông', 'Phường Thanh Khê Tây'] },
      { name: 'Quận Sơn Trà', wards: ['Phường An Hải Bắc', 'Phường An Hải Đông', 'Phường An Hải Tây', 'Phường Mân Thái', 'Phường Nại Hiên Đông', 'Phường Phước Mỹ'] },
    ],
  },
  {
    name: 'Nghệ An',
    districts: [
      { name: 'TP. Vinh', wards: ['Phường Bến Thủy', 'Phường Cửa Nam', 'Phường Đội Cung', 'Phường Đông Vĩnh', 'Phường Hà Huy Tập', 'Phường Hồng Sơn', 'Phường Hưng Bình', 'Phường Hưng Dũng', 'Phường Lê Lợi', 'Phường Quang Trung'] },
      { name: 'Huyện Nghĩa Đàn', wards: ['Xã Nghĩa An', 'Xã Nghĩa Bình', 'Xã Nghĩa Đức', 'Xã Nghĩa Hồng', 'Xã Nghĩa Khánh', 'Xã Nghĩa Lạc', 'Xã Nghĩa Lâm', 'Xã Nghĩa Liên', 'Xã Nghĩa Long', 'Thị trấn Nghĩa Đàn'] },
      { name: 'Huyện Quỳnh Lưu', wards: ['Xã Quỳnh Bá', 'Xã Quỳnh Bảng', 'Xã Quỳnh Châu', 'Xã Quỳnh Diện', 'Xã Quỳnh Đôi', 'Xã Quỳnh Giang', 'Xã Quỳnh Hậu', 'Xã Quỳnh Hoa', 'Thị trấn Cầu Giát'] },
      { name: 'Huyện Diễn Châu', wards: ['Xã Diễn An', 'Xã Diễn Hải', 'Xã Diễn Hoa', 'Xã Diễn Hoàng', 'Xã Diễn Hồng', 'Xã Diễn Lâm', 'Xã Diễn Ngọc', 'Xã Diễn Phong', 'Thị trấn Diễn Châu'] },
    ],
  },
  {
    name: 'Gia Lai',
    districts: [
      { name: 'TP. Pleiku', wards: ['Phường Chi Lăng', 'Phường Diên Hồng', 'Phường Đống Đa', 'Phường Hoa Lư', 'Phường Hội Phú', 'Phường Hội Thương', 'Phường Ia Kring', 'Phường Tây Sơn', 'Phường Thắng Lợi', 'Phường Yên Đỗ'] },
      { name: 'Thị xã An Khê', wards: ['Phường An Bình', 'Phường An Phú', 'Phường An Tân', 'Phường Ngô Mây', 'Phường Tây Sơn', 'Xã Cửu An', 'Xã Song An', 'Xã Thành An'] },
      { name: 'Huyện Đăk Đoa', wards: ['Xã Glar', 'Xã Hà Bầu', 'Xã Hà Đông', 'Xã Hải Yang', 'Xã Ia Băng', 'Xã Kdang', 'Xã Nam Yang', 'Xã Trang', 'Thị trấn Đăk Đoa'] },
    ],
  },
  {
    name: 'Đắk Lắk',
    districts: [
      { name: 'TP. Buôn Ma Thuột', wards: ['Phường Ea Tam', 'Phường Khánh Xuân', 'Phường Tân An', 'Phường Tân Hòa', 'Phường Tân Lập', 'Phường Tân Lợi', 'Phường Tân Thành', 'Phường Thắng Lợi', 'Phường Thành Nhất'] },
    ],
  },
  {
    name: 'Bình Dương',
    districts: [
      { name: 'TP. Thủ Dầu Một', wards: ['Phường Chánh Mỹ', 'Phường Chánh Nghĩa', 'Phường Định Hòa', 'Phường Hiệp An', 'Phường Hiệp Thành', 'Phường Phú Cường', 'Phường Phú Hòa', 'Phường Phú Lợi'] },
      { name: 'TP. Dĩ An', wards: ['Phường An Bình', 'Phường Bình An', 'Phường Bình Thắng', 'Phường Dĩ An', 'Phường Đông Hòa', 'Phường Tân Bình', 'Phường Tân Đông Hiệp'] },
      { name: 'TP. Thuận An', wards: ['Phường An Phú', 'Phường An Sơn', 'Phường Bình Chuẩn', 'Phường Bình Hòa', 'Phường Hưng Định', 'Phường Lái Thiêu', 'Phường Thuận Giao', 'Phường Vĩnh Phú'] },
    ],
  },
  {
    name: 'Cần Thơ',
    districts: [
      { name: 'Quận Ninh Kiều', wards: ['Phường An Bình', 'Phường An Hòa', 'Phường An Khánh', 'Phường An Nghiệp', 'Phường Cái Khế', 'Phường Hưng Lợi', 'Phường Tân An', 'Phường Xuân Khánh'] },
      { name: 'Quận Bình Thủy', wards: ['Phường An Thới', 'Phường Bình Thủy', 'Phường Bùi Hữu Nghĩa', 'Phường Long Hòa', 'Phường Long Tuyền', 'Phường Trà An'] },
    ],
  },
];

// SĐT Việt Nam: bắt đầu bằng 0, đủ 10 số
const PHONE_REGEX = /^0[0-9]{9}$/;

// Chặn phím không phải số khi gõ (giữ Backspace, Delete, mũi tên, Tab...)
const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
    'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End',
  ];
  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
};

// Lọc ký tự không phải số (phòng trường hợp dán/paste), giới hạn 10 ký tự
const sanitizePhoneValue = (value: string) => value.replace(/\D/g, '').slice(0, 10);

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [addressForm] = Form.useForm();

  const fetchProfile = async () => {
    try {
      if (user) {
        const response = await axiosClient.get(`/users/${user.id}`);
        setProfile(response.data);
        setAvatarUrl(response.data.avatar || '');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [user]);

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const cancelEdit = () => { setEditingField(null); setEditValue(''); };

  // Input onChange dùng chung cho field đang edit; tự lọc số nếu là field phone
  const handleEditValueChange = (field: string, value: string) => {
    if (field === 'phone') {
      setEditValue(sanitizePhoneValue(value));
    } else {
      setEditValue(value);
    }
  };

  const saveField = async (field: string) => {
    if (field === 'name' && !editValue.trim()) { message.warning('Họ tên không được để trống'); return; }
    if (field === 'email' && !editValue.trim()) { message.warning('Email không được để trống'); return; }
    if (field === 'phone') {
      if (!editValue.trim()) { message.warning('Số điện thoại không được để trống'); return; }
      if (!PHONE_REGEX.test(editValue.trim())) {
        message.warning('Số điện thoại phải gồm 10 số và bắt đầu bằng 0!');
        return;
      }
    }
    setSaving(true);
    try {
      await axiosClient.put(`/users/${user?.id}`, { [field]: editValue });
      message.success('Cập nhật thành công!');
      setEditingField(null); setEditValue('');
      fetchProfile();
      if (field === 'name' || field === 'email') {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          userData[field] = editValue;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally { setSaving(false); }
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axiosClient.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newUrl = response.data.url;
      await axiosClient.put(`/users/${user?.id}`, { avatar: newUrl });
      setAvatarUrl(newUrl);
      message.success('Cập nhật ảnh đại diện thành công!');
      fetchProfile();
    } catch { message.error('Tải ảnh thất bại'); }
    return false;
  };

  const openAddressModal = () => {
    const parts = (profile?.address || '').split(', ').map((s) => s.trim());
    const city = parts.length > 3 ? parts[3] : '';
    const district = parts.length > 3 ? parts[2] : '';
    setSelectedCity(city); setSelectedDistrict(district);
    addressForm.setFieldsValue({
      receiverName: profile?.name || '', receiverPhone: profile?.phone || '',
      street: parts[0] || '', ward: parts.length > 3 ? parts[1] : '',
      district, city,
    });
    setAddressModalOpen(true);
  };

  const saveAddress = async (values: {
    receiverName?: string; receiverPhone?: string;
    street: string; ward: string; district: string; city: string;
  }) => {
    const fullAddress = [values.street, values.ward, values.district, values.city].filter(Boolean).join(', ');
    setSaving(true);
    try {
      await axiosClient.put(`/users/${user?.id}`, {
        address: fullAddress, name: values.receiverName, phone: values.receiverPhone,
      });
      if (values.receiverName) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          userData.name = values.receiverName;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
      message.success('Cập nhật địa chỉ thành công!');
      setAddressModalOpen(false);
      fetchProfile();
    } catch { message.error('Cập nhật địa chỉ thất bại'); }
    finally { setSaving(false); }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Đăng xuất',
      content: 'Bạn có chắc muốn đăng xuất?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => { logout(); navigate('/'); },
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (!profile) return null;

  const infoFields = [
    { key: 'name', icon: <UserOutlined />, iconColor: '#4caf50', iconBg: '#e8f5e9', label: 'Họ và tên', value: profile.name, editable: true },
    { key: 'email', icon: <MailOutlined />, iconColor: '#2196f3', iconBg: '#e3f2fd', label: 'Email', value: profile.email, editable: false, verified: true },
    { key: 'phone', icon: <PhoneOutlined />, iconColor: '#ff9800', iconBg: '#fff3e0', label: 'Số điện thoại', value: profile.phone, editable: true },
  ];

  const utilityItems = [
    { icon: <ShoppingOutlined />, label: 'Đơn hàng của tôi', color: '#4caf50', bg: '#e8f5e9', onClick: () => navigate('/orders') },
    { icon: <MessageOutlined />, label: 'Chat tư vấn', color: '#2196f3', bg: '#e3f2fd', badge: 'AI', onClick: () => navigate('/chat') },
    { icon: <ScanOutlined />, label: 'Nhận diện trái cây', color: '#9c27b0', bg: '#f3e5f5', badge: 'AI', onClick: () => navigate('/fruit-recognition') },
  ];

  const otherItems = [
    { icon: <SafetyCertificateOutlined />, label: 'Chính sách bảo mật', color: '#009688', bg: '#e0f2f1', onClick: () => navigate('/privacy-policy') },
    { icon: <FileTextOutlined />, label: 'Điều khoản sử dụng', color: '#607d8b', bg: '#eceff1', onClick: () => navigate('/terms') },
    { icon: <QuestionCircleOutlined />, label: 'Trung tâm hỗ trợ', color: '#ff9800', bg: '#fff3e0', onClick: () => navigate('/support') },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      {/* ── HEADER CARD ── */}
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #eee', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        {/* Gradient Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a7a3c 0%, #2ecc71 100%)',
          padding: '40px 0 50px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Deco bubbles */}
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: -60, right: -40 }} />
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: 40, left: -30 }} />
          <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: 10, right: 80 }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', marginBottom: 6 }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
                border: '3px solid rgba(255,255,255,0.4)', background: '#e8e8e8',
              }}>
                {avatarUrl ? (
                  <img src={getImageUrl(avatarUrl)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', fontSize: 40 }}>👤</div>
                )}
              </div>
              <Upload showUploadList={false} beforeUpload={(file) => { handleAvatarUpload(file); return false; }} accept="image/*">
                <div style={{
                  position: 'absolute', bottom: 0, right: -2, width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a7a3c, #2ecc71)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  border: '2.5px solid #fff', fontSize: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  <CameraOutlined />
                </div>
              </Upload>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Nhấn vào ảnh để thay đổi</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{profile.name}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>{profile.email}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <StarOutlined style={{ color: '#f5a623', fontSize: 12 }} />
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Thành viên</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── THÔNG TIN CÁ NHÂN ── */}
      <SectionHeader title="Thông tin cá nhân" />
      <div style={cardStyle}>
        {infoFields.map((field, i) => (
          <div key={field.key}>
            <div style={rowStyle}>
              <div style={{ ...iconBoxStyle, background: field.iconBg }}>
                <span style={{ color: field.iconColor, fontSize: 16 }}>{field.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={labelStyle}>{field.label}</div>
                {editingField === field.key ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Input
                      value={editValue}
                      onChange={(e) => handleEditValueChange(field.key, e.target.value)}
                      onKeyDown={field.key === 'phone' ? handlePhoneKeyDown : undefined}
                      inputMode={field.key === 'phone' ? 'numeric' : undefined}
                      maxLength={field.key === 'phone' ? 10 : undefined}
                      autoFocus onPressEnter={() => saveField(field.key)}
                      style={{ flex: 1, borderRadius: 8, borderColor: '#2ecc71' }} />
                    <Button type="primary" icon={<CheckOutlined />} size="small" loading={saving}
                      onClick={() => saveField(field.key)}
                      style={{ background: '#2ecc71', borderColor: '#2ecc71', borderRadius: 8 }} />
                    <Button icon={<CloseOutlined />} size="small" onClick={cancelEdit} style={{ borderRadius: 8 }} />
                  </div>
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 600, color: field.value ? '#333' : '#ccc', fontStyle: field.value ? 'normal' : 'italic' }}>
                    {field.value || 'Chưa cập nhật'}
                  </div>
                )}
              </div>
              {field.verified && (
                <div style={{ width: 28, height: 28, borderRadius: 14, background: '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckOutlined style={{ color: '#4caf50', fontSize: 12 }} />
                </div>
              )}
              {field.editable && editingField !== field.key && (
                <button onClick={() => startEdit(field.key, field.value || '')} style={editBtnStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2ecc71'; e.currentTarget.style.color = '#2ecc71'; e.currentTarget.style.background = '#f0fff4'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.color = '#bbb'; e.currentTarget.style.background = '#f8f8f8'; }}>
                  <EditOutlined />
                </button>
              )}
            </div>
            {i < infoFields.length && <div style={dividerStyle} />}
          </div>
        ))}

        {/* Địa chỉ */}
        <div style={{ ...rowStyle, cursor: 'pointer' }} onClick={openAddressModal}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fafffe')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
          <div style={{ ...iconBoxStyle, background: '#fce4ec' }}>
            <EnvironmentOutlined style={{ color: '#e91e63', fontSize: 16 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={labelStyle}>Địa chỉ giao hàng</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: profile.address ? '#333' : '#ccc', fontStyle: profile.address ? 'normal' : 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.address || 'Chưa cập nhật địa chỉ'}
            </div>
          </div>
          <div style={editBtnStyle}><RightOutlined /></div>
        </div>
        <div style={dividerStyle} />

        {/* Ngày tham gia */}
        <div style={rowStyle}>
          <div style={{ ...iconBoxStyle, background: '#e8f5e9' }}>
            <CalendarOutlined style={{ color: '#4caf50', fontSize: 16 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Ngày tham gia</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>
              {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </div>

      {/* ── TIỆN ÍCH ── */}
      <SectionHeader title="Tiện ích" />
      <div style={cardStyle}>
        {utilityItems.map((item, i) => (
          <div key={i}>
            <div style={{ ...rowStyle, cursor: 'pointer', transition: 'background 0.15s' }} onClick={item.onClick}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ ...iconBoxStyle, background: item.bg }}>
                <span style={{ color: item.color, fontSize: 18 }}>{item.icon}</span>
              </div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#444' }}>{item.label}</div>
              {item.badge && (
                <div style={{ background: '#f3e5f5', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#9c27b0', marginRight: 4 }}>
                  {item.badge}
                </div>
              )}
              <RightOutlined style={{ color: '#ddd', fontSize: 12 }} />
            </div>
            {i < utilityItems.length - 1 && <div style={dividerStyle} />}
          </div>
        ))}
      </div>

      {/* ── KHÁC ── */}
      <SectionHeader title="Khác" />
      <div style={cardStyle}>
        {otherItems.map((item, i) => (
          <div key={i}>
            <div style={{ ...rowStyle, cursor: 'pointer', transition: 'background 0.15s' }} onClick={item.onClick}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ ...iconBoxStyle, background: item.bg }}>
                <span style={{ color: item.color, fontSize: 18 }}>{item.icon}</span>
              </div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#444' }}>{item.label}</div>
              <RightOutlined style={{ color: '#ddd', fontSize: 12 }} />
            </div>
            {i < otherItems.length - 1 && <div style={dividerStyle} />}
          </div>
        ))}
      </div>

      {/* ── ĐĂNG XUẤT ── */}
      <div onClick={handleLogout} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        margin: '24px 0 0', padding: '14px 0', borderRadius: 14,
        border: '1.5px solid #ffccc7', background: '#fff', cursor: 'pointer',
        transition: 'all 0.2s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#fff1f0'; e.currentTarget.style.borderColor = '#ff7875'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#ffccc7'; }}>
        <LogoutOutlined style={{ color: '#e04949', fontSize: 16 }} />
        <span style={{ color: '#e04949', fontSize: 15, fontWeight: 700 }}>Đăng xuất</span>
      </div>

      <div style={{ textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 16 }}>Halona Fruits v1.0.0</div>

      {/* ── ADDRESS MODAL ── */}
      <Modal title={null} open={addressModalOpen} onCancel={() => setAddressModalOpen(false)}
        footer={null} width={520} centered destroyOnClose>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#e04949' }}>Cập nhật địa chỉ</div>
          <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Dùng thông tin trước để giao hàng nhanh hơn</div>
        </div>
        <Form form={addressForm} layout="vertical" onFinish={saveAddress}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item name="receiverName" label={<span style={{ fontSize: 13, color: '#888' }}>Họ và tên</span>} style={{ flex: 1 }}>
              <Input size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              name="receiverPhone"
              label={<span style={{ fontSize: 13, color: '#888' }}>Số điện thoại</span>}
              style={{ flex: 1 }}
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: PHONE_REGEX, message: 'SĐT phải gồm 10 số, bắt đầu bằng 0!' },
              ]}
              normalize={(value: string) => sanitizePhoneValue(value || '')}
            >
              <Input
                size="large"
                style={{ borderRadius: 8 }}
                inputMode="numeric"
                maxLength={10}
                placeholder="VD: 0912345678"
                onKeyDown={handlePhoneKeyDown}
              />
            </Form.Item>
          </div>

          {/* Tỉnh/TP + Quận/Huyện ở 1 dòng; Phường/Xã xuống dòng riêng để không bị tràn ra ngoài modal,
              vì tên Phường/Xã thường dài hơn (ví dụ "Phường Hiệp Bình Chánh") */}
          <div style={{ display: 'flex', gap: 10 }}>
            <Form.Item name="city" label={<span style={{ fontSize: 13, color: '#888' }}>Tỉnh/TP</span>} style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn tỉnh/TP' }]}>
              <Select placeholder="Chọn Tỉnh/TP" size="large" showSearch optionFilterProp="children"
                onChange={(value: string) => { setSelectedCity(value); setSelectedDistrict(''); addressForm.setFieldsValue({ district: undefined, ward: undefined }); }}>
                {vietnamData.map((p) => <Select.Option key={p.name} value={p.name}>{p.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="district" label={<span style={{ fontSize: 13, color: '#888' }}>Quận/Huyện</span>} style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn quận/huyện' }]}>
              <Select placeholder="Chọn Quận/Huyện" size="large" showSearch optionFilterProp="children"
                onChange={(value: string) => { setSelectedDistrict(value); addressForm.setFieldsValue({ ward: undefined }); }}>
                {(vietnamData.find((p) => p.name === selectedCity)?.districts || []).map((d) => <Select.Option key={d.name} value={d.name}>{d.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="ward" label={<span style={{ fontSize: 13, color: '#888' }}>Phường/Xã</span>} rules={[{ required: true, message: 'Chọn phường/xã' }]}>
            <Select placeholder="Chọn Phường/Xã" size="large" showSearch optionFilterProp="children">
              {(vietnamData.find((p) => p.name === selectedCity)?.districts.find((d) => d.name === selectedDistrict)?.wards || []).map((w) => <Select.Option key={w} value={w}>{w}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="street" label={<span style={{ fontSize: 13, color: '#888' }}>Địa chỉ cụ thể</span>} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể!' }]}>
            <Input.TextArea rows={2} placeholder="Số nhà, tên đường, tòa nhà..." style={{ borderRadius: 8, resize: 'none' }} />
          </Form.Item>
          <Form.Item noStyle dependencies={['street', 'ward', 'district', 'city']}>
            {({ getFieldsValue }) => {
              const vals = getFieldsValue();
              const addr = [vals.street, vals.ward, vals.district, vals.city].filter(Boolean).join(', ');
              return (
                <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 16, border: '1px solid #e8e8e8' }}>
                  <iframe src={`https://www.google.com/maps?q=${encodeURIComponent(addr || 'Vietnam')}&output=embed`}
                    width="100%" height="160" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" />
                </div>
              );
            }}
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: '#e04949', cursor: 'pointer' }} />
            <span style={{ fontSize: 14, color: '#e04949', fontWeight: 500 }}>Đặt làm địa chỉ mặc định</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button size="large" onClick={() => setAddressModalOpen(false)}
              style={{ borderRadius: 8, height: 46, width: 110, fontWeight: 600 }}>Trở lại</Button>
            <Button type="primary" htmlType="submit" size="large" loading={saving}
              style={{ background: '#e04949', borderColor: '#e04949', borderRadius: 8, height: 46, width: 140, fontWeight: 700, fontSize: 15 }}>
              Hoàn thành
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

// ── Components & Styles ──

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 10px', paddingLeft: 4 }}>
      <div style={{ width: 4, height: 18, borderRadius: 2, background: '#2ecc71' }} />
      <span style={{ fontSize: 16, fontWeight: 800, color: '#333' }}>{title}</span>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, overflow: 'hidden',
  border: '1px solid #f0f0f0', boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
};

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
  transition: 'background 0.15s', borderRadius: 0,
};

const iconBoxStyle: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 12, display: 'flex',
  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, color: '#aaa', marginBottom: 3,
};

const dividerStyle: React.CSSProperties = {
  height: 1, background: '#f5f5f5', marginLeft: 74,
};

const editBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 10, border: '1.5px solid #eee',
  background: '#f8f8f8', color: '#bbb', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 13, flexShrink: 0, transition: 'all 0.2s',
};