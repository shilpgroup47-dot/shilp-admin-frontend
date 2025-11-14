import React, { useState, useEffect, useMemo } from 'react';
import type { ProjectTree } from '../../api/projectTree';
import {
  getAllProjectTrees,
  createProjectTree,
  updateProjectTree,
  deleteProjectTree,
} from '../../api/projectTree';
import { getImageUrl } from '../../api'; // Import same as BannerPage
import ProjectTreeCard from '../../components/admin/projectTree/ProjectTreeCard';
import SuccessModal from '../../components/admin/projectTree/SuccessModal';
import DeleteConfirmModal from '../../components/admin/projectTree/DeleteConfirmModal';
import { Toast } from '../../components/modals';

const ProjectTreePage: React.FC = () => {
  const [projectTrees, setProjectTrees] = useState<ProjectTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    no: '',
    year: new Date().getFullYear().toString(),
    title: '',
    location: '',
    typeofproject: 'residential' as 'plot' | 'commercial' | 'residential',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('Success!');

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // Generate year options (1990-2100)
  const yearOptions = Array.from({ length: 111 }, (_, i) => 1990 + i);

  // Get next auto-increment number
  const getNextNumber = () => {
    if (projectTrees.length === 0) return 1;
    const maxNo = Math.max(...projectTrees.map(pt => pt.no));
    return maxNo + 1;
  };

  // Fetch project trees
  const fetchProjectTrees = async () => {
    try {
      setLoading(true);
      const response = await getAllProjectTrees();
      if (response.success && response.data) {
        setProjectTrees(response.data);
      }
    } catch (error) {
      console.error('Error fetching project trees:', error);
      setToastMessage('Failed to fetch project trees');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTrees();
  }, []);

  // Apply filters with useMemo to prevent unnecessary re-renders
  const filteredProjectTrees = useMemo(() => {
    let filtered = [...projectTrees];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pt) =>
          pt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pt.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Year filter
    if (filterYear) {
      filtered = filtered.filter((pt) => pt.year.toString() === filterYear);
    }

    // Type filter
    if (filterType) {
      filtered = filtered.filter((pt) => pt.typeofproject === filterType);
    }

    return filtered;
  }, [searchTerm, filterYear, filterType, projectTrees]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile && !editingId && !imagePreview) {
      setToastMessage('Please select an image');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('no', formData.no);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('typeofproject', formData.typeofproject);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingId) {
        const response = await updateProjectTree(editingId, formDataToSend);
        if (response.success) {
          setSuccessTitle('Updated! ✓');
          setSuccessMessage(`Project "${formData.title}" has been updated successfully! 🎉`);
          setShowSuccessModal(true);
          // Reset form and fetch after a delay
          setTimeout(() => {
            resetForm();
            fetchProjectTrees();
          }, 500);
        }
      } else {
        const response = await createProjectTree(formDataToSend);
        if (response.success) {
          setSuccessTitle('Created! 🎉');
          setSuccessMessage(`Project "${formData.title}" has been created successfully!`);
          setShowSuccessModal(true);
          // Reset form and fetch after a delay
          setTimeout(() => {
            resetForm();
            fetchProjectTrees();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error saving project tree:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Failed to save project tree';
      setToastMessage(errorMessage || 'Failed to save project tree');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      no: '',
      year: new Date().getFullYear().toString(),
      title: '',
      location: '',
      typeofproject: 'residential',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  // Open form for creating new item
  const openCreateForm = () => {
    setFormData({
      no: getNextNumber().toString(),
      year: new Date().getFullYear().toString(),
      title: '',
      location: '',
      typeofproject: 'residential',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (projectTree: ProjectTree) => {
    setFormData({
      no: projectTree.no.toString(),
      year: projectTree.year.toString(),
      title: projectTree.title,
      location: projectTree.location,
      typeofproject: projectTree.typeofproject,
    });
    
    // Set existing image preview
    if (projectTree.image) {
      setImagePreview(getImageUrl(projectTree.image, false)); // Same signature as banner page
    } else {
      setImagePreview('');
    }
    
    setImageFile(null); // Clear any previously selected file
    setEditingId(projectTree._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete - Open confirmation modal
  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
    setShowDeleteModal(true);
  };

  // Confirm delete - Actually delete the project
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await deleteProjectTree(deleteTarget.id);
      if (response.success) {
        setSuccessTitle('Deleted! ✓');
        setSuccessMessage(`Project "${deleteTarget.title}" has been deleted successfully!`);
        setShowSuccessModal(true);
        fetchProjectTrees();
      }
    } catch (error) {
      console.error('Error deleting project tree:', error);
      setSuccessTitle('Error!');
      setSuccessMessage('Failed to delete project tree. Please try again.');
      setShowSuccessModal(true);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Project Tree Item' : 'Create New Project Tree Item'}
              </h2>
            </div>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* No Field - Auto-generated */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number {!editingId && <span className="text-blue-500 text-xs">(Auto-generated)</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-semibold">#</span>
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.no}
                    readOnly={!editingId}
                    onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-not-allowed"
                    placeholder="Auto"
                  />
                </div>
              </div>

              {/* Year Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year} className="bg-white">
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter project title"
                  maxLength={200}
                />
              </div>

              {/* Location Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter location"
                  maxLength={200}
                />
              </div>

              {/* Type of Project Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type of Project <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.typeofproject}
                  onChange={(e) => setFormData({ ...formData, typeofproject: e.target.value as 'plot' | 'commercial' | 'residential' })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="residential" className="bg-white">Residential</option>
                  <option value="commercial" className="bg-white">Commercial</option>
                  <option value="plot" className="bg-white">Plot</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image {!editingId && <span className="text-red-500">*</span>}
                  {editingId && imagePreview && <span className="text-blue-500 text-xs ml-2">(Current image shown below - upload new to replace)</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingId && !imagePreview}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    {editingId && !imageFile ? 'Current Image' : 'Image Preview'}
                  </label>
                  {imageFile && (
                    <span className="text-xs text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                      ✓ New image selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-blue-200 shadow-lg ring-4 ring-blue-50">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {editingId && imagePreview && (
                    <div className="flex-1 text-sm text-gray-600">
                      <p className="mb-2">📷 {imageFile ? 'New image will replace the current one when you save' : 'This is the current image'}</p>
                      {!imageFile && (
                        <p className="text-blue-600 font-medium">💡 Select a new image above to replace this one</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingId ? 'Update Project' : 'Create Project'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Filters & Search</h3>
          </div>
          
          {/* Create Button - Moved to right side */}
          <button
            onClick={openCreateForm}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="" className="bg-white">All Years</option>
              {yearOptions.reverse().map((year) => (
                <option key={year} value={year} className="bg-white">
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="" className="bg-white">All Types</option>
              <option value="residential" className="bg-white">Residential</option>
              <option value="commercial" className="bg-white">Commercial</option>
              <option value="plot" className="bg-white">Plot</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || filterYear || filterType) && (
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterYear('');
                setFilterType('');
              }}
              className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg border-2 border-red-200 hover:border-red-300 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
        )}
      </div>

      {/* Project Tree Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading && (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-gray-600 text-lg font-medium">Loading projects...</p>
            </div>
          </div>
        )}

        {!loading && filteredProjectTrees.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 text-xl font-bold mb-1">No project trees found</p>
                <p className="text-gray-500">Create your first project tree item to get started</p>
              </div>
            </div>
          </div>
        )}

        {!loading &&
          filteredProjectTrees.map((projectTree) => (
            <ProjectTreeCard
              key={projectTree._id}
              projectTree={projectTree}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title={successTitle}
          message={successMessage}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title={deleteTarget?.title || ''}
        message="This will permanently delete the project and its image. This action cannot be undone."
      />

      {/* Toast Notification */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
        duration={3000}
      />
      </div>
    </div>
  );
};

export default ProjectTreePage;
