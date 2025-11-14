import React from 'react';
import { FormField, SelectField, TextAreaField } from './index';

type ProjectState = 'on-going' | 'completed';
type ProjectType = 'residential' | 'commercial' | 'plot';

type AboutUsDetail = {
  description1: string;
  description2?: string;
  description3?: string;
  description4?: string;
  image: {
    alt: string;
    file?: File;
    preview?: string;
  };
};

type BannerSection = {
  desktopBannerImage: string;
  mobileBannerImage: string;
  alt: string;
  desktopBannerFile?: File;
  mobileBannerFile?: File;
  desktopPreview?: string;
  mobilePreview?: string;
};

interface ProjectSection1Props {
  formData: {
    projectTitle: string;
    slug: string;
    brochureFile?: File;
    projectState: ProjectState;
    projectType: ProjectType;
    shortAddress: string;
    projectStatusPercentage: number;
    bannerSection: BannerSection;
    aboutUsDetail: AboutUsDetail;
  };
  validationErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleAboutUsChange: (field: string, value: string) => void;
  handleAboutUsImageUpload: (file: File) => void;
  removeAboutUsImage: () => void;
  handleBrochureUpload?: (file: File) => void;
  handleBannerUpload: (type: 'desktop' | 'mobile', file: File) => void;
  removeBannerImage: (type: 'desktop' | 'mobile') => void;
  handleBannerChange: (field: string, value: string) => void;
}

const ProjectSection1: React.FC<ProjectSection1Props> = ({
  formData,
  validationErrors,
  handleInputChange,
  handleAboutUsChange,
  handleAboutUsImageUpload,
  removeAboutUsImage,
  handleBrochureUpload,
  handleBannerUpload,
  removeBannerImage,
  handleBannerChange
}) => {
  return (
    <div className="space-y-8">
      {/* Section 1: Basic Information */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">1</span>
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Project Title"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleInputChange}
            required
            error={validationErrors.projectTitle}
          />
          
          <FormField
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="Auto-generated or enter custom slug"
            required
            error={validationErrors.slug}
            helperText="(Auto-generated from title)"
            className="bg-gray-50"
          />
          
          <SelectField
            label="Project State"
            name="projectState"
            value={formData.projectState}
            onChange={handleInputChange}
            options={[
              { value: 'on-going', label: 'On-going' },
              { value: 'completed', label: 'Completed' }
            ]}
            required
          />
          
          <SelectField
            label="Project Type"
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            options={[
              { value: 'residential', label: 'Residential' },
              { value: 'commercial', label: 'Commercial' },
              { value: 'plot', label: 'Plot' }
            ]}
            required
          />
          
          <FormField
            label="Status Percentage"
            name="projectStatusPercentage"
            value={formData.projectStatusPercentage}
            onChange={handleInputChange}
            type="number"
            min={0}
            max={100}
            required
          />
          
          <FormField
            label="Short Address"
            name="shortAddress"
            value={formData.shortAddress}
            onChange={handleInputChange}
            required
            className="md:col-span-2"
          />

          {/* Brochure Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Brochure (PDF) *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && handleBrochureUpload) {
                    handleBrochureUpload(file);
                  }
                }}
                className="hidden"
                id="brochure-upload"
              />
              <label
                htmlFor="brochure-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">
                  {formData.brochureFile ? formData.brochureFile.name : 'Click to upload PDF brochure'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Banner Section</h2>
        <div className="space-y-6">
          {/* Desktop Banner Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Banner Image *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
              {formData.bannerSection.desktopPreview ? (
                <div className="relative">
                  <img 
                    src={formData.bannerSection.desktopPreview} 
                    alt="Desktop Banner Preview" 
                    className="max-w-full h-48 object-cover mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeBannerImage('desktop')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleBannerUpload('desktop', file);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600">Click to upload desktop banner image</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Mobile Banner Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Banner Image *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
              {formData.bannerSection.mobilePreview ? (
                <div className="relative">
                  <img 
                    src={formData.bannerSection.mobilePreview} 
                    alt="Mobile Banner Preview" 
                    className="max-w-full h-48 object-cover mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeBannerImage('mobile')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleBannerUpload('mobile', file);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600">Click to upload mobile banner image</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Alt Text */}
          <FormField
            label="Banner Alt Text"
            name="bannerAlt"
            value={formData.bannerSection.alt}
            onChange={(e) => handleBannerChange('alt', e.target.value)}
            placeholder="Enter descriptive alt text for banner images"
            required
          />
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">About Us Section</h2>
        <div className="space-y-6">
          <TextAreaField
            label="Description 1"
            name="description1"
            value={formData.aboutUsDetail.description1}
            onChange={(e) => handleAboutUsChange('description1', e.target.value)}
            placeholder="Enter first description"
            rows={3}
            required
            error={validationErrors.description1}
          />
          
          <TextAreaField
            label="Description 2"
            name="description2"
            value={formData.aboutUsDetail.description2 || ''}
            onChange={(e) => handleAboutUsChange('description2', e.target.value)}
            placeholder="Enter second description (optional)"
            rows={3}
            error={validationErrors.description2}
          />

          <TextAreaField
            label="Description 3"
            name="description3"
            value={formData.aboutUsDetail.description3 || ''}
            onChange={(e) => handleAboutUsChange('description3', e.target.value)}
            placeholder="Enter third description (optional)"
            rows={3}
            error={validationErrors.description3}
          />

          <TextAreaField
            label="Description 4"
            name="description4"
            value={formData.aboutUsDetail.description4 || ''}
            onChange={(e) => handleAboutUsChange('description4', e.target.value)}
            placeholder="Enter fourth description (optional)"
            rows={3}
            error={validationErrors.description4}
          />

          {/* About Us Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About Us Image *</label>
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Full Image Display */}
                <div className="flex justify-center">
                  {formData.aboutUsDetail.image.preview ? (
                    <div className="relative w-full max-w-md">
                      <img
                        src={formData.aboutUsDetail.image.preview}
                        alt={formData.aboutUsDetail.image.alt || "About Us Preview"}
                        className="w-full h-64 object-cover rounded-lg border-2 border-white shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeAboutUsImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm">No image uploaded</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side - Upload Button and Alt Text */}
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div>
                    <label className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {formData.aboutUsDetail.image.preview ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAboutUsImageUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Alt Text Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text *</label>
                    <input
                      type="text"
                      value={formData.aboutUsDetail.image.alt || ''}
                      onChange={(e) => handleAboutUsChange('imageAlt', e.target.value)}
                      placeholder="Enter descriptive alt text for the image"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    {validationErrors.imageAlt && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.imageAlt}</p>
                    )}
                  </div>

             
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectSection1;