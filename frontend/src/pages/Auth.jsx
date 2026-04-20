import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const FauxChart = () => (
  <div className="w-full mt-4 mb-2">
    <div className="h-[120px] w-full relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(22, 163, 74, 0.4)" />
            <stop offset="100%" stopColor="rgba(22, 163, 74, 0.0)" />
          </linearGradient>
        </defs>
        {/* 8 Data points (Oct - May) */}
        <path 
          d="M0 100 L 57 80 L 114 85 L 171 60 L 228 45 L 285 55 L 342 20 L 400 30" 
          fill="none" 
          stroke="#16a34a" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M0 100 L 57 80 L 114 85 L 171 60 L 228 45 L 285 55 L 342 20 L 400 30 L 400 120 L 0 120 Z" 
          fill="url(#area-gradient)" 
          opacity="1" 
        />
      </svg>
    </div>
    {/* X-axis labels */}
    <div className="w-full flex justify-between text-[0.65rem] text-[rgba(255,255,255,0.4)] mt-2 font-dmsans font-medium uppercase px-1">
      <span>Oct</span>
      <span>Nov</span>
      <span>Dec</span>
      <span>Jan</span>
      <span>Feb</span>
      <span>Mar</span>
      <span>Apr</span>
      <span>May</span>
    </div>
  </div>
);

