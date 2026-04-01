// src/assets/dummyStyles.js
import { FaStar, FaQuoteLeft, FaCar, FaRoad, FaKey, FaMapMarkerAlt } from 'react-icons/fa';

// src/assets/dummyStyles.js
// ... existing navbar styles ...

export const heroStyles = {
  container: "relative w-full lg:min-h-screen h-[600px]  bg-black overflow-hidden flex items-center justify-center",
  background: "absolute lg:pt-30 pt-45 inset-0 transform-gpu will-change-transform",
  gradientOverlay: "absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/20",
  svgContainer: "absolute inset-0 w-full h-full pointer-events-none z-40",
  ctaContainer: "relative z-10 pt-99 lg:pt-0 max-w-xl md:pt-110 w-[98%] sm:w-[62%] lg:w-[46%] mx-auto px-4",
  ctaCard: "relative rounded-2xl p-6 bg-[rgba(255,255,255,0.04)] border border-white/6 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4",
  subtitle: "text-xs uppercase tracking-widest text-sky-300/70",
  title: "text-white md:text-sm text-lg sm:text-2xl font-semibold mt-1",
  description: "mt-1 text-sm text-slate-300/70",
  ctaButton: "metal-btn inline-flex items-center gap-3 px-5 py-3 rounded-lg font-medium transform-gpu hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 cursor-pointer",
  buttonText: "text-sm",
  outline: "absolute -inset-1 rounded-2xl pointer-events-none ring-1 ring-white/6"
};

// src/assets/dummyStyles.js
// ... existing styles ...

export const homeCarsStyles = {
  specIconContainer: (isHovered) => `p-2.5 rounded-xl mb-1.5 transition-all ${isHovered ? 'bg-gradient-to-r from-purple-500/10 to-teal-500/10' : 'bg-gray-800'}`,
  specIcon: (isHovered) => `w-4 h-4 ${isHovered ? 'text-purple-400' : 'text-gray-500'}`,
  placeholder: "bg-black border-2 border-gray-700 border-dashed rounded-xl w-full h-full flex items-center justify-center text-sky-500",
  cardPatterns: [
    'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-gray-900/30 to-purple-900/20',
    'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-gray-900/30 to-amber-900/20',
    'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/20 via-gray-900/30 to-rose-900/20',
    'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-900/30 to-sky-900/20',
    'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-gray-900/30 to-emerald-900/20',
    'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900/30 to-amber-900/20'
  ],
  borderGradients: [
    'border-sky-500/30',
    'border-emerald-500/30',
    'border-violet-500/30',
    'border-amber-500/30',
    'border-rose-500/30',
    'border-cyan-500/30'
  ],
  cardShapes: [
    'clip-path: polygon(0% 15%, 15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%);',
    'clip-path: polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 15% 100%, 0% 85%);',
    'clip-path: polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%);',
    'clip-path: polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 0% 100%, 15% 85%);',
    'clip-path: polygon(0% 15%, 15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%);',
    'clip-path: polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 15% 100%, 0% 85%);'
  ]
};

// assets/dummyStyles.js
// assets/dummyStyles.js
export const carDetailStyles = {
  carouselIndicator: (active) => `w-3 h-3 rounded-full ${active ? 'bg-purple-500' : 'bg-gray-500'}`,
  inputContainer: (active) => `relative rounded-lg border transition-all ${active ? 'border-purple-500' : 'border-gray-600'}`,
};

// src/assets/dummyStyles.js
// ... existing styles ...

export const testimonialStyles = {
  statValue: (color) => `text-4xl sm:text-5xl font-bold ${color} mb-2`,
  statLabel: (color) => `text-sm ${color} font-medium`,
  cardShapes: [
    "clip-path: polygon(0% 10%, 10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%);",
    "clip-path: polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 10% 100%, 0% 90%);",
    "clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%);"
  ],
  icons: [FaCar, FaRoad, FaKey, FaMapMarkerAlt],
  statColors: {
    value: ["text-cyan-400", "text-amber-400", "text-violet-400", "text-emerald-400"],
    label: ["text-cyan-200", "text-amber-200", "text-violet-200", "text-emerald-200"]
  }
};

// src/assets/dummyStyles.js
// ... existing styles ...

export const contactPageStyles = {
  iconContainer: (color) => `p-2 rounded-md mr-3 ${color}`,
  input: (isActive) => `w-full pl-10 pr-3 py-2 bg-gray-700/50 text-white rounded-lg border ${
    isActive ? 'border-purple-500' : 'border-gray-600'
  } focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm transition-all`,
  select: (isActive) => `w-full pl-10 pr-3 py-2 bg-gray-700/50 cursor-pointer text-white rounded-lg border ${
    isActive ? 'border-purple-500' : 'border-gray-600'
  } focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm appearance-none transition-all`,
  textarea: (isActive) => `w-full pl-10 pr-3 py-2 bg-gray-700/50 text-white rounded-lg border ${
    isActive ? 'border-purple-500' : 'border-gray-600'
  } focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm transition-all`,
  submitButton: "w-full cursor-pointer flex items-center justify-center py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-lg text-white font-medium text-sm shadow-md transition-all transform hover:-translate-y-0.5 group mt-2",
  whatsappIcon: "ml-2 text-lg transform group-hover:scale-110 transition-transform"
};

// src/assets/dummyStyles.js
export const myBookingsStyles = {  
  // Filter buttons
  filterButton: (isActive, type) => {
    const base = "px-4 py-2 rounded-full flex items-center gap-2 transition-all";
    if (!isActive) return `${base} bg-gray-800 text-gray-300 hover:bg-gray-700`;
    
    switch(type) {
      case "all": return `${base} bg-purple-600 text-white`;
      case "upcoming": return `${base} bg-blue-600 text-white`;
      case "completed": return `${base} bg-green-600 text-white`;
      case "cancelled": return `${base} bg-red-600 text-white`;
      default: return base;
    }
  },
  
  // Stats cards
  statsValue: (color) => `text-3xl font-bold ${color} mb-2`,
  
};