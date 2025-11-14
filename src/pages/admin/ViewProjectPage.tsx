import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getProjectById } from '../../api';
import { getImageUrl } from '../../api/imageUtils';
import { MapPin, Calendar, FileText, Image as ImageIcon, ArrowLeft } from 'lucide-react';

interface ProjectData {
  _id: string;
  projectTitle: string;
  slug?: string;
  projectState: string;
  projectType: string;
  isActive: boolean;
  cardLocation?: string;
  cardAreaFt?: string;
  shortAddress?: string;
  projectStatusPercentage?: number;
  reraNumber?: string;
  cardImage?: string;
  brochure?: string;
  youtubeUrl?: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  aboutUsDetail?: {
    description1?: string;
    description2?: string;
    description3?: string;
    description4?: string;
    image?: {
      url?: string;
      alt?: string;
    };
  };
  projectImages?: Array<{
    image: string;
    alt?: string;
  }>;
  floorPlans?: Array<{
    title: string;
    image: string;
    alt?: string;
  }>;
  amenities?: Array<{
    title: string;
    svgOrImage?: string;
    alt?: string;
  }>;
  locationTitle?: string;
  locationArea?: string;
  number1?: string;
  number2?: string;
  email1?: string;
  email2?: string;
  mapIframeUrl?: string;
}

export default function ViewProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getProjectById(id);
        setProject(response.data as ProjectData);
        setError(null);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Project not found'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.projectTitle}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className={`px-3 py-1 rounded-full font-medium ${
                project.projectState === 'on-going' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {project.projectState === 'on-going' ? 'On-Going' : 'Completed'}
              </span>
              <span className={`px-3 py-1 rounded-full font-medium ${
                project.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {project.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium capitalize">
                {project.projectType}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="flex items-start gap-3">
            <MapPin className="text-blue-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{project.cardLocation || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ImageIcon className="text-green-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Area</p>
              <p className="font-medium text-gray-900">{project.cardAreaFt || 'N/A'} sq ft</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="text-purple-500 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Project Title</label>
              <p className="text-gray-900 mt-1">{project.projectTitle}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Short Address</label>
              <p className="text-gray-900 mt-1">{project.shortAddress || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Project Status</label>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${project.projectStatusPercentage || 0}%` }}
                  >
                    {project.projectStatusPercentage || 0}%
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Slug</label>
              <p className="text-gray-900 mt-1 font-mono text-sm">{project.slug || 'N/A'}</p>
            </div>

            {project.reraNumber && (
              <div>
                <label className="text-sm font-medium text-gray-600">RERA Number</label>
                <p className="text-gray-900 mt-1">{project.reraNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Card Image */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Card Image</h2>
          {project.cardImage ? (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={getImageUrl(project.cardImage)} 
                alt={project.projectTitle}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  console.error('❌ Failed to load card image:', project.cardImage);
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <ImageIcon className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-500">No card image available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      {(project.aboutUsDetail?.description1 || project.aboutUsDetail?.image?.url) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Project</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {project.aboutUsDetail?.description1 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Description 1</h3>
                  <p className="text-gray-700">{project.aboutUsDetail.description1}</p>
                </div>
              )}
              
              {project.aboutUsDetail?.description2 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Description 2</h3>
                  <p className="text-gray-700">{project.aboutUsDetail.description2}</p>
                </div>
              )}
              
              {project.aboutUsDetail?.description3 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Description 3</h3>
                  <p className="text-gray-700">{project.aboutUsDetail.description3}</p>
                </div>
              )}
              
              {project.aboutUsDetail?.description4 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Description 4</h3>
                  <p className="text-gray-700">{project.aboutUsDetail.description4}</p>
                </div>
              )}
            </div>
            
            {project.aboutUsDetail?.image?.url && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">About Image</h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={getImageUrl(project.aboutUsDetail.image.url)} 
                    alt={project.aboutUsDetail.image.alt || 'About section'}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Images Gallery */}
      {project.projectImages && project.projectImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Project Gallery ({project.projectImages.length})
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.projectImages.map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <img 
                  src={getImageUrl(img.image)} 
                  alt={img.alt || `Project image ${idx + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor Plans */}
      {project.floorPlans && project.floorPlans.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Floor Plans ({project.floorPlans.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.floorPlans.map((plan, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={getImageUrl(plan.image)} 
                  alt={plan.alt || plan.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3 bg-gray-50">
                  <p className="font-medium text-gray-900">{plan.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities */}
      {project.amenities && project.amenities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Amenities ({project.amenities.length})
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.amenities.map((amenity, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                {amenity.svgOrImage && (
                  <img 
                    src={getImageUrl(amenity.svgOrImage)} 
                    alt={amenity.alt || amenity.title}
                    className="w-16 h-16 object-contain mb-2"
                  />
                )}
                <p className="text-sm font-medium text-gray-900 text-center">{amenity.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brochure */}
      {project.brochure && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Brochure</h2>
          
          <a 
            href={getImageUrl(project.brochure)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText size={20} />
            Download Brochure (PDF)
          </a>
        </div>
      )}

      {/* Location Details */}
      {(project.locationTitle || project.mapIframeUrl) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Location Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {project.locationTitle && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Location Title</label>
                  <p className="text-gray-900 mt-1">{project.locationTitle}</p>
                </div>
              )}
              
              {project.locationArea && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Area</label>
                  <p className="text-gray-900 mt-1">{project.locationArea}</p>
                </div>
              )}
              
              {(project.number1 || project.number2) && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Numbers</label>
                  <div className="mt-1 space-y-1">
                    {project.number1 && <p className="text-gray-900">{project.number1}</p>}
                    {project.number2 && <p className="text-gray-900">{project.number2}</p>}
                  </div>
                </div>
              )}
              
              {(project.email1 || project.email2) && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Addresses</label>
                  <div className="mt-1 space-y-1">
                    {project.email1 && <p className="text-gray-900">{project.email1}</p>}
                    {project.email2 && <p className="text-gray-900">{project.email2}</p>}
                  </div>
                </div>
              )}
            </div>
            
            {project.mapIframeUrl && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Map</label>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src={project.mapIframeUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* YouTube Video */}
      {project.youtubeUrl && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Video Tour</h2>
          
          <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
            <iframe
              width="100%"
              height="100%"
              src={project.youtubeUrl}
              title="Project video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Metadata</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Project ID</label>
            <p className="text-gray-900 mt-1 font-mono text-sm">{project._id}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Created At</label>
            <p className="text-gray-900 mt-1">
              {new Date(project.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Last Updated</label>
            <p className="text-gray-900 mt-1">
              {new Date(project.updatedAt).toLocaleString()}
            </p>
          </div>
          
          {project.metaTitle && (
            <div>
              <label className="text-sm font-medium text-gray-600">Meta Title</label>
              <p className="text-gray-900 mt-1">{project.metaTitle}</p>
            </div>
          )}
          
          {project.metaDescription && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Meta Description</label>
              <p className="text-gray-900 mt-1">{project.metaDescription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
