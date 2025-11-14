import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  preview?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  required?: boolean;
  accept?: string;
  width?: string;
  height?: string;
  showAltText?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  preview,
  onUpload,
  onRemove,
  altText = '',
  onAltChange,
  required = false,
  accept = 'image/*',
  width = 'w-60',
  height = 'h-60',
  showAltText = true,
}) => {
  return (
    <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-6">
        <div className="shrink-0">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className={`${width} ${height} object-cover rounded-xl border-4 border-white shadow-lg`}
              />
              <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className={`${width} ${height} border-2 border-dashed border-green-300 rounded-xl flex items-center justify-center bg-white`}>
              <ImageIcon className="w-20 h-20 text-green-300" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-md">
            <Upload size={16} />
            {preview ? 'Change Image' : 'Choose Image'}
            <input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
              className="hidden"
            />
          </label>
          {showAltText && onAltChange && (
            <input
              type="text"
              placeholder="Image Alt Text"
              value={altText}
              onChange={(e) => onAltChange(e.target.value)}
              className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};
