import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Spin, message as antdMessage, Image } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  PictureOutlined,
  MessageFilled,
  DownOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';


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
      const fullImageUrl = `http://192.168.100.31:3000${imageUrl}`;

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
        <div style={styles.widget}>
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={styles.headerAvatar}>
                <RobotOutlined style={{ fontSize: 20, color: '#00a63e' }} />
              </div>
              <div>
                <div style={styles.headerTitle}>Halona Assistant 🍒</div>
                <div style={styles.headerSubtitle}>
                  <span style={styles.onlineDot} /> Đang hoạt động
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={styles.headerClose}
              title="Đóng"
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Vùng tin nhắn */}
          <div style={styles.messages}>
            {messages.length === 0 ? (
              <div>
                <div style={styles.welcomeRow}>
                  <div style={styles.aiIcon}>
                    <RobotOutlined />
                  </div>
                  <div style={styles.aiBubble}>
                    👋 Xin chào! Mình là trợ lý ảo của Halona Fruits. Bạn cần
                    tư vấn gì về trái cây ạ?
                  </div>
                </div>
                {/* Câu hỏi gợi ý */}
                <div style={styles.quickWrap}>
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      style={styles.quickBtn}
                      onClick={() => sendText(q)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#00a63e';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#00a63e';
                      }}
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
                  style={{
                    ...styles.msgRow,
                    justifyContent:
                      msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div style={styles.aiIcon}>
                      <RobotOutlined />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems:
                        msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.image && (
                      <Image
                        src={msg.image}
                        alt="Uploaded"
                        style={{
                          width: 180,
                          height: 'auto',
                          maxHeight: 220,
                          objectFit: 'cover',
                          borderRadius: 12,
                          marginBottom: 6,
                          display: 'block',
                        }}
                      />
                    )}
                    {msg.content && (
                      <div
                        style={{
                          ...styles.bubble,
                          ...(msg.role === 'user'
                            ? styles.userBubble
                            : styles.aiBubble),
                        }}
                      >
                        {msg.content}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div style={styles.userIcon}>
                      <UserOutlined />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div style={styles.loadingRow}>
                <Spin size="small" />
                <span style={{ fontSize: 13, color: '#888' }}>
                  Đang trả lời...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập */}
          <div style={styles.inputBar}>
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
              style={styles.imageBtn}
              title="Gửi ảnh"
            />
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              onKeyDown={handleKeyPress}
              style={{ borderRadius: 18, flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={styles.sendBtn}
            />
          </div>
        </div>
      )}

      {/* ── NÚT TRÒN: đóng thì mở chat, mở thì thu lại (đổi icon) ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={styles.fab}
        aria-label={open ? 'Thu nhỏ chat' : 'Mở chat tư vấn'}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {open ? (
          <DownOutlined style={{ fontSize: 24, color: '#fff' }} />
        ) : (
          <>
            <MessageFilled style={{ fontSize: 28, color: '#fff' }} />
            <span style={styles.fabPing} />
          </>
        )}
      </button>

      <style>{`
        @keyframes fabPing {
          0% { transform: scale(1); opacity: 0.6; }
          70%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes widgetUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  fab: {
    position: 'fixed',
    bottom: 70,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a7a3c, #00a63e)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(0,166,62,0.45)',
    zIndex: 9999,
    transition: 'transform 0.2s',
  },
  fabPing: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: '#00a63e',
    animation: 'fabPing 2s ease-out infinite',
    zIndex: -1,
  },
  // Khung widget
  widget: {
    position: 'fixed',
    bottom: 96,
    right: 24,
    width: 380,
    height: 560,
    maxHeight: 'calc(100vh - 120px)',
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9999,
    animation: 'widgetUp 0.3s ease',
  },
  header: {
    background: 'linear-gradient(135deg, #1a7a3c, #00a63e)',
    color: '#fff',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: { fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.2 },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#7CFC00',
    display: 'inline-block',
  },
  headerClose: {
    background: 'rgba(255,255,255,0.18)',
    border: 'none',
    color: '#fff',
    width: 30,
    height: 30,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 16,
    background: '#f8f9fa',
  },
  welcomeRow: { display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' },
  quickWrap: { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' },
  quickBtn: {
    background: '#fff',
    border: '1.5px solid #00a63e',
    color: '#00a63e',
    padding: '8px 14px',
    borderRadius: 18,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'right',
  },
  msgRow: { display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-start' },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    background: '#fff',
    color: '#00a63e',
    border: '2px solid #00a63e',
    flexShrink: 0,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    background: '#00a63e',
    color: '#fff',
    flexShrink: 0,
  },
  bubble: {
    padding: '10px 14px',
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.55,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  userBubble: { background: '#00a63e', color: '#fff' },
  aiBubble: {
    background: '#fff',
    color: '#333',
    border: '1px solid #e8e8e8',
    padding: '10px 14px',
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.55,
  },
  loadingRow: { display: 'flex', alignItems: 'center', gap: 8, padding: 8 },
  inputBar: {
    display: 'flex',
    gap: 8,
    padding: 12,
    background: '#fff',
    borderTop: '1px solid #eee',
    flexShrink: 0,
  },
  imageBtn: {
    borderRadius: '50%',
    width: 38,
    height: 38,
    flexShrink: 0,
    color: '#00a63e',
    borderColor: '#00a63e',
  },
  sendBtn: {
    borderRadius: '50%',
    width: 38,
    height: 38,
    flexShrink: 0,
    background: 'linear-gradient(135deg, #1a7a3c, #00a63e)',
    border: 'none',
  },
};