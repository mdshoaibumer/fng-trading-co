'use client';

import React, { useState, useEffect } from 'react';
import { Save, Video, Phone, Mail, MessageSquare, Lock, Shield, Eye, EyeOff, Bot, Globe, Link, AtSign, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

interface AdminSettings {
  admin_password?: string;
  ai_settings: { welcome_message: string; system_prompt: string };
  social_media: { facebook: string; instagram: string; linkedin: string; twitter: string };
  seo: { title: string; description: string };
  videos?: { divider1?: string; divider2?: string };
  contact?: { whatsapp?: string; phone?: string; email?: string };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Password State
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);

  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          ...data,
          ai_settings: data.ai_settings || { welcome_message: '', system_prompt: '' },
          social_media: data.social_media || { facebook: '', instagram: '', linkedin: '', twitter: '' },
          seo: data.seo || { title: '', description: '' }
        });
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load settings. Check your connection and refresh.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  const calculateStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length > 7) strength += 1;
    if (pwd.match(/[a-z]+/)) strength += 1;
    if (pwd.match(/[A-Z]+/)) strength += 1;
    if (pwd.match(/[0-9]+/)) strength += 1;
    if (pwd.match(/[$@#&!]+/)) strength += 1;
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPasswordInput(val);
    setPwdStrength(calculateStrength(val));
    setSettings((prev) => prev && { ...prev, admin_password: val });
  };

  const handleSave = async () => {
    if (passwordInput && passwordInput !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...settings };
      if (!passwordInput) {
        delete payload.admin_password;
      }
      
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Settings updated successfully!', 'success');
        setPasswordInput('');
        setConfirmPassword('');
        setPwdStrength(0);
      }
    } catch {
      showToast('Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading site settings...</div>;
  if (!settings) return <div>Failed to load settings. Refresh to try again.</div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="settings-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Global Settings</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Manage security, AI integrations, media, and platform configurations.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '32px' }}>
        
        {/* Security & Access - ENHANCED */}
        <div className="admin-card border-l-4 border-[#8DB833]">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#8DB833' }}>
            <Shield size={24} />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Security & Credentials</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Update the master admin password for the FNG panel.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '20px', maxWidth: '500px', backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div>
              <label className="admin-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input" 
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  placeholder="Leave blank to keep current password"
                  value={passwordInput} 
                  onChange={handlePasswordChange} 
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Strength Indicator */}
              {passwordInput.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    {[1, 2, 3, 4].map(level => (
                      <div key={level} style={{ 
                        flex: 1, 
                        backgroundColor: pwdStrength >= level 
                          ? (pwdStrength < 2 ? '#EF4444' : pwdStrength < 4 ? '#EAB308' : '#22C55E') 
                          : '#E2E8F0',
                        transition: 'background-color 0.3s ease'
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Password Strength</span>
                    <span style={{ fontWeight: 600, color: pwdStrength < 2 ? '#EF4444' : pwdStrength < 4 ? '#EAB308' : '#22C55E' }}>
                      {pwdStrength === 0 ? '' : pwdStrength < 2 ? 'Weak' : pwdStrength < 4 ? 'Good' : 'Strong'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="admin-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input" 
                  style={{ 
                    paddingLeft: '44px', 
                    borderColor: passwordInput && confirmPassword && passwordInput !== confirmPassword ? '#EF4444' : 
                                 passwordInput && confirmPassword && passwordInput === confirmPassword ? '#22C55E' : '#E2E8F0' 
                  }}
                  placeholder="Re-type new password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                {passwordInput && confirmPassword && passwordInput === confirmPassword && (
                  <CheckCircle2 size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#22C55E' }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nexia AI Assistant Settings */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#8DB833' }}>
            <Bot size={24} />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Nexia AI Assistant</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Configure the behavior and prompts for the frontend chat widget.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label className="admin-label">Welcome Message</label>
              <input 
                className="admin-input" 
                placeholder="Hi! I am Nexia, your FNG Assistant..."
                value={settings.ai_settings?.welcome_message || ''} 
                onChange={(e) => setSettings({ ...settings, ai_settings: { ...settings.ai_settings, welcome_message: e.target.value } })} 
              />
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '6px' }}>The first message the AI will send when a user opens the chat.</p>
            </div>
            <div>
              <label className="admin-label">System Prompt / Instructions</label>
              <textarea 
                className="admin-input" 
                style={{ minHeight: '120px', resize: 'vertical' }}
                placeholder="You are Nexia, an assistant for FNG..."
                value={settings.ai_settings?.system_prompt || ''} 
                onChange={(e) => setSettings({ ...settings, ai_settings: { ...settings.ai_settings, system_prompt: e.target.value } })} 
              />
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '6px' }}>Instructions on how Nexia should behave, tone of voice, and what it should not say. Takes effect immediately after saving.</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#8DB833' }}>
            <Globe size={24} />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Social Media Links</h2>
            </div>
          </div>
          <div className="responsive-grid">
            <div>
              <label className="admin-label">LinkedIn</label>
              <div style={{ position: 'relative' }}>
                <Link size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  className="admin-input" 
                  style={{ paddingLeft: '44px' }}
                  value={settings.social_media?.linkedin || ''} 
                  onChange={(e) => setSettings({ ...settings, social_media: { ...settings.social_media, linkedin: e.target.value } })} 
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Instagram</label>
              <div style={{ position: 'relative' }}>
                <AtSign size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  className="admin-input" 
                  style={{ paddingLeft: '44px' }}
                  value={settings.social_media?.instagram || ''} 
                  onChange={(e) => setSettings({ ...settings, social_media: { ...settings.social_media, instagram: e.target.value } })} 
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Facebook</label>
              <div style={{ position: 'relative' }}>
                <Link size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  className="admin-input" 
                  style={{ paddingLeft: '44px' }}
                  value={settings.social_media?.facebook || ''} 
                  onChange={(e) => setSettings({ ...settings, social_media: { ...settings.social_media, facebook: e.target.value } })} 
                />
              </div>
            </div>
            <div>
              <label className="admin-label">X / Twitter</label>
              <div style={{ position: 'relative' }}>
                <AtSign size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  className="admin-input" 
                  style={{ paddingLeft: '44px' }}
                  value={settings.social_media?.twitter || ''} 
                  onChange={(e) => setSettings({ ...settings, social_media: { ...settings.social_media, twitter: e.target.value } })} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Video Settings */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#8DB833' }}>
            <Video size={24} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Video Backgrounds</h2>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label className="admin-label">Forest Animation Divider (MP4 URL)</label>
              <input 
                className="admin-input" 
                value={settings.videos?.divider1 || ''} 
                onChange={(e) => setSettings({ ...settings, videos: { ...settings.videos, divider1: e.target.value } })} 
              />
            </div>
            <div>
              <label className="admin-label">Botanical Vortex Divider (MP4 URL)</label>
              <input 
                className="admin-input" 
                value={settings.videos?.divider2 || ''} 
                onChange={(e) => setSettings({ ...settings, videos: { ...settings.videos, divider2: e.target.value } })} 
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#8DB833' }}>
            <Phone size={24} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Contact Information</h2>
          </div>
          <div className="responsive-grid">
            <div>
              <label className="admin-label">WhatsApp Number</label>
              <div style={{ position: 'relative' }}>
                <MessageSquare size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  className="admin-input" 
                  style={{ paddingLeft: '44px' }}
                  value={settings.contact?.whatsapp || ''} 
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: e.target.value } })} 
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  className="admin-input" 
                  style={{ paddingLeft: '44px' }}
                  value={settings.contact?.phone || ''} 
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })} 
                />
              </div>
            </div>
            <div className="full-width">
              <label className="admin-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  className="admin-input" 
                  style={{ paddingLeft: '44px' }}
                  value={settings.contact?.email || ''} 
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 6px;
          margin-left: 4px;
        }
        .settings-header {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .responsive-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .full-width {
          grid-column: span 2;
        }
        @media (max-width: 768px) {
          .settings-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .responsive-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
