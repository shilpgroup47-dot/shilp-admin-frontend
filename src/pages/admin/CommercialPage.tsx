import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getProjects, deleteProject, toggleProjectStatus, type Project } from '../../api/project/projectApi';
import { getImageUrl } from '../../api/imageUtils';
import { Toast } from '../../components/modals';
import DeleteConfirmModal from '../../components/admin/projectTree/DeleteConfirmModal';
import { Eye, Edit, Trash2, MapPin, Calendar, Building2 } from 'lucide-react';

const CommercialPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchCommercialProjects();
  }, []);

  const fetchCommercialProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects('commercial');
      
      if (response.success && response.data && response.data.projects) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
        setError(response.message || 'Failed to fetch commercial projects');
      }
    } catch (err) {
      setProjects([]);
      setError('Error loading projects');
      console.error('Error fetching commercial projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (projectId: string) => {
    navigate(`/admin/projects/edit/${projectId}`);
  };

  const handleView = (projectId: string) => {
    navigate(`/admin/projects/view/${projectId}`);
  };

  const handleToggleStatus = async (projectId: string, currentStatus: boolean) => {
    setTogglingStatus(projectId);
    try {
      const response = await toggleProjectStatus(projectId, !currentStatus);
      if (response.success) {
        setProjects(prev => prev.map(p => 
          p._id === projectId ? { ...p, isActive: !currentStatus } : p
        ));
        setToastMessage(`Project status updated successfully`);
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage(`Failed to update status: ${response.message}`);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      setToastMessage('An error occurred while updating status');
      setToastType('error');
      setShowToast(true);
    } finally {
      setTogglingStatus(null);
    }
  };

  const handleDelete = (projectId: string, projectTitle: string) => {
    setDeleteTarget({ id: projectId, title: projectTitle });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await deleteProject(deleteTarget.id);
      if (response.success) {
        await fetchCommercialProjects();
        setToastMessage(`Project "${deleteTarget.title}" deleted successfully!`);
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage(`Failed to delete project: ${response.message}`);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setToastMessage('An error occurred while deleting the project');
      setToastType('error');
      setShowToast(true);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading commercial projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchCommercialProjects}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Commercial Projects</h1>
        </div>
        <p className="text-gray-600">
          Manage office buildings, retail spaces, and commercial complexes.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-semibold text-blue-700">Total Projects:</span>
          <span className="text-sm font-bold text-blue-900">{projects?.length || 0}</span>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">No commercial projects found</p>
          <p className="text-gray-400 text-sm mt-2">Create commercial projects from the Projects page</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.cardImage && (
                          <img
                            src={getImageUrl(project.cardImage)}
                            alt={project.projectTitle}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            onError={(e) => {
                              console.error('Failed to load image:', project.cardImage);
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23ddd" width="40" height="40"/%3E%3C/svg%3E';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.projectTitle}</div>
                          <div className="text-sm text-gray-500">{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin size={16} className="text-blue-500 mr-2 shrink-0" />
                        <span className="truncate max-w-[200px]">{project.cardLocation || project.shortAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.cardAreaFt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.projectState === 'on-going' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.projectState === 'on-going' ? 'On-Going' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2 shrink-0" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleView(project._id)}
                          className="text-blue-600 hover:text-blue-900 p-2.5 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEdit(project._id)}
                          className="text-green-600 hover:text-green-900 p-2.5 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(project._id, project.isActive)}
                          disabled={togglingStatus === project._id}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            project.isActive 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          } ${togglingStatus === project._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          title={project.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              project.isActive ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id, project.projectTitle)}
                          className="text-red-600 hover:text-red-900 p-2.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Project & Files"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
          onConfirm={confirmDelete}
          title={`Delete "${deleteTarget.title}"?`}
          message="All project images and data will be permanently deleted. This action cannot be undone."
        />
      )}

      {/* Toast Notification */}
      <Toast
        isOpen={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default CommercialPage;
