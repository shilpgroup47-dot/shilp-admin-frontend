import React, { useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: {
    section?: string;
    field?: string;
    imageUrl?: string;
    metadata?: {
      originalName?: string;
      size?: number;
      filename?: string;
    };
  };
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title,
  message,
  details,
  onClose
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon Circle */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="relative">
            {/* Animated background circle */}
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            {/* Main circle */}
            <div className="relative bg-linear-to-br from-blue-500 to-blue-600 rounded-full p-4 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center px-8 py-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{message}</p>
        </div>

        {/* Details Section */}
        {details && (
          <div className="px-8 pb-6">
            <div className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                Details
              </h3>
              
              <div className="space-y-2.5">
                {details.section && (
                  <div className="flex items-center justify-between py-1.5 border-b border-blue-100 last:border-0">
                    <span className="text-sm font-semibold text-gray-700">Section:</span>
                    <span className="text-sm text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                      {details.section}
                    </span>
                  </div>
                )}
                
                {details.field && (
                  <div className="flex items-center justify-between py-1.5 border-b border-blue-100 last:border-0">
                    <span className="text-sm font-semibold text-gray-700">Field:</span>
                    <span className="text-sm text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                      {details.field === 'banner' ? 'Desktop Banner' : 'Mobile Banner'}
                    </span>
                  </div>
                )}
                
                {details.imageUrl && (
                  <div className="flex items-start justify-between py-1.5 border-b border-blue-100 last:border-0">
                    <span className="text-sm font-semibold text-gray-700">Image URL:</span>
                    <span className="text-sm text-blue-600 truncate max-w-64 text-right" title={details.imageUrl}>
                      {details.imageUrl}
                    </span>
                  </div>
                )}
                
                {details.metadata?.originalName && (
                  <div className="flex items-start justify-between py-1.5 border-b border-blue-100 last:border-0">
                    <span className="text-sm font-semibold text-gray-700">Original Name:</span>
                    <span className="text-sm text-blue-600 truncate max-w-64 text-right" title={details.metadata.originalName}>
                      {details.metadata.originalName}
                    </span>
                  </div>
                )}
                
                {details.metadata?.size && (
                  <div className="flex items-center justify-between py-1.5 border-b border-blue-100 last:border-0">
                    <span className="text-sm font-semibold text-gray-700">File Size:</span>
                    <span className="text-sm text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                      {formatFileSize(details.metadata.size)}
                    </span>
                  </div>
                )}
                
                {details.metadata?.filename && (
                  <div className="flex items-start justify-between py-1.5">
                    <span className="text-sm font-semibold text-gray-700">Saved As:</span>
                    <span className="text-sm text-blue-600 truncate max-w-64 text-right" title={details.metadata.filename}>
                      {details.metadata.filename}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 px-8 pb-8 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Got it, Thanks!
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;