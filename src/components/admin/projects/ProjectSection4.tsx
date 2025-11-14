import React from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

type ProjectType = 'residential' | 'commercial' | 'plot';
type HouseStatus = 'Ready to Move' | 'Sample House Ready' | 'none';

interface ProjectSection4Props {
  formData: {
    locationTitle: string;
    locationTitleText: string;
    locationArea: string;
    number1: string;
    number2: string;
    email1: string;
    email2: string;
    mapIframeUrl: string;
    cardImage: string;
    cardImageFile?: File;
    cardImagePreview?: string;
    cardLocation: string;
    cardAreaFt: string;
    cardProjectType: ProjectType;
    cardHouse: HouseStatus;
    reraNumber: string;
  };
  validationErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (file: File, fieldName: string) => void;
  removeUploadedFile: (fieldName: string) => void;
  validateEmail: (email: string) => boolean;
}

const ProjectSection4: React.FC<ProjectSection4Props> = ({
  formData,
  validationErrors,
  handleInputChange,
  handleFileUpload,
  removeUploadedFile,
  validateEmail,
}) => {
  return (
    <div className="space-y-8">
      {/* Section 4: Location Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">4</span>
          Location Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Title *</label>
            <input
              type="text"
              name="locationTitle"
              value={formData.locationTitle}
              onChange={handleInputChange}
              placeholder="Enter location title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Title Text *</label>
            <input
              type="text"
              name="locationTitleText"
              value={formData.locationTitleText}
              onChange={handleInputChange}
              placeholder="Enter location description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Area</label>
            <input
              type="text"
              name="locationArea"
              value={formData.locationArea}
              onChange={handleInputChange}
              placeholder="Enter area/locality (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number 1 (Default)</label>
            <input
              type="tel"
              name="number1"
              value={formData.number1}
              onChange={handleInputChange}
              placeholder="9898211567"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                validationErrors.number1 ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {validationErrors.number1 && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                ⚠️ {validationErrors.number1}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number 2 (Default)</label>
            <input
              type="tel"
              name="number2"
              value={formData.number2}
              onChange={handleInputChange}
              placeholder="9898508567"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                validationErrors.number2 ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {validationErrors.number2 && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                ⚠️ {validationErrors.number2}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email 1</label>
            <input
              type="email"
              name="email1"
              value={formData.email1}
              onChange={handleInputChange}
              placeholder="Enter primary email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                validationErrors.email1 ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {formData.email1 && !validateEmail(formData.email1) && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
            )}
            {validationErrors.email1 && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                ⚠️ {validationErrors.email1}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email 2</label>
            <input
              type="email"
              name="email2"
              value={formData.email2}
              onChange={handleInputChange}
              placeholder="Enter secondary email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                validationErrors.email2 ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {formData.email2 && !validateEmail(formData.email2) && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
            )}
            {validationErrors.email2 && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                ⚠️ {validationErrors.email2}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Map Iframe URL *</label>
            <input
              type="text"
              name="mapIframeUrl"
              value={formData.mapIframeUrl}
              onChange={handleInputChange}
              placeholder="Google Maps embed URL (required)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>
      </section>

      {/* Card Detail Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Card Detail (All fields mandatory)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="cardLocation"
              value={formData.cardLocation}
              onChange={handleInputChange}
              placeholder="Enter card location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft) *</label>
            <input
              type="text"
              name="cardAreaFt"
              value={formData.cardAreaFt}
              onChange={handleInputChange}
              placeholder="Enter area in sq ft"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
            <select
              name="cardProjectType"
              value={formData.cardProjectType}
              onChange={handleInputChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-gray-100 cursor-not-allowed"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="plot">Plot</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Auto-synced with main Project Type</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">House Status *</label>
            <select
              name="cardHouse"
              value={formData.cardHouse}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="none">None</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Sample House Ready">Sample House Ready</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Card Image</label>
            <div className="bg-linear-to-r from-cyan-50 to-white p-6 rounded-xl border-2 border-cyan-200">
              <div className="flex items-center gap-6">
                <div className="shrink-0">
                  {formData.cardImagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.cardImagePreview}
                        alt="Card Preview"
                        className="w-60 h-60 object-cover rounded-xl border-4 border-white shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedFile('cardImage')}
                        className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-60 h-60 border-2 border-dashed border-cyan-300 rounded-xl flex items-center justify-center bg-white">
                      <ImageIcon className="w-20 h-20 text-cyan-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 cursor-pointer transition-colors shadow-md">
                    <Upload size={16} />
                    {formData.cardImagePreview ? 'Change Image' : 'Choose Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'cardImage');
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RERA Details Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">RERA Details (Optional)</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RERA Detail</label>
            <input
              type="text"
              name="reraNumber"
              value={formData.reraNumber}
              onChange={handleInputChange}
              placeholder="Enter RERA registration details (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty if not applicable</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectSection4;