import React from 'react';

export const TechLogo: React.FC<{ name: string; className?: string }> = ({ name, className = "w-4 h-4" }) => {
  switch (name) {
    case 'React.js':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
        </svg>
      );

    case 'JavaScript (ES6+)':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path d="M11.5 17.5C11.5 19 10.3 19.8 8.8 19.8C7.2 19.8 6.3 18.9 6 17.7L7.6 16.7C7.8 17.3 8.2 17.9 8.8 17.9C9.4 17.9 9.8 17.6 9.8 16.8V11.5H11.5V17.5ZM17.8 17.4C17.2 18.8 15.9 19.8 14.2 19.8C12.4 19.8 11.2 18.4 11.2 16.2C11.2 13.9 12.5 12.5 14.3 12.5C16.1 12.5 17.1 13.7 17.6 14.8L16 15.7C15.6 14.9 15.1 14.3 14.3 14.3C13.5 14.3 13 15.1 13 16.2C13 17.3 13.5 18 14.3 18C15.1 18 15.5 17.3 15.8 16.6L17.8 17.4Z" fill="#000000" />
        </svg>
      );

    case 'HTML5 / CSS3':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M3 3H21L19.2 19.5L12 21.5L4.8 19.5L3 3Z" fill="#E34F26" />
          <path d="M12 20L17.8 18.4L19.3 4.5H12V20Z" fill="#EF652A" />
          <path d="M12 7.5H16.2L15.9 10.5H12V13H15.6L15.2 17L12 17.9V15.4L13.8 14.9L14 13H12V7.5Z" fill="#FFFFFF" />
          <path d="M12 7.5H7.8L8.3 13H12V10.5H9.6L9.4 9H12V7.5ZM12 17.9L8.8 17L8.6 14.5H7.1L7.4 18.4L12 19.7V17.9Z" fill="#ECECEC" />
        </svg>
      );

    case 'TailwindCSS':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#38BDF8" />
        </svg>
      );

    case 'Vite / Webpack':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M21.75 3.75L12.5 20.25L10 15.75L17.25 6H8.25L5.75 1.5L21.75 3.75Z" fill="#BD34FE" />
          <path d="M2.25 3.75L11.5 20.25L14 15.75L6.75 6H15.75L18.25 1.5L2.25 3.75Z" fill="#FFD83D" />
        </svg>
      );

    case 'State Management':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" fill="#A855F7" />
          <circle cx="19" cy="6" r="2.5" />
          <circle cx="5" cy="6" r="2.5" />
          <circle cx="12" cy="20" r="2.5" />
          <line x1="12" y1="9" x2="12" y2="17.5" />
          <line x1="10" y1="10.5" x2="6.8" y2="7.5" />
          <line x1="14" y1="10.5" x2="17.2" y2="7.5" />
        </svg>
      );

    case 'Node.js':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3.5 7V17L12 22L20.5 17V7L12 2Z" fill="#5FA04E" />
          <path d="M12 4.5L18.5 8.3V15.7L12 19.5L5.5 15.7V8.3L12 4.5Z" fill="#333333" />
          <path d="M12 7L16 9.3V14.7L12 17L8 14.7V9.3L12 7Z" fill="#5FA04E" />
        </svg>
      );

    case 'Express.js':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#1E293B" />
          <text x="12" y="16" fill="#F8FAFC" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">ex</text>
        </svg>
      );

    case 'PostgreSQL':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11.5 6.5C12.8 6.5 14 7.2 14.6 8.3C15 9 15.2 9.9 15.1 10.7C15.8 11.2 16.3 12 16.3 12.9C16.3 14.2 15.2 15.2 13.9 15.2H10.5C9.4 15.2 8.5 14.3 8.5 13.2V9.5C8.5 7.8 9.8 6.5 11.5 6.5Z" fill="#4169E1" />
        </svg>
      );

    case 'RESTful API':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );

    case 'WebSocket':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );

    case 'Authentication':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );

    case 'AWS Cloud':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M6.5 17.5C4 17.5 2 15.5 2 13C2 10.8 3.5 9 5.6 8.6C6.3 6 8.7 4 11.5 4C14.8 4 17.5 6.7 17.5 10C19.5 10.2 21 11.9 21 14C21 16.2 19.2 18 17 18H6.5Z" fill="#FF9900" fillOpacity="0.2" stroke="#FF9900" strokeWidth="1.5" />
          <path d="M6 19.5C10 21.5 15 21.5 18 19" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16.5 18.5L18.5 19L18 17" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'Gen AI & LLM Integration':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" fill="url(#ai-grad)" />
          <path d="M19 16L20.2 19.3L23.5 20.5L20.2 21.7L19 25L17.8 21.7L14.5 20.5L17.8 19.3L19 16Z" fill="#F59E0B" />
          <defs>
            <linearGradient id="ai-grad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'Docker Containers':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M1.5 14.5C2.5 12 5.5 11.5 7.5 13C9 14.1 11.5 14 13 13.5C15 13 17 13.5 18.5 14.5C20.5 15.8 22 14.5 22.5 14C23 16 21.5 18.5 18.5 19.5C14.5 20.8 7.5 20.5 3.5 18C2 17 1 15.5 1.5 14.5Z" fill="#2496ED" />
          <rect x="5" y="9" width="3" height="2.5" rx="0.5" fill="#2496ED" />
          <rect x="9" y="9" width="3" height="2.5" rx="0.5" fill="#2496ED" />
          <rect x="13" y="9" width="3" height="2.5" rx="0.5" fill="#2496ED" />
          <rect x="9" y="6" width="3" height="2.5" rx="0.5" fill="#2496ED" />
          <rect x="13" y="6" width="3" height="2.5" rx="0.5" fill="#2496ED" />
          <rect x="13" y="3" width="3" height="2.5" rx="0.5" fill="#2496ED" />
        </svg>
      );

    case 'Git / GitHub':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#F05032" />
        </svg>
      );

    case 'System Architecture':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );

    default:
      return null;
  }
};