const Auth = ({ mode = 'signIn' }) => {
  // Appearance exact requirements
  const clerkAppearance = {
    variables: {
      colorBackground: 'transparent',
      colorInputBackground: '#0f1f10',
      colorInputText: '#ffffff',
      colorTextSecondary: 'rgba(255,255,255,0.45)',
      colorText: '#ffffff',
      colorPrimary: '#16a34a',
      colorDanger: '#ef4444',
      borderRadius: '8px',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: '14px',
    },
    elements: {
      card: { background:'transparent', boxShadow:'none', border:'none', padding:0, width:'100%' },
      headerTitle: { display:'none' },
      headerSubtitle: { display:'none' },
      header: { display:'none' },
      footer: { display:'none' },
      footerAction: { display:'none' },
      formFieldInput: { border:'1px solid rgba(255,255,255,0.12)', background:'#0f1f10', color:'white', fontSize:'0.88rem', padding:'0.65rem 0.9rem', borderRadius:'8px' },
      formFieldLabel: { color:'rgba(255,255,255,0.55)', fontSize:'0.78rem', marginBottom:'0.3rem' },
      formButtonPrimary: { background:'#16a34a', fontSize:'0.85rem', fontWeight:'600', letterSpacing:'0.04em', padding:'0.7rem', borderRadius:'8px', boxShadow:'none' },
      socialButtonsBlockButton: { background:'#0f1f10', border:'1px solid rgba(255,255,255,0.12)', color:'white', borderRadius:'8px' },
      dividerLine: { background:'rgba(255,255,255,0.08)' },
      dividerText: { color:'rgba(255,255,255,0.3)', fontSize:'0.78rem' },
      identityPreviewEditButton: { color:'#4ade80' },
      rootBox: { width:'100%' },
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700&display=swap');
        
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dmsans { font-family: 'DM Sans', sans-serif; }

        .auth-root {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: row;
          overflow: hidden;
        }

        .auth-left {
          width: 58%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2.5rem;
          padding: 3rem;
          background: linear-gradient(135deg, rgba(5,20,8,0.95) 0%, rgba(5,20,8,0.75) 50%, rgba(5,20,8,0.92) 100%),
                      url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=80') center/cover no-repeat;
        }

        .auth-right {
          width: 42%;
          min-width: 420px;
          height: 100vh;
          background-color: #070f08;
          border-left: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 3rem;
        }
      `}} />

      <div className="auth-root font-dmsans">
        
        {/* LEFT PANEL (58%) */}
        <div className="auth-left">
          
          {/* TOP-LEFT (absolute) */}
          <div className="absolute top-[3rem] left-[3rem] flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#16a34a]">
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12L16 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16L8 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col">
              <span className="font-syne text-[1.2rem] font-bold text-white leading-none tracking-wide">VERDANTIX</span>
              <span className="text-[rgba(255,255,255,0.5)] text-[0.75rem] font-medium mt-1 uppercase tracking-widest">Agri-Carbon Intelligence</span>
            </div>
          </div>

          {/* CENTER: Glassmorphism Dashboard Card */}
          <div 
            className="w-[460px] flex flex-col items-center relative z-10"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '2rem'
            }}
          >
            {/* Header row */}
            <div className="w-full flex justify-between items-center bg-transparent">
              <span className="font-syne text-white text-[1.15rem] font-bold">Carbon Dashboard</span>
              <div className="flex items-center gap-2 px-2 py-1 bg-[rgba(22,163,74,0.15)] rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></div>
                <span className="text-[#16a34a] font-bold text-[0.65rem] tracking-widest uppercase">Live</span>
              </div>
            </div>

            {/* Area Chart */}
            <FauxChart />

            {/* Divider */}
            <div className="w-full h-px bg-[rgba(255,255,255,0.08)] my-5"></div>

            {/* 3-column stat grid */}
            <div className="w-full grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[rgba(255,255,255,0.45)] text-[0.75rem] font-medium uppercase tracking-wider">Credits</span>
                <span className="text-white font-syne font-bold text-[1.1rem]">14.2 VCU</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[rgba(255,255,255,0.45)] text-[0.75rem] font-medium uppercase tracking-wider">Score 84</span>
                <span className="text-white font-syne font-bold text-[1.1rem]">Grade A</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[rgba(255,255,255,0.45)] text-[0.75rem] font-medium uppercase tracking-wider">Est. Value</span>
                <span className="text-white font-syne font-bold text-[1.1rem]">₹24,500</span>
              </div>
            </div>

            {/* Bottom Row Badge */}
            <div className="w-full flex mt-6">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-[rgba(22,163,74,0.15)] border border-[rgba(22,163,74,0.3)] rounded-md">
                <span className="text-[#16a34a] font-bold text-[0.75rem]">↑ +12.4% this season</span>
              </div>
            </div>
          </div>

          {/* BELOW CARD: 3 Pill Badges */}
          <div className="flex gap-4">
            <span 
              className="font-dmsans text-white font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                fontSize: '0.78rem'
              }}
            >
              🔒 Encrypted
            </span>
            <span 
              className="font-dmsans text-white font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                fontSize: '0.78rem'
              }}
            >
              📡 Offline-First
            </span>
            <span 
              className="font-dmsans text-white font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                fontSize: '0.78rem'
              }}
            >
              🌿 22 Languages
            </span>
          </div>

          {/* BOTTOM-LEFT (absolute) */}
          <div 
            className="absolute font-dmsans font-medium"
            style={{
              bottom: '2rem',
              left: '3rem',
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.35)'
            }}
          >
            Trusted by 120,000+ farmers across India
          </div>

        </div>

        {/* RIGHT PANEL (42%) */}
        <div className="auth-right">
          <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
            
            {/* Above Clerk */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ stroke: '#16a34a', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
                <path d="M12 22V12" />
                <path d="M12 12L16 8" />
              </svg>
              <h1 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.75rem', color: 'white', marginTop: '0.75rem', textAlign: 'center' }}>
                {mode === 'signIn' ? 'Sign in' : 'Create account'}
              </h1>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'DM Sans, sans-serif' }}>
                {mode === 'signIn' ? 'Access your farm carbon dashboard' : 'Join the carbon intelligence network'}
              </p>
            </div>

            {/* Clerk Component wrapper */}
            {mode === 'signIn' ? (
              <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" appearance={clerkAppearance} />
            ) : (
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" appearance={clerkAppearance} />
            )}

            {/* Below Clerk */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '1.5rem', paddingTop: '1.2rem', textAlign: 'center' }}>
              {mode === 'signIn' ? (
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                  New here? <Link to="/sign-up" style={{ color: '#4ade80', textDecoration: 'none', marginLeft: '4px' }}>Create free account →</Link>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                  Already have an account? <Link to="/sign-in" style={{ color: '#4ade80', textDecoration: 'none', marginLeft: '4px' }}>Sign in →</Link>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Auth;
