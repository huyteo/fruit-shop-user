import { useState, useRef } from 'react';
import { Button, message, Spin } from 'antd';
import {
  CameraOutlined, UploadOutlined, DeleteOutlined,
  CheckCircleFilled, CloseCircleFilled, ReloadOutlined,
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

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
  'Táo': '🍎', 'Chuối': '🍌', 'Nho': '🍇', 'Kiwi': '🥝',
  'Xoài': '🥭', 'Cam': '🍊', 'Đu đủ': '🫒', 'Lê': '🍐',
  'Dứa': '🍍', 'Lựu': '🫐', 'Dưa hấu': '🍉',
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 40px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a7a3c 0%, #2ecc71 100%)',
        borderRadius: 20, padding: '36px 40px', marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -50, right: -30 }} />
        <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -20, left: 40 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>🔍</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Nhận diện trái cây</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>AI-Powered Fruit Recognition</div>
            </div>
            <div style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.15)',
              padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>🧠 AI</span>
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', maxWidth: 500, lineHeight: 1.6 }}>
            Tải lên ảnh trái cây — AI sẽ phân tích và nhận diện loại trái cây cùng độ chính xác
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24 }}>
        {/* Left: Upload */}
        <div>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={!imageUrl ? handleUploadClick : undefined}
            style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              border: dragOver ? '2.5px dashed #2ecc71' : '2px dashed #e0e0e0',
              height: 360, position: 'relative', cursor: !imageUrl ? 'pointer' : 'default',
              transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              ...(dragOver ? { background: '#f0fff4' } : {}),
            }}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                {/* Corner decorations */}
                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                  <div key={pos} style={{
                    position: 'absolute', width: 28, height: 28, zIndex: 2,
                    ...(pos.includes('top') ? { top: 12 } : { bottom: 12 }),
                    ...(pos.includes('left') ? { left: 12 } : { right: 12 }),
                    ...(pos.includes('top') && pos.includes('left') ? { borderTop: '3px solid #2ecc71', borderLeft: '3px solid #2ecc71', borderTopLeftRadius: 8 } : {}),
                    ...(pos.includes('top') && pos.includes('right') ? { borderTop: '3px solid #2ecc71', borderRight: '3px solid #2ecc71', borderTopRightRadius: 8 } : {}),
                    ...(pos.includes('bottom') && pos.includes('left') ? { borderBottom: '3px solid #2ecc71', borderLeft: '3px solid #2ecc71', borderBottomLeftRadius: 8 } : {}),
                    ...(pos.includes('bottom') && pos.includes('right') ? { borderBottom: '3px solid #2ecc71', borderRight: '3px solid #2ecc71', borderBottomRightRadius: 8 } : {}),
                  }} />
                ))}
                {loading && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                  }}>
                    <Spin size="large" />
                    <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>Đang phân tích...</span>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', border: '2px dashed #ddd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CameraOutlined style={{ fontSize: 32, color: '#ccc' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#999' }}>Kéo thả ảnh vào đây</div>
                  <div style={{ fontSize: 13, color: '#bbb', marginTop: 4 }}>hoặc nhấn để chọn file</div>
                </div>
                <div style={{
                  display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8,
                }}>
                  {['JPG', 'PNG', 'WEBP'].map((f) => (
                    <span key={f} style={{
                      padding: '3px 10px', borderRadius: 6, background: '#f5f5f5',
                      fontSize: 11, color: '#999', fontWeight: 600,
                    }}>{f}</span>
                  ))}
                  <span style={{ padding: '3px 10px', borderRadius: 6, background: '#f5f5f5', fontSize: 11, color: '#999' }}>Max 10MB</span>
                </div>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {imageUrl ? (
              <>
                <Button size="large" icon={<UploadOutlined />} onClick={handleUploadClick}
                  style={{ flex: 1, borderRadius: 12, height: 48, fontWeight: 600, borderColor: '#2ecc71', color: '#2ecc71' }}>
                  Chọn ảnh khác
                </Button>
                <Button size="large" icon={<DeleteOutlined />} onClick={handleReset}
                  style={{ borderRadius: 12, height: 48, fontWeight: 600 }}>
                  Xóa
                </Button>
                <Button type="primary" size="large" onClick={handlePredict} loading={loading}
                  disabled={loading}
                  style={{
                    flex: 2, borderRadius: 12, height: 48, fontWeight: 700, fontSize: 16,
                    background: 'linear-gradient(135deg, #1a7a3c, #2ecc71)', border: 'none',
                  }}>
                  {loading ? 'Đang nhận diện...' : '🔍 Nhận diện'}
                </Button>
              </>
            ) : (
              <Button type="primary" size="large" icon={<UploadOutlined />} onClick={handleUploadClick}
                style={{
                  flex: 1, borderRadius: 12, height: 48, fontWeight: 700, fontSize: 16,
                  background: 'linear-gradient(135deg, #1a7a3c, #2ecc71)', border: 'none',
                }}>
                Chọn ảnh trái cây
              </Button>
            )}
          </div>
        </div>

        {/* Right: Result */}
        {result && (
          <div style={{ animation: 'fadeInRight 0.4s ease' }}>
            {result.is_fruit ? (
              <>
                {/* Main result card */}
                <div style={{
                  background: '#fff', borderRadius: 20, overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
                }}>
                  {/* Top section */}
                  <div style={{
                    background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
                    padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <span style={{ fontSize: 56 }}>{emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{result.fruit}</div>
                      <div style={{ fontSize: 14, color: '#888', fontStyle: 'italic', marginTop: 2 }}>{result.fruit_en}</div>
                    </div>
                    <div style={{
                      width: 68, height: 68, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1a7a3c, #2ecc71)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(46,204,113,0.3)',
                    }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{result.confidence.toFixed(0)}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>%</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ padding: '16px 24px', display: 'flex', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircleFilled style={{ color: '#2ecc71', fontSize: 14 }} />
                      <span style={{ fontSize: 13, color: '#666' }}>Nhận diện thành công</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircleFilled style={{ color: '#2ecc71', fontSize: 14 }} />
                      <span style={{ fontSize: 13, color: '#666' }}>Độ chính xác cao</span>
                    </div>
                  </div>

                  <div style={{ height: 1, background: '#f5f5f5', margin: '0 24px' }} />

                  {/* Top 3 */}
                  <div style={{ padding: '16px 24px 24px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 14 }}>Kết quả khác có thể</div>
                    {result.top3.slice(1).map((item, i) => {
                      const e = FRUIT_EMOJI[item.name_vi] || '🍎';
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <span style={{ fontSize: 22 }}>{e}</span>
                          <span style={{ width: 80, fontSize: 14, fontWeight: 500, color: '#555' }}>{item.name_vi}</span>
                          <div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 4,
                              background: 'linear-gradient(90deg, #1a7a3c, #2ecc71)',
                              width: `${Math.max(item.confidence, 2)}%`,
                              transition: 'width 0.5s ease',
                            }} />
                          </div>
                          <span style={{ width: 50, fontSize: 13, fontWeight: 600, color: '#888', textAlign: 'right' }}>
                            {item.confidence.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Retry button */}
                <Button size="large" icon={<ReloadOutlined />} onClick={handleReset}
                  style={{ width: '100%', marginTop: 16, borderRadius: 12, height: 48, fontWeight: 600, borderColor: '#2ecc71', color: '#2ecc71' }}>
                  Nhận diện ảnh khác
                </Button>
              </>
            ) : (
              /* Not found */
              <div style={{
                background: '#fff', borderRadius: 20, padding: '48px 32px',
                textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: '#fff2f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  <CloseCircleFilled style={{ fontSize: 40, color: '#ff4d4f' }} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 8 }}>Không nhận diện được</div>
                <div style={{ fontSize: 14, color: '#999', lineHeight: 1.6, marginBottom: 24 }}>{result.message}</div>
                <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={handleReset}
                  style={{ borderRadius: 12, height: 48, fontWeight: 700, background: '#2ecc71', borderColor: '#2ecc71' }}>
                  Thử lại
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}