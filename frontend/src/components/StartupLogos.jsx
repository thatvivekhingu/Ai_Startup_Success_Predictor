import React from 'react';

// 1. Razorpay Official Brand Logo
export const RazorpayLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-2 select-none ${className}`}>
    <svg className="h-6 w-6 shrink-0" viewBox="0 0 48 48" fill="none">
      <path d="M12 40L24 6L18 22H30L16 42L20 28H12L12 40Z" fill="#0C2340" />
      <path d="M22 6L10 24H20L12 42L36 18H24L32 6H22Z" fill="#0284C7" />
    </svg>
    <span className="font-extrabold text-base tracking-tight text-[#0C2340] font-sans">
      Razor<span className="text-[#0284C7]">pay</span>
    </span>
  </div>
);

// 2. Zerodha Official Brand Logo
export const ZerodhaLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-2 select-none ${className}`}>
    <svg className="h-6 w-6 shrink-0" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#387ED1" />
      <path d="M14 15H34L20 33H34V36H14L28 18H14V15Z" fill="white" />
    </svg>
    <span className="font-black text-base tracking-wider text-[#387ED1] uppercase font-sans">
      ZERODHA
    </span>
  </div>
);

// 3. Zomato Official Brand Logo
export const ZomatoLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-2 select-none ${className}`}>
    <div className="bg-[#E23744] text-white px-2.5 py-1 rounded-lg font-black italic tracking-tighter text-sm font-sans flex items-center shadow-xs">
      zomato
    </div>
  </div>
);

// 4. Zepto Official Brand Logo
export const ZeptoLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-1.5 select-none ${className}`}>
    <div className="bg-[#8B1E63] text-white px-2.5 py-1 rounded-lg font-black tracking-tight text-sm font-sans flex items-center space-x-1 shadow-xs">
      <span>zepto</span>
      <span className="text-[#FFC107] text-xs">⚡</span>
    </div>
  </div>
);

// 5. Lenskart Official Brand Logo
export const LenskartLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-1.5 select-none ${className}`}>
    <svg className="h-6 w-8 shrink-0" viewBox="0 0 60 40" fill="none">
      <circle cx="18" cy="20" r="14" stroke="#000042" strokeWidth="4" fill="none" />
      <circle cx="42" cy="20" r="14" stroke="#00BAC6" strokeWidth="4" fill="none" />
      <line x1="32" y1="20" x2="28" y2="20" stroke="#000042" strokeWidth="4" />
    </svg>
    <span className="font-extrabold text-sm tracking-tight text-[#000042]">
      lenskart
    </span>
  </div>
);

// 6. Postman Official Brand Logo
export const PostmanLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-2 select-none ${className}`}>
    <svg className="h-6 w-6 shrink-0" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#FF6C37" />
      <path d="M8 16L14 10L24 16L14 22L8 16Z" fill="white" />
    </svg>
    <span className="font-black text-sm tracking-tight text-slate-900">
      POSTMAN
    </span>
  </div>
);

// 7. Matter Motor Works (Gujarat EV)
export const MatterEVLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-1.5 select-none ${className}`}>
    <div className="w-6 h-6 rounded-lg bg-slate-950 text-[#10B981] flex items-center justify-center font-black text-xs border border-emerald-500/40">
      M
    </div>
    <span className="font-extrabold text-xs tracking-wider text-slate-950 uppercase">
      MATTER <span className="text-emerald-600 font-bold text-[10px]">EV</span>
    </span>
  </div>
);

// 8. Petpooja (Gujarat SaaS)
export const PetpoojaLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-1.5 select-none ${className}`}>
    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
      P
    </div>
    <span className="font-extrabold text-xs tracking-tight text-slate-900">
      Pet<span className="text-emerald-600">pooja</span>
    </span>
  </div>
);

// 9. Beardo (Gujarat D2C Exit to Marico)
export const BeardoLogo = ({ className = "h-7 w-auto" }) => (
  <div className={`flex items-center space-x-1.5 select-none ${className}`}>
    <div className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xs">
      B
    </div>
    <span className="font-black text-xs tracking-widest text-slate-900 uppercase">
      BEARDO
    </span>
  </div>
);

export default {
  RazorpayLogo,
  ZerodhaLogo,
  ZomatoLogo,
  ZeptoLogo,
  LenskartLogo,
  PostmanLogo,
  MatterEVLogo,
  PetpoojaLogo,
  BeardoLogo
};
