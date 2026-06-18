import { useState, useRef } from 'react';
import { Button, message, Spin } from 'antd';
import {
  CameraOutlined, UploadOutlined, DeleteOutlined,
  CheckCircleFilled, CloseCircleFilled, ReloadOutlined,
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import '../styles/FruitRecognitionPage.css';

interface TopResult {
  name_vi: string;
  name_en: string;
  confidence: number;
}

interface PredictResult {
  success: boolean;
  fruit: string | null;
  fruit_en: string | null;
  confidence: number;
  is_fruit: boolean;
  message: string;
  top3: TopResult[];
}

const FRUIT_EMOJI: Record<string, string> = {
  'Táo': '🍎',
  'Bơ': '🥑',
  'Chuối': '🍌',
  'Mâm xôi đen': '🫐',
  'Dưa lưới': '🍈',
  'Khế': '⭐',
  'Mãng cầu': '🍈',
  'Cherry': '🍒',
  'Dừa': '🥥',
  'Sầu riêng': '🥭',
  'Nho': '🍇',
  'Ổi': '🍐',
  'Kiwi': '🥝',
  'Vải': '🍒',
  'Xoài': '🥭',
  'Măng cụt': '🟣',
  'Cam': '🍊',
  'Đu đủ': '🫒',
  'Lê': '🍐',
  'Dứa': '🍍',
  'Mận': '🍑',
  'Lựu': '🔴',
  'Mâm xôi': '🍓',
  'Dâu tây': '🍓',
  'Dưa hấu': '🍉',
};

export default function FruitRecognitionPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file ảnh');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error('Ảnh quá lớn, tối đa 10MB');
      return;
    }
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handlePredict = async () => {
    if (!imageFile) { message.warning('Vui lòng chọn ảnh trước'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const { data } = await axiosClient.post('/image-recognition/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch {
      message.error('Không thể nhận diện. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setImageFile(null);
    setResult(null);
  };

  const emoji = result?.fruit ? (FRUIT_EMOJI[result.fruit] || '🍎') : '🍎';

  return (
    <div className="fr-container">
      {/* Header */}
      <div className="fr-header">
        <div className="fr-header-circle-1" />
        <div className="fr-header-circle-2" />
        <div className="fr-header-inner">
          <div className="fr-header-top">
            <div className="fr-header-icon">🔍</div>
            <div>
              <div className="fr-header-title">Nhận diện trái cây</div>
              <div className="fr-header-subtitle">AI-Powered Fruit Recognition</div>
            </div>
            <div className="fr-header-badge">
              <span className="fr-header-badge-text">🧠 AI</span>
            </div>
          </div>
          <div className="fr-header-desc">
            Tải lên ảnh trái cây — AI sẽ phân tích và nhận diện loại trái cây cùng độ chính xác
          </div>
        </div>
      </div>

      <div className={`fr-grid${result ? ' fr-has-result' : ''}`}>
        {/* Left: Upload */}
        <div>
          {/* Drop zone */}
          <div
            className={`fr-dropzone${!imageUrl ? ' fr-clickable' : ''}${dragOver ? ' fr-dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={!imageUrl ? handleUploadClick : undefined}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Preview" className="fr-preview-img" />
                <div className="fr-corner fr-corner-tl" />
                <div className="fr-corner fr-corner-tr" />
                <div className="fr-corner fr-corner-bl" />
                <div className="fr-corner fr-corner-br" />
                {loading && (
                  <div className="fr-loading-overlay">
                    <Spin size="large" />
                    <span className="fr-loading-text">Đang phân tích...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="fr-empty">
                <div className="fr-empty-icon">
                  <CameraOutlined style={{ fontSize: 32, color: '#ccc' }} />
                </div>
                <div className="fr-empty-text">
                  <div className="fr-empty-title">Kéo thả ảnh vào đây</div>
                  <div className="fr-empty-hint">hoặc nhấn để chọn file</div>
                </div>
                <div className="fr-format-tags">
                  {['JPG', 'PNG', 'WEBP'].map((f) => (
                    <span key={f} className="fr-format-tag">{f}</span>
                  ))}
                  <span className="fr-format-tag fr-format-tag-light">Max 10MB</span>
                </div>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="fr-hidden-input" />

          {/* Action buttons */}
          <div className="fr-actions">
            {imageUrl ? (
              <>
                <Button size="large" icon={<UploadOutlined />} onClick={handleUploadClick} className="fr-btn-outline">
                  Chọn ảnh khác
                </Button>
                <Button size="large" icon={<DeleteOutlined />} onClick={handleReset} className="fr-btn-delete">
                  Xóa
                </Button>
                <Button type="primary" size="large" onClick={handlePredict} loading={loading} disabled={loading} className="fr-btn-predict">
                  {loading ? 'Đang nhận diện...' : '🔍 Nhận diện'}
                </Button>
              </>
            ) : (
              <Button type="primary" size="large" icon={<UploadOutlined />} onClick={handleUploadClick} className="fr-btn-choose">
                Chọn ảnh trái cây
              </Button>
            )}
          </div>
        </div>

        {/* Right: Result */}
        {result && (
          <div className="fr-result">
            {result.is_fruit ? (
              <>
                {/* Main result card */}
                <div className="fr-result-card">
                  {/* Top section */}
                  <div className="fr-result-top">
                    <span className="fr-result-emoji">{emoji}</span>
                    <div className="fr-result-info">
                      <div className="fr-result-name">{result.fruit}</div>
                      <div className="fr-result-name-en">{result.fruit_en}</div>
                    </div>
                    <div className="fr-result-score">
                      <span className="fr-result-score-num">{result.confidence.toFixed(0)}</span>
                      <span className="fr-result-score-pct">%</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="fr-status-row">
                    <div className="fr-status-item">
                      <CheckCircleFilled style={{ color: '#2ecc71', fontSize: 14 }} />
                      <span className="fr-status-text">Nhận diện thành công</span>
                    </div>
                    <div className="fr-status-item">
                      <CheckCircleFilled style={{ color: '#2ecc71', fontSize: 14 }} />
                      <span className="fr-status-text">Độ chính xác cao</span>
                    </div>
                  </div>

                  <div className="fr-divider" />

                  {/* Top 3 */}
                  <div className="fr-top3">
                    <div className="fr-top3-title">Kết quả khác có thể</div>
                    {result.top3.slice(1).map((item, i) => {
                      const e = FRUIT_EMOJI[item.name_vi] || '🍎';
                      return (
                        <div key={i} className="fr-top3-item">
                          <span className="fr-top3-emoji">{e}</span>
                          <span className="fr-top3-name">{item.name_vi}</span>
                          <div className="fr-top3-bar">
                            <div
                              className="fr-top3-bar-fill"
                              style={{ width: `${Math.max(item.confidence, 2)}%` }}
                            />
                          </div>
                          <span className="fr-top3-pct">{item.confidence.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Retry button */}
                <Button size="large" icon={<ReloadOutlined />} onClick={handleReset} className="fr-btn-retry">
                  Nhận diện ảnh khác
                </Button>
              </>
            ) : (
              /* Not found */
              <div className="fr-notfound">
                <div className="fr-notfound-icon">
                  <CloseCircleFilled style={{ fontSize: 40, color: '#ff4d4f' }} />
                </div>
                <div className="fr-notfound-title">Không nhận diện được</div>
                <div className="fr-notfound-msg">{result.message}</div>
                <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={handleReset} className="fr-btn-notfound">
                  Thử lại
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}