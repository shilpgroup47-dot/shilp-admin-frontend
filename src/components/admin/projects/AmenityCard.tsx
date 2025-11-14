import React from 'react';
import { Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface AmenityCardProps {
  id: string;
  index: number;
  title: string;
  alt: string;
  preview?: string;
  onTitleChange: (id: string, field: 'title' | 'alt', value: string) => void;
  onAltChange: (id: string, field: 'title' | 'alt', value: string) => void;
  onImageUpload: (id: string, file: File) => void;
  onImageRemove: (id: string) => void;
  onRemoveCard: (id: string) => void;
  canRemove: boolean;
}

export const AmenityCard: React.FC<AmenityCardProps> = ({
  id,
  index,
  title,
  alt,
  preview,
  onTitleChange,
  onAltChange,
  onImageUpload,
  onImageRemove,
  onRemoveCard,
  canRemove,
}) => {
  return (
    <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-blue-700 text-lg">Amenity {index + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemoveCard(id)}
            className="text-red-600 hover:bg-red-100 p-1.5 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex justify-center">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl border-2 border-blue-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => onImageRemove(id)}
                className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-full h-48 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center bg-white">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-blue-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Amenity Icon/Image</p>
              </div>
            </div>
          )}
        </div>
        
        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-md w-full">
          <Upload size={16} />
          {preview ? 'Change Icon' : 'Upload Icon'}
          <input
            type="file"
            accept="image/*,.svg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(id, file);
            }}
            className="hidden"
          />
        </label>
        
        <input
          type="text"
          placeholder="Amenity Title"
          value={title}
          onChange={(e) => onTitleChange(id, 'title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          placeholder="Alt Text for Accessibility"
          value={alt}
          onChange={(e) => onAltChange(id, 'alt', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
