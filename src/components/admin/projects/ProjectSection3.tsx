import React from 'react';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';

type Amenity = {
  id: string;
  title: string;
  svgOrImage: string;
  alt: string;
  file?: File;
  preview?: string;
};

type ImageItem = {
  id: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

interface ProjectSection3Props {
  formData: {
    amenities: Amenity[];
    youtubeUrl: string;
    updatedImagesTitle: string;
    updatedImages: ImageItem[];
  };
  validationErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  addAmenity: () => void;
  removeAmenity: (id: string) => void;
  updateAmenityField: (id: string, field: string, value: string) => void;
  updateAmenityFile: (id: string, file: File, preview: string) => void;
  updateUpdatedImageField: (id: string, field: string, value: string) => void;
  updateUpdatedImageFile: (id: string, file: File, preview: string) => void;
}

const AmenityCard: React.FC<{
  id: string;
  index: number;
  title: string;
  alt: string;
  preview?: string;
  onTitleChange: (id: string, field: string, value: string) => void;
  onAltChange: (id: string, field: string, value: string) => void;
  onImageUpload: (id: string, file: File) => void;
  onImageRemove: (id: string) => void;
  onRemoveCard: (id: string) => void;
  canRemove: boolean;
}> = ({
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
    <div className="bg-linear-to-r from-emerald-50 to-cyan-50 rounded-xl p-4 border-2 border-emerald-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Amenity {index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemoveCard(id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(id, 'title', e.target.value)}
            placeholder="Enter amenity title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => onAltChange(id, 'alt', e.target.value)}
            placeholder="Enter alt text for image"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <div className="flex items-center gap-4">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt={alt}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
                />
                <button
                  type="button"
                  onClick={() => onImageRemove(id)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
            )}
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onImageUpload(id, file);
                  }
                }}
                className="sr-only"
              />
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                <Upload size={16} className="mr-2" />
                {preview ? 'Change' : 'Upload'} Image
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdatedImageCard: React.FC<{
  id: string;
  index: number;
  alt: string;
  preview?: string;
  onAltChange: (id: string, field: string, value: string) => void;
  onImageUpload: (id: string, file: File) => void;
  onImageRemove: (id: string) => void;
}> = ({
  id,
  index,
  alt,
  preview,
  onAltChange,
  onImageUpload,
  onImageRemove,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
      {/* Title */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Updated Image {index + 1} *</h4>
      </div>

      {/* Alt Text */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text *</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => onAltChange(id, 'alt', e.target.value)}
          placeholder="Enter alt text for image"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          required
        />
      </div>

      {/* Full Image Display */}
      <div className="mb-4">
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt={alt}
              className="w-full h-48 object-cover rounded-lg border-2 border-white shadow-md"
            />
            <button
              type="button"
              onClick={() => onImageRemove(id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <ImageIcon size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No image uploaded</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div>
        <label className="w-full">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImageUpload(id, file);
              }
            }}
            className="sr-only"
          />
          <span className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
            <Upload size={16} className="mr-2" />
            {preview ? 'Change Image' : 'Upload Image'}
          </span>
        </label>
      </div>
    </div>
  );
};

const ProjectSection3: React.FC<ProjectSection3Props> = ({
  formData,
  validationErrors,
  handleInputChange,
  addAmenity,
  removeAmenity,
  updateAmenityField,
  updateAmenityFile,
  updateUpdatedImageField,
  updateUpdatedImageFile,
}) => {
  return (
    <div className="space-y-8">
      {/* Amenities Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">3</span>
            Amenities (Optional)
          </h2>
          <button
            type="button"
            onClick={addAmenity}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            Add Amenity
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.amenities.map((amenity, index) => (
            <AmenityCard
              key={amenity.id}
              id={amenity.id}
              index={index}
              title={amenity.title}
              alt={amenity.alt}
              preview={amenity.preview}
              onTitleChange={updateAmenityField}
              onAltChange={updateAmenityField}
              onImageUpload={(id: string, file: File) => {
                const preview = URL.createObjectURL(file);
                updateAmenityFile(id, file, preview);
              }}
              onImageRemove={(id: string) => updateAmenityField(id, 'preview', '')}
              onRemoveCard={removeAmenity}
              canRemove={formData.amenities.length > 1}
            />
          ))}
        </div>
      </section>

      {/* Media Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Media (Optional)</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
          <input
            type="url"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleInputChange}
            placeholder="Enter YouTube URL (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Project Updated Images Section (Exactly 3 Required) */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Project Updated Images (Exactly 3 Required)</h2>
          <p className="text-gray-600 mt-2">All 3 updated image slots must be filled with images and alt text.</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Updated Images Title *</label>
          <input
            type="text"
            name="updatedImagesTitle"
            value={formData.updatedImagesTitle}
            onChange={handleInputChange}
            placeholder="Enter title for updated images section"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            required
          />
          {validationErrors.updatedImagesTitle && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.updatedImagesTitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.updatedImages.map((image, index) => (
            <UpdatedImageCard
              key={image.id}
              id={image.id}
              index={index}
              alt={image.alt}
              preview={image.preview}
              onAltChange={updateUpdatedImageField}
              onImageUpload={(id: string, file: File) => {
                const preview = URL.createObjectURL(file);
                updateUpdatedImageFile(id, file, preview);
              }}
              onImageRemove={(id: string) => updateUpdatedImageField(id, 'preview', '')}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectSection3;