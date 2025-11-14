import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { ROUTES } from '../routes/constants';
import { navigationLinks } from '../routes/navlinks';

interface SidebarProps {
  isOpen: boolean;
  mobileMenuOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, onClose }) => {
  const { adminData, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN.LOGIN);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Always Open on Desktop, Overlay on Mobile */}
      <div className={`
        fixed top-0 left-0 h-screen w-72 bg-slate-900 z-50 flex flex-col
        transition-transform duration-300 ease-in-out
        shadow-2xl border-r border-slate-700
        lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-16 px-4 border-b border-slate-700 bg-slate-800 flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div className="ml-3">
              <h1 className="text-white text-lg font-bold">
                Shilp Admin
              </h1>
              <p className="text-slate-400 text-xs">
                Control Panel
              </p>
            </div>
          </div>
          
          {/* Close Button - Mobile Only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {adminData?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                {adminData?.username || 'Admin User'}
              </p>
              <p className="text-slate-400 text-xs">
                {adminData?.role || 'Administrator'}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationLinks.map((item) => {
            const isCurrent = item.href === currentPath;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.name);

            if (hasChildren) {
              return (
                <div key={item.name} className="mb-2">
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`
                      w-full flex items-center p-3 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                  >
                    <span className="flex items-center">
                      {item.icon}
                    </span>
                    <span className="ml-3 flex-1 text-left">{item.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : 'rotate-0'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {isExpanded && item.children && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`
                            block py-2 px-3 rounded-md text-sm transition-colors duration-200
                            ${child.href === currentPath 
                              ? 'bg-blue-600 text-white' 
                              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                            }
                          `}
                          onClick={() => {
                            if (window.innerWidth < 1024 && mobileMenuOpen) {
                              onClose();
                            }
                          }}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center p-3 mb-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isCurrent 
                    ? 'bg-blue-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 1024 && mobileMenuOpen) {
                    onClose();
                  }
                }}
              >
                <span className="flex items-center">
                  {item.icon}
                </span>
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700 bg-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;