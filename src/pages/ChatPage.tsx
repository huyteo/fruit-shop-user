import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Spin, message as antdMessage, Image } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, PictureOutlined } from '@ant-design/icons';
import { getImageUrl } from '../utils/image';
import axiosClient from '../api/axiosClient';
import '../styles/ChatPage.css';

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
      id: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/chat/message', { message: input });
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
      id: tempId,
    };
    setMessages((prev) => [...prev, userMsg]);
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

  return (
    <div className="cp-page">
      <div className="cp-container">
        {/* Header */}
        <div className="cp-header">
          <div className="cp-header-avatar">
            <RobotOutlined />
          </div>
          <div className="cp-header-info">
            <h2 className="cp-header-title">Chat Tư Vấn 🍒</h2>
            <p className="cp-header-subtitle">Halona Fruits Assistant</p>
          </div>
          <div className="cp-header-status">
            <span className="cp-header-status-dot" />
            Online
          </div>
        </div>

        {/* Messages */}
        <div className="cp-messages">
          {messages.length === 0 ? (
            <div className="cp-empty">
              <RobotOutlined className="cp-empty-icon" />
              <p className="cp-empty-text">
                Xin chào! Tôi là trợ lý ảo của Halona Fruits.
                <br />
                Bạn cần tư vấn gì về trái cây ạ?
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`cp-message-row cp-message-row--${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <div className="cp-avatar cp-avatar--assistant">
                    <RobotOutlined />
                  </div>
                )}

                <div className={`cp-message-content cp-message-content--${msg.role}`}>
                  {msg.image && (
                    <Image
                      src={msg.image}
                      alt="Uploaded"
                      className="cp-message-image"
                      preview={{
                        mask: <div className="cp-image-preview-mask">🔍 Xem ảnh</div>,
                      }}
                    />
                  )}
                  {msg.content && (
                    <div className={`cp-bubble cp-bubble--${msg.role}`}>
                      <p className="cp-bubble-text">{msg.content}</p>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="cp-avatar cp-avatar--user">
                    <UserOutlined />
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="cp-loading">
              <Spin size="small" />
              <span className="cp-loading-text">Đang trả lời...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="cp-input-bar">
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
            className="cp-icon-btn"
            title="Gửi ảnh"
          />

          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onKeyDown={handleKeyPress}
            className="cp-textarea"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="cp-send-btn"
          />
        </div>
      </div>
    </div>
  );
}