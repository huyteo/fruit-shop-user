import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Spin, message as antdMessage, Image } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, PictureOutlined } from '@ant-design/icons';
import { getImageUrl } from '../utils/image';
import axiosClient from '../api/axiosClient';

const { TextArea } = Input;

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  createdAt?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await axiosClient.get('/chat/history');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      antdMessage.error('Không thể tải lịch sử chat');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { 
      role: 'user', 
      content: input, 
      id: Date.now() 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/chat/message', { message: input });
      const aiMsg: Message = {
        role: 'assistant',
        content: res.data.aiResponse,
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      antdMessage.error('AI Server không phản hồi');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAndSendImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadAndSendImage = async (file: File) => {
    const tempId = Date.now();
    const previewUrl = URL.createObjectURL(file);
    
    const userMsg: Message = {
      role: 'user',
      content: '📷 Đang tải ảnh lên...',
      image: previewUrl,
      id: tempId
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axiosClient.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = uploadRes.data.url;
      const fullImageUrl = getImageUrl(imageUrl);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempId
            ? { ...msg, image: fullImageUrl, content: '📷 Đã gửi ảnh' }
            : msg
        )
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
      setMessages(prev => [...prev, aiMsg]);

      URL.revokeObjectURL(previewUrl);
    } catch (err) {
      console.error('Upload error:', err);
      antdMessage.error('Không thể gửi ảnh');
      
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      const errorMsg: Message = {
        role: 'assistant',
        content: '⚠️ Xin lỗi, không thể gửi ảnh. Vui lòng thử lại.',
        id: Date.now() + 1,
      };
      setMessages(prev => [...prev, errorMsg]);
      
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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Chat Tư Vấn 🍒</h2>
          <p style={styles.headerSubtitle}>Halona Fruits Assistant</p>
        </div>

        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <RobotOutlined style={styles.emptyIcon} />
              <p style={styles.emptyText}>
                Xin chào! Tôi là trợ lý ảo của Halona Fruits. 
                <br />
                Bạn cần tư vấn gì về trái cây ạ?
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={styles.aiIconWrapper}>
                    <RobotOutlined />
                  </div>
                )}
                
                {/* ✅ SỬA: Wrapper với flexDirection và alignItems */}
                <div style={{ 
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  {msg.image && (
                    <Image
                      src={msg.image}
                      alt="Uploaded"
                      style={{
                        width: '240px',
                        height: 'auto',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                      preview={{
                        mask: (
                          <div style={{ 
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontSize: '14px',
                          }}>
                            🔍 Xem ảnh
                          </div>
                        ),
                      }}
                    />
                  )}
                  {msg.content && (
                    <div 
                      style={{
                        ...styles.messageBubble,
                        ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble)
                      }}
                    >
                      <p style={styles.messageText}>{msg.content}</p>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div style={styles.userIconWrapper}>
                    <UserOutlined />
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div style={styles.loadingWrapper}>
              <Spin size="small" />
              <span style={styles.loadingText}>Đang trả lời...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
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
            style={styles.imageButton}
            title="Gửi ảnh"
          />

          <TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onKeyDown={handleKeyPress}
            style={styles.textarea}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={styles.sendButton}
          />
        </div>
      </div>
    </div>
  );
}

// ✅ Styles
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: 'calc(100vh - 140px)',
    padding: '24px',
    background: '#f8f9fa',
  },
  chatContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    height: 'calc(100vh - 200px)',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #1a7a3c, #2ecc71)',
    color: 'white',
    padding: '24px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    margin: '4px 0 0',
    opacity: 0.9,
    fontSize: '14px',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    background: '#f8f9fa',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: '#2ecc71',
  },
  emptyText: {
    fontSize: '15px',
    lineHeight: '1.6',
    margin: 0,
  },
  messageWrapper: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'flex-start',
  },
  aiIconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    background: 'white',
    color: '#2ecc71',
    border: '2px solid #2ecc71',
    flexShrink: 0,
  },
  userIconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    background: '#2ecc71',
    color: 'white',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '16px',
  },
  userBubble: {
    background: '#2ecc71',
    color: 'white',
  },
  aiBubble: {
    background: 'white',
    color: '#333',
    border: '1px solid #e0e0e0',
  },
  messageText: {
    margin: 0,
    lineHeight: '1.6',
    fontSize: '15px',
  },
  // ✅ THÊM: Styles cho ảnh
  messageImage: {
    width: '240px',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  messageImageUser: {
    alignSelf: 'flex-end',
  },
  messageImageAI: {
    alignSelf: 'flex-start',
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    color: '#666',
  },
  loadingText: {
    fontSize: '14px',
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: 'white',
    borderTop: '1px solid #e0e0e0',
  },
  textarea: {
    borderRadius: '20px',
    flex: 1,
  },
  // ✅ THÊM: Image button
  imageButton: {
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#2ecc71',
    borderColor: '#2ecc71',
  },
  sendButton: {
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    flexShrink: 0,
    background: 'linear-gradient(135deg, #1a7a3c, #2ecc71)',
    border: 'none',
  },
};