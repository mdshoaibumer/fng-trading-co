'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Trash2,
  GripVertical,
  Plus,
  X,
  Image as ImageIcon,
  Loader2,
  Link as LinkIcon,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib/fileValidation';

interface MultiImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  productId: string;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function MultiImageUploader({
  images,
  onImagesChange,
  productId,
  showToast,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ total: number; done: number }>({ total: 0, done: 0 });
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isDragOverZone, setIsDragOverZone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter out placeholders
  const activeImages = images.filter((img) => img && img !== '/placeholder.png');

  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Fail oversized / wrong-type files fast, client-side, with a clear reason
    // instead of a round trip the server rejects anyway.
    const rejected: string[] = [];
    const valid = files.filter((f) => {
      if (!ALLOWED_IMAGE_TYPES[f.type]) { rejected.push(`${f.name} (unsupported type)`); return false; }
      if (f.size > MAX_UPLOAD_SIZE) { rejected.push(`${f.name} (over 8MB)`); return false; }
      return true;
    });
    if (rejected.length) showToast(`Skipped ${rejected.length}: ${rejected.join(', ')}`, 'error');
    if (valid.length === 0) return;

    setUploading(true);
    setUploadProgress({ total: valid.length, done: 0 });

    const newUrls: string[] = [];
    let completed = 0;

    for (const file of valid) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (data.success && data.url) {
          newUrls.push(data.url);
        } else {
          showToast(`Failed to upload ${file.name}: ${data.error || 'Unknown error'}`, 'error');
        }
      } catch {
        showToast(`Error uploading ${file.name}`, 'error');
      }
      completed++;
      setUploadProgress({ total: files.length, done: completed });
    }

    if (newUrls.length > 0) {
      const updatedImages = [...activeImages, ...newUrls];
      onImagesChange(updatedImages);
      showToast(
        `Successfully uploaded ${newUrls.length} image${newUrls.length > 1 ? 's' : ''}`,
        'success'
      );
    }

    setUploading(false);
    setUploadProgress({ total: 0, done: 0 });
  }, [activeImages, onImagesChange, showToast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      uploadFiles(files);
      // Reset input so same files can be selected again
      e.target.value = '';
    }
  };

  const handleDropZone = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOverZone(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files).filter((f) =>
          f.type.startsWith('image/')
        );
        if (files.length > 0) {
          uploadFiles(files);
        } else {
          showToast('Only image files are accepted', 'error');
        }
      }
    },
    [uploadFiles, showToast]
  );

  const removeImage = (index: number) => {
    if (!confirm('Remove this image from the product gallery?')) return;
    const newImages = activeImages.filter((_, i) => i !== index);
    onImagesChange(newImages.length > 0 ? newImages : []);
  };

  // Keyboard/touch-accessible reorder, mirroring the regions editor. HTML5
  // drag-and-drop does not fire on touch and is invisible to the keyboard, so
  // these buttons are the only reorder path for tablet and keyboard admins.
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= activeImages.length) return;
    const newImages = [...activeImages];
    const [img] = newImages.splice(from, 1);
    newImages.splice(to, 0, img);
    onImagesChange(newImages);
  };

  const addUrl = () => {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    // next/image only serves *.supabase.co (next.config.ts remotePatterns) or
    // same-origin paths — anything else would render as a broken image on the
    // public site, so refuse it here with a clear message.
    let ok = trimmed.startsWith('/');
    if (!ok) {
      try {
        const u = new URL(trimmed);
        ok = u.protocol === 'https:' && (u.hostname.endsWith('.supabase.co') || (typeof window !== 'undefined' && u.host === window.location.host));
      } catch { ok = false; }
    }
    if (!ok) {
      showToast('Use an https://….supabase.co image URL (or upload the file) — other hosts cannot be displayed.', 'error');
      return;
    }
    onImagesChange([...activeImages, trimmed]);
    setUrlValue('');
    setShowUrlInput(false);
    showToast('Image URL added', 'success');
  };

  // Drag-and-drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...activeImages];
    const [dragged] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, dragged);
    onImagesChange(newImages);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...activeImages];
    const [img] = newImages.splice(index, 1);
    newImages.unshift(img);
    onImagesChange(newImages);
    showToast('Primary image updated', 'success');
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px',
      }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
            Product Images
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748B' }}>
            {activeImages.length} image{activeImages.length !== 1 ? 's' : ''} • Drag to reorder • First image is the primary
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '10px',
              padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600,
              color: '#475569', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <LinkIcon size={14} />
            Add URL
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--admin-accent)', border: 'none', borderRadius: '10px',
              padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700,
              color: '#0F172A', cursor: uploading ? 'wait' : 'pointer',
              opacity: uploading ? 0.7 : 1, transition: 'all 0.2s',
            }}
          >
            {uploading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '16px',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <input
            className="admin-input"
            aria-label="Image URL (must be an https://….supabase.co address)"
            placeholder="https://….supabase.co/image.jpg"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addUrl(); }}
            style={{ flex: 1 }}
          />
          <button
            onClick={addUrl}
            style={{
              background: 'var(--admin-accent)', border: 'none', borderRadius: '10px',
              padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem',
              color: '#0F172A', cursor: 'pointer',
            }}
          >
            Add
          </button>
          <button
            onClick={() => { setShowUrlInput(false); setUrlValue(''); }}
            aria-label="Cancel"
            style={{
              background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '10px',
              padding: '8px 12px', cursor: 'pointer', color: '#64748B',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px',
          background: 'rgba(141, 184, 51, 0.08)', borderRadius: '12px',
          border: '1px solid rgba(141, 184, 51, 0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
              Uploading {uploadProgress.done} of {uploadProgress.total} images...
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-accent)' }}>
              {uploadProgress.total > 0 ? Math.round((uploadProgress.done / uploadProgress.total) * 100) : 0}%
            </span>
          </div>
          <div style={{
            height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: '100%', background: 'linear-gradient(90deg, #8DB833, #6B7C3F)',
              borderRadius: '3px', transformOrigin: 'left', transition: 'transform 0.3s ease',
              transform: `scaleX(${uploadProgress.total > 0 ? uploadProgress.done / uploadProgress.total : 0})`,
            }} />
          </div>
        </div>
      )}

      {/* Image Grid */}
      {activeImages.length > 0 ? (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px', marginBottom: '16px',
        }}>
          {activeImages.map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              style={{
                position: 'relative', borderRadius: '14px', overflow: 'hidden',
                border: dragOverIndex === idx
                  ? '2px dashed #8DB833'
                  : idx === 0
                    ? '2px solid #8DB833'
                    : '1px solid #E2E8F0',
                background: '#FFFFFF',
                opacity: draggedIndex === idx ? 0.5 : 1,
                transition: 'all 0.2s ease',
                cursor: 'grab',
              }}
            >
              {/* Primary Badge */}
              {idx === 0 && (
                <div style={{
                  position: 'absolute', top: '8px', left: '8px', zIndex: 3,
                  background: 'var(--admin-accent)', color: '#0F172A', padding: '3px 10px',
                  borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  Primary
                </div>
              )}

              {/* Drag Handle */}
              <div style={{
                position: 'absolute', top: '8px', right: '8px', zIndex: 3,
                background: 'rgba(255,255,255,0.9)', borderRadius: '6px',
                padding: '4px', display: 'flex', alignItems: 'center',
                cursor: 'grab', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}>
                <GripVertical size={14} color="#94A3B8" />
              </div>

              {/* Image Preview */}
              <div style={{
                width: '100%', aspectRatio: '1', background: '#F8FAFC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Product image ${idx + 1}`}
                  style={{
                    maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;color:#94A3B8;font-size:0.7rem"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Failed to load</div>';
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '4px',
                padding: '8px 10px', borderTop: '1px solid #F1F5F9',
                background: '#FAFAFA',
              }}>
                {/* Keyboard/touch reorder */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  <button
                    onClick={() => moveImage(idx, idx - 1)}
                    disabled={idx === 0}
                    aria-label={`Move image ${idx + 1} earlier`}
                    title="Move earlier"
                    style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: '#64748B', opacity: idx === 0 ? 0.3 : 1, padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    onClick={() => moveImage(idx, idx + 1)}
                    disabled={idx === activeImages.length - 1}
                    aria-label={`Move image ${idx + 1} later`}
                    title="Move later"
                    style={{ background: 'none', border: 'none', cursor: idx === activeImages.length - 1 ? 'not-allowed' : 'pointer', color: '#64748B', opacity: idx === activeImages.length - 1 ? 0.3 : 1, padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
                {idx !== 0 ? (
                  <button
                    onClick={() => setPrimaryImage(idx)}
                    title="Set as primary"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.65rem', fontWeight: 700, color: 'var(--admin-accent)',
                      padding: '2px 6px', borderRadius: '4px',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(141,184,51,0.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    Set Primary
                  </button>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'var(--admin-accent)', fontWeight: 700 }}>
                    ✓ Primary
                  </span>
                )}
                <button
                  onClick={() => removeImage(idx)}
                  title="Remove image"
                  aria-label="Remove image"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#EF4444', padding: '4px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOverZone(true); }}
        onDragLeave={() => setIsDragOverZone(false)}
        onDrop={handleDropZone}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragOverZone ? 'var(--admin-accent)' : '#CBD5E1'}`,
          borderRadius: '16px', padding: '32px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          background: isDragOverZone ? 'rgba(141,184,51,0.05)' : '#FAFBFC',
          cursor: 'pointer', transition: 'all 0.3s ease',
          minHeight: activeImages.length > 0 ? '100px' : '180px',
        }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: isDragOverZone ? 'rgba(141,184,51,0.15)' : '#F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}>
          {isDragOverZone ? (
            <Plus size={24} color="var(--admin-accent)" />
          ) : (
            <ImageIcon size={24} color="#94A3B8" />
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: 0, fontSize: '0.9rem', fontWeight: 700,
            color: isDragOverZone ? 'var(--admin-accent)' : '#475569',
          }}>
            {isDragOverZone ? 'Drop images here' : 'Drag & drop images here'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94A3B8' }}>
            or click to browse • Supports JPG, PNG, WebP • Multiple files allowed
          </p>
        </div>
      </div>

      {/* Hidden File Input - Multiple */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        id={`multi-upload-${productId}`}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
