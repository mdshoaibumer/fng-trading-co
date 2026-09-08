'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Flame, RotateCcw, ArrowRightLeft, Disc3, Cpu, ScanLine, LayoutGrid, Settings, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useWhatsappNumber } from '@/hooks/useWhatsappNumber';
import LoadingState from '@/components/ui/LoadingState';
import Reveal from '@/components/ui/Reveal';
import ErrorState from '@/components/ui/ErrorState';

interface Part { nameEn:string; nameAr:string; models:string; }

const CATEGORY_KEYS = ['fuser','pickup','transfer','drum','formatter','scanner','trays','maintenance'] as const;
const ICONS: Record<string,React.ReactNode> = {
  fuser:<Flame size={22} color="var(--accent)" strokeWidth={1.5}/>,pickup:<RotateCcw size={22} color="var(--accent)" strokeWidth={1.5}/>,
  transfer:<ArrowRightLeft size={22} color="var(--accent)" strokeWidth={1.5}/>,drum:<Disc3 size={22} color="var(--accent)" strokeWidth={1.5}/>,
  formatter:<Cpu size={22} color="var(--accent)" strokeWidth={1.5}/>,scanner:<ScanLine size={22} color="var(--accent)" strokeWidth={1.5}/>,
  trays:<LayoutGrid size={22} color="var(--accent)" strokeWidth={1.5}/>,maintenance:<Settings size={22} color="var(--accent)" strokeWidth={1.5}/>,
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

  const whatsapp = useWhatsappNumber();

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
  }, []);

  return (
    <section style={{padding:'clamp(60px,10vw,120px) 0',background:'linear-gradient(180deg,#FFFFFF 0%,#F4F7F2 100%)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'-10%',left:isAr?'auto':'-5%',right:isAr?'-5%':'auto',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(141,184,51,0.04) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'}}/>
      <div className="container">
        <Reveal as="div" style={{textAlign:'center',marginBottom:'clamp(40px,6vw,72px)'}}>
          <span style={{display:'inline-block',color:'var(--accent-text)',background:'rgba(141,184,51,0.1)',padding:'8px 20px',borderRadius:'var(--radius-2xl)',fontSize:'0.85rem',fontWeight:700,textTransform:'uppercase',letterSpacing:isAr?'0':'1px',marginBottom:'16px',border:'1px solid rgba(141,184,51,0.2)'}}>
            {isAr?'كتالوج القطع':'Parts Catalog'}
          </span>
          <h2 style={{fontSize:'clamp(1.5rem,4vw,3rem)',fontWeight:800,color:'var(--primary)',marginBottom:'16px',fontFamily:isAr?'var(--font-ibm-plex-arabic), sans-serif':'var(--font-inter), sans-serif'}}>
            {isAr?'٨ فئات — ٣٠+ قطعة غيار':'8 Categories — 30+ Parts'}
          </h2>
          <p style={{fontSize:'clamp(0.9rem,2vw,1.1rem)',color:'var(--text-secondary)',maxWidth:'600px',margin:'0 auto',lineHeight:1.6}}>
            {isAr?'اختر الفئة لعرض قطع الغيار المتوفرة مع موديلات الطابعات المتوافقة.':'Select a category to view available parts with compatible printer models.'}
          </p>
        </Reveal>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            title={isAr ? 'تعذر تحميل كتالوج القطع' : 'Couldn’t load the parts catalog'}
            description={isAr ? 'حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى.' : 'Something went wrong loading this data. Please try again.'}
            retryLabel={isAr ? 'إعادة المحاولة' : 'Retry'}
            onRetry={retryLoadParts}
          />
        ) : (
          <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'12px'}}>
            {CATEGORY_KEYS.map(key=>{
              const isOpen = expanded===key;
              const categoryParts = parts[key]||[];
            return (
              <Reveal key={key} delay={CATEGORY_KEYS.indexOf(key) * 60} distance={16}>
              <div style={{background:isOpen?'#FFFFFF':'#FAFBF9',border:`1px solid ${isOpen?'rgba(141,184,51,0.3)':'#F3F4F6'}`,borderRadius:'var(--radius-lg)',overflow:'hidden',transition:'all 300ms var(--ease-ink)',boxShadow:isOpen?'0 12px 32px rgba(0,0,0,0.06)':'0 2px 4px rgba(0,0,0,0.02)'}}>
                <button onClick={()=>setExpanded(p=>p===key?null:key)} style={{width:'100%',display:'flex',alignItems:'center',gap:'16px',padding:'clamp(16px,3vw,24px) clamp(16px,3vw,28px)',background:'none',border:'none',cursor:'pointer',textAlign:isAr?'right':'left',flexDirection:isAr?'row-reverse':'row'}}>
                  <div style={{width:'48px',height:'48px',borderRadius:'14px',background:isOpen?'rgba(141,184,51,0.15)':'rgba(141,184,51,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`1px solid ${isOpen?'rgba(141,184,51,0.3)':'rgba(141,184,51,0.1)'}`}}>
                    {ICONS[key]}
                  </div>
                  <div style={{flex:1}}>
                    <h3 style={{color:'var(--primary)',fontSize:'clamp(1rem,2.5vw,1.2rem)',fontWeight:700,marginBottom:'2px',fontFamily:isAr?'var(--font-ibm-plex-arabic), sans-serif':'var(--font-inter), sans-serif'}}>{t(`categories.${key}.name`)}</h3>
                    <p style={{color:'#777',fontSize:'0.8rem',lineHeight:1.4}}>{t(`categories.${key}.desc`)}</p>
                  </div>
                  <div style={{width:'32px',height:'32px',borderRadius:'var(--radius-sm)',background:'rgba(141,184,51,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'transform 200ms ease',transform:isOpen?'rotate(180deg)':'rotate(0)'}}>
                    {isOpen?<ChevronUp size={18} color="var(--accent)"/>:<ChevronDown size={18} color="var(--accent)"/>}
                  </div>
                </button>
                {/* grid-rows trick: animates to the content's real height (no
                    magic max-height cap, no reflow proportional to an unused
                    range) instead of transitioning max-height. */}
                <div style={{display:'grid',gridTemplateRows:isOpen?'1fr':'0fr',transition:'grid-template-rows 400ms var(--ease-ink)'}}>
                  <div style={{overflow:'hidden',minHeight:0,padding:'0 clamp(16px,3vw,28px) clamp(16px,3vw,24px)',display:'flex',flexDirection:'column',gap:'8px'}}>
                    {categoryParts.length===0 && (
                      <p style={{color:'#999',fontSize:'0.85rem',textAlign:isAr?'right':'left',padding:'8px 0'}}>{t('noPartsYet')}</p>
                    )}
                    {categoryParts.map((p,i)=>(
                      <div key={i} className="part-row" style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 16px',borderRadius:'var(--radius-md)',background:i%2===0?'#F9FAFB':'#FFFFFF',border:'1px solid #F3F4F6',transition:'all 200ms ease',flexDirection:isAr?'row-reverse':'row',flexWrap:'wrap'}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(141,184,51,0.3)';e.currentTarget.style.background='rgba(141,184,51,0.04)';}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor='#F3F4F6';e.currentTarget.style.background=i%2===0?'#F9FAFB':'#FFFFFF';}}>
                        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--accent)',flexShrink:0}}/>
                        <div style={{flex:1,textAlign:isAr?'right':'left',minWidth:'120px'}}>
                          <span style={{color:'var(--primary)',fontWeight:600,fontSize:'0.9rem',fontFamily:isAr?'var(--font-ibm-plex-arabic), sans-serif':'var(--font-inter), sans-serif'}}>{isAr?p.nameAr:p.nameEn}</span>
                        </div>
                        <span style={{color:'#666',fontSize:'0.75rem',background:'rgba(141,184,51,0.08)',padding:'3px 10px',borderRadius:'6px',fontFamily:'var(--font-inter), sans-serif',flexShrink:0}}>{p.models}</span>
                        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(isAr?`مرحباً، أريد الاستفسار عن: ${p.nameAr}`:`Hello, I'd like to inquire about: ${p.nameEn}`)}`} target="_blank" rel="noopener noreferrer"
                          style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:'40px',padding:'8px 16px',borderRadius:'var(--radius-sm)',background:'var(--accent)',color:'var(--deep-forest)',fontSize:'0.75rem',fontWeight:700,textDecoration:'none',flexShrink:0,transition:'all 200ms ease',whiteSpace:'nowrap'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='#7AA52D';}} onMouseLeave={e=>{e.currentTarget.style.background='var(--accent)';}}>
                          {isAr?'استفسار':'Inquire'}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </Reveal>
            );
          })}
          </div>
        )}

        <div style={{textAlign:'center',marginTop:'clamp(40px,6vw,64px)'}}>
          <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(isAr?'مرحباً، أود الاستفسار عن قطع غيار طابعات HP':'Hello, I would like to inquire about HP printer parts')}`} target="_blank" rel="noopener noreferrer"
            style={{display:'inline-flex',alignItems:'center',gap:'10px',padding:'16px 36px',borderRadius:'var(--radius-lg)',background:'#25D366',color:'#FFFFFF',fontWeight:700,fontSize:'var(--text-base)',textDecoration:'none',transition:'all 200ms var(--ease-spring)',boxShadow:'0 6px 24px rgba(37,211,102,0.3)'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 10px 30px rgba(37,211,102,0.4)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 6px 24px rgba(37,211,102,0.3)';}}>
            <MessageCircle size={20}/> {t('ctaWhatsapp')}
          </a>
        </div>
      </div>
    </section>
  );
}
