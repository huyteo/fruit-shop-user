import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Spin, message as antdMessage, Image, Modal } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  PictureOutlined,
  MessageFilled,
  DownOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/image';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/useAuth';
import '../styles/ChatWidget.css';

const { TextArea } = Input;

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  createdAt?: string;
}

// Câu hỏi gợi ý nhanh (giống các nút xanh trong hình tawk.to)
const quickQuestions = [
  'Shop có những loại trái cây nào?',
  'Trái cây nào đang giảm giá?',
  'Tư vấn trái cây tốt cho sức khỏe',
];

export default function ChatWidget() {
  const location = useLocation();
  const hideOn = ['/login', '/register'];
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chỉ tải lịch sử lần đầu khi mở widget
  useEffect(() => {
    if (open && !historyLoaded) {
      loadHistory();
      setHistoryLoaded(true);
    }
  }, [open, historyLoaded]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  const loadHistory = async () => {
    try {
      const res = await axiosClient.get('/chat/history');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendText = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/chat/message', { message: text });
      const aiMsg: Message = {
        role: 'assistant',
        content: res.data.aiResponse,
        id: Date.now() + 1,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      antdMessage.error('AI Server không phản hồi');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => sendText(input);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAndSendImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadAndSendImage = async (file: File) => {
    const tempId = Date.now();
    const previewUrl = URL.createObjectURL(file);

    const userMsg: Message = {
      role: 'user',
      content: '📷 Đang tải ảnh lên...',
      image: previewUrl,
      id: tempId,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axiosClient.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadRes.data.url;
      const fullImageUrl = getImageUrl(imageUrl);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, image: fullImageUrl, content: '📷 Đã gửi ảnh' }
            : msg,
        ),
      );

      const res = await axiosClient.post('/chat/message', {
        message: 'Tôi gửi ảnh này, bạn có thể xem và tư vấn cho tôi không?',
        imageUrl: imageUrl,
      });

      const aiMsg: Message = {
        role: 'assistant',
        content: res.data.aiResponse,
        id: Date.now() + 1,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      URL.revokeObjectURL(previewUrl);
    } catch (err) {
      console.error('Upload error:', err);
      antdMessage.error('Không thể gửi ảnh');
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      const errorMsg: Message = {
        role: 'assistant',
        content: '⚠️ Xin lỗi, không thể gửi ảnh. Vui lòng thử lại.',
        id: Date.now() + 1,
      };
      setMessages((prev) => [...prev, errorMsg]);
      URL.revokeObjectURL(previewUrl);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleChat = () => {
    if (!open && !isAuthenticated) {
      Modal.confirm({
        title: 'Bạn cần đăng nhập',
        content: 'Vui lòng đăng nhập để sử dụng chat tư vấn.',
        okText: 'Đăng nhập',
        cancelText: 'Để sau',
        okButtonProps: { style: { background: '#00a63e', borderColor: '#00a63e' } },
        onOk: () => navigate('/login'),
      });
      return;
    }
    setOpen((v) => !v);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (hideOn.includes(location.pathname)) return null;

  return (
    <>
      {/* ── KHUNG CHAT POPUP (khi mở) ── */}
      {open && (
        <div className="cw-widget">
          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-left">
              <div className="cw-header-avatar">
                <RobotOutlined className="cw-header-avatar-icon" />
              </div>
              <div>
                <div className="cw-header-title">Halona Assistant 🍒</div>
                <div className="cw-header-subtitle">
                  <span className="cw-online-dot" /> Đang hoạt động
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="cw-header-close"
              title="Đóng"
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Vùng tin nhắn */}
          <div className="cw-messages">
            {messages.length === 0 ? (
              <div>
                <div className="cw-welcome-row">
                  <div className="cw-ai-icon">
                    <RobotOutlined />
                  </div>
                  <div className="cw-bubble cw-bubble--ai">
                    👋 Xin chào! Mình là trợ lý ảo của Halona Fruits. Bạn cần
                    tư vấn gì về trái cây ạ?
                  </div>
                </div>
                {/* Câu hỏi gợi ý */}
                <div className="cw-quick-wrap">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      className="cw-quick-btn"
                      onClick={() => sendText(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="cw-msg-row"
                  style={{
                    justifyContent:
                      msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div className="cw-ai-icon">
                      <RobotOutlined />
                    </div>
                  )}
                  <div
                    className="cw-msg-content"
                    style={{
                      alignItems:
                        msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.image && (
                      <Image src={msg.image} alt="Uploaded" className="cw-msg-img" />
                    )}
                    {msg.content && (
                      <div
                        className={`cw-bubble ${
                          msg.role === 'user' ? 'cw-bubble--user' : 'cw-bubble--ai'
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="cw-user-icon">
                      <UserOutlined />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="cw-loading-row">
                <Spin size="small" />
                <span className="cw-loading-text">Đang trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập */}
          <div className="cw-input-bar">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
            <Button
              icon={<PictureOutlined />}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="cw-image-btn"
              title="Gửi ảnh"
            />
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              onKeyDown={handleKeyPress}
              className="cw-textarea"
            />
            <Button
              type="primary"
              icon={<SendOutlined style={{ color: '#fff' }} />}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="cw-send-btn"
            />
          </div>
        </div>
      )}

      {/* ── NÚT TRÒN: đóng thì mở chat, mở thì thu lại (đổi icon) ── */}
      <button
        onClick={handleToggleChat}
        className="cw-fab"
        aria-label={open ? 'Thu nhỏ chat' : 'Mở chat tư vấn'}
      >
        {open ? (
          <DownOutlined className="cw-fab-icon--down" />
        ) : (
          <>
            <MessageFilled className="cw-fab-icon" />
            <span className="cw-fab-ping" />
          </>
        )}
      </button>
    </>
  );
}