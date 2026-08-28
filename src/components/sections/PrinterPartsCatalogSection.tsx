'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Flame, RotateCcw, ArrowRightLeft, Disc3, Cpu, ScanLine, LayoutGrid, Settings, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

interface Part { nameEn:string; nameAr:string; models:string; }

const CATEGORY_KEYS = ['fuser','pickup','transfer','drum','formatter','scanner','trays','maintenance'] as const;
const ICONS: Record<string,React.ReactNode> = {
  fuser:<Flame size={22} color="#8DB833" strokeWidth={1.5}/>,pickup:<RotateCcw size={22} color="#8DB833" strokeWidth={1.5}/>,
  transfer:<ArrowRightLeft size={22} color="#8DB833" strokeWidth={1.5}/>,drum:<Disc3 size={22} color="#8DB833" strokeWidth={1.5}/>,
  formatter:<Cpu size={22} color="#8DB833" strokeWidth={1.5}/>,scanner:<ScanLine size={22} color="#8DB833" strokeWidth={1.5}/>,
  trays:<LayoutGrid size={22} color="#8DB833" strokeWidth={1.5}/>,maintenance:<Settings size={22} color="#8DB833" strokeWidth={1.5}/>,
};

export default function PrinterPartsCatalogSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const t = useTranslations('printerPartsPage');
  const [expanded, setExpanded] = useState<string|null>('fuser');
  const [parts, setParts] = useState<Record<string, Part[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [whatsapp, setWhatsapp] = useState('966593380390');

  const fetchParts = () => {
    fetch('/api/admin/parts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load parts');
        return res.json();
      })
      .then(data => {
        setParts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  // Used by the Retry button — unlike the initial mount, this needs to
  // reset loading/error state before re-fetching.
  const retryLoadParts = () => {
    setLoading(true);
    setError(false);
    fetchParts();
  };

  useEffect(() => {
    fetchParts();

    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.contact?.whatsapp) {
          setWhatsapp(data.contact.whatsapp.replace(/\s/g, '').replace('+', ''));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{padding:'clamp(60px,10vw,120px) 0',background:'linear-gradient(180deg,#FFFFFF 0%,#F4F7F2 100%)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'-10%',left:isAr?'auto':'-5%',right:isAr?'-5%':'auto',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(141,184,51,0.04) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'}}/>
      <div className="container">
        <div style={{textAlign:'center',marginBottom:'clamp(40px,6vw,72px)'}}>
          <span style={{display:'inline-block',color:'#8DB833',background:'rgba(141,184,51,0.1)',padding:'8px 20px',borderRadius:'20px',fontSize:'0.85rem',fontWeight:700,textTransform:'uppercase',letterSpacing:isAr?'0':'1px',marginBottom:'16px',border:'1px solid rgba(141,184,51,0.2)'}}>
            {isAr?'كتالوج القطع':'Parts Catalog'}
          </span>
          <h2 style={{fontSize:'clamp(1.5rem,4vw,3rem)',fontWeight:800,color:'#1A3D2B',marginBottom:'16px',fontFamily:isAr?'IBM Plex Sans Arabic, sans-serif':'Inter, sans-serif'}}>
            {isAr?'٨ فئات — ٣٠+ قطعة غيار':'8 Categories — 30+ Parts'}
          </h2>
          <p style={{fontSize:'clamp(0.9rem,2vw,1.1rem)',color:'#555',maxWidth:'600px',margin:'0 auto',lineHeight:1.6}}>
            {isAr?'اختر الفئة لعرض قطع الغيار المتوفرة مع موديلات الطابعات المتوافقة.':'Select a category to view available parts with compatible printer models.'}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #8DB833', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center', padding: '32px 24px', background: '#FFF7F5', border: '1px solid #F3D9D3', borderRadius: '16px' }}>
            <p style={{ color: '#8A3B2E', fontWeight: 700, marginBottom: '8px' }}>
              {isAr ? 'تعذر تحميل كتالوج القطع' : 'Couldn’t load the parts catalog'}
            </p>
            <p style={{ color: '#A15C4E', fontSize: '0.9rem', marginBottom: '20px' }}>
              {isAr ? 'حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى.' : 'Something went wrong loading this data. Please try again.'}
            </p>
            <button onClick={retryLoadParts} style={{ padding: '10px 24px', borderRadius: '10px', background: '#8DB833', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : (
          <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'12px'}}>
            {CATEGORY_KEYS.map(key=>{
              const isOpen = expanded===key;
              const categoryParts = parts[key]||[];
            return (
              <div key={key} style={{background:isOpen?'#FFFFFF':'#FAFBF9',border:`1px solid ${isOpen?'rgba(141,184,51,0.3)':'#F3F4F6'}`,borderRadius:'16px',overflow:'hidden',transition:'all 300ms cubic-bezier(0.22,1,0.36,1)',boxShadow:isOpen?'0 12px 32px rgba(0,0,0,0.06)':'0 2px 4px rgba(0,0,0,0.02)'}}>
                <button onClick={()=>setExpanded(p=>p===key?null:key)} style={{width:'100%',display:'flex',alignItems:'center',gap:'16px',padding:'clamp(16px,3vw,24px) clamp(16px,3vw,28px)',background:'none',border:'none',cursor:'pointer',textAlign:isAr?'right':'left',flexDirection:isAr?'row-reverse':'row'}}>
                  <div style={{width:'48px',height:'48px',borderRadius:'14px',background:isOpen?'rgba(141,184,51,0.15)':'rgba(141,184,51,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`1px solid ${isOpen?'rgba(141,184,51,0.3)':'rgba(141,184,51,0.1)'}`}}>
                    {ICONS[key]}
                  </div>
                  <div style={{flex:1}}>
                    <h3 style={{color:'#1A3D2B',fontSize:'clamp(1rem,2.5vw,1.2rem)',fontWeight:700,marginBottom:'2px',fontFamily:isAr?'IBM Plex Sans Arabic, sans-serif':'Inter, sans-serif'}}>{t(`categories.${key}.name`)}</h3>
                    <p style={{color:'#777',fontSize:'0.8rem',lineHeight:1.4}}>{t(`categories.${key}.desc`)}</p>
                  </div>
                  <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(141,184,51,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'transform 200ms ease',transform:isOpen?'rotate(180deg)':'rotate(0)'}}>
                    {isOpen?<ChevronUp size={18} color="#8DB833"/>:<ChevronDown size={18} color="#8DB833"/>}
                  </div>
                </button>
                <div style={{maxHeight:isOpen?'800px':'0',overflow:'hidden',transition:'max-height 400ms cubic-bezier(0.22,1,0.36,1)'}}>
                  <div style={{padding:'0 clamp(16px,3vw,28px) clamp(16px,3vw,24px)',display:'flex',flexDirection:'column',gap:'8px'}}>
                    {categoryParts.map((p,i)=>(
                      <div key={i} className="part-row" style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 16px',borderRadius:'12px',background:i%2===0?'#F9FAFB':'#FFFFFF',border:'1px solid #F3F4F6',transition:'all 200ms ease',flexDirection:isAr?'row-reverse':'row',flexWrap:'wrap'}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(141,184,51,0.3)';e.currentTarget.style.background='rgba(141,184,51,0.04)';}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor='#F3F4F6';e.currentTarget.style.background=i%2===0?'#F9FAFB':'#FFFFFF';}}>
                        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#8DB833',flexShrink:0}}/>
                        <div style={{flex:1,textAlign:isAr?'right':'left',minWidth:'120px'}}>
                          <span style={{color:'#1A3D2B',fontWeight:600,fontSize:'0.9rem',fontFamily:isAr?'IBM Plex Sans Arabic, sans-serif':'Inter, sans-serif'}}>{isAr?p.nameAr:p.nameEn}</span>
                        </div>
                        <span style={{color:'#666',fontSize:'0.75rem',background:'rgba(141,184,51,0.08)',padding:'3px 10px',borderRadius:'6px',fontFamily:'Inter, sans-serif',flexShrink:0}}>{p.models}</span>
                        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(isAr?`مرحباً، أريد الاستفسار عن: ${p.nameAr}`:`Hello, I'd like to inquire about: ${p.nameEn}`)}`} target="_blank" rel="noopener noreferrer"
                          style={{padding:'6px 14px',borderRadius:'8px',background:'#8DB833',color:'#fff',fontSize:'0.75rem',fontWeight:700,textDecoration:'none',flexShrink:0,transition:'all 200ms ease',whiteSpace:'nowrap'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='#7AA52D';}} onMouseLeave={e=>{e.currentTarget.style.background='#8DB833';}}>
                          {isAr?'استفسار':'Inquire'}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        <div style={{textAlign:'center',marginTop:'clamp(40px,6vw,64px)'}}>
          <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(isAr?'مرحباً، أود الاستفسار عن قطع غيار طابعات HP':'Hello, I would like to inquire about HP printer parts')}`} target="_blank" rel="noopener noreferrer"
            style={{display:'inline-flex',alignItems:'center',gap:'10px',padding:'16px 36px',borderRadius:'16px',background:'#25D366',color:'#FFFFFF',fontWeight:700,fontSize:'1rem',textDecoration:'none',transition:'all 200ms cubic-bezier(0.34,1.56,0.64,1)',boxShadow:'0 6px 24px rgba(37,211,102,0.3)'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 10px 30px rgba(37,211,102,0.4)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 6px 24px rgba(37,211,102,0.3)';}}>
            <MessageCircle size={20}/> {t('ctaWhatsapp')}
          </a>
        </div>
      </div>
    </section>
  );
}
