import React from 'react';
import { Plus } from 'lucide-react';
import { FloorPlanCard, ProjectImageCard } from './index';

type ImageItem = {
  id: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

type FloorPlan = {
  id: string;
  title: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

interface ProjectSection2Props {
  formData: {
    floorPlans: FloorPlan[];
    projectImages: ImageItem[];
  };
  addFloorPlan: () => void;
  removeFloorPlan: (id: string) => void;
  updateFloorPlanField: (id: string, field: string, value: string) => void;
  updateFloorPlanImage: (id: string, file: File, preview: string) => void;
  removeProjectImage: (id: string) => void;
  updateProjectImageField: (id: string, field: string, value: string) => void;
  updateProjectImageFile: (id: string, file: File, preview: string) => void;
}

const ProjectSection2: React.FC<ProjectSection2Props> = ({
  formData,
  addFloorPlan,
  removeFloorPlan,
  updateFloorPlanField,
  updateFloorPlanImage,
  removeProjectImage,
  updateProjectImageField,
  updateProjectImageFile,
}) => {
  return (
    <div className="space-y-8">
      {/* Section 2: Floor Plans */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">2</span>
            Floor Plans
          </h2>
          <button
            type="button"
            onClick={addFloorPlan}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={16} />
            Add Floor Plan
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.floorPlans.map((floorPlan, index) => (
            <FloorPlanCard
              key={floorPlan.id}
              id={floorPlan.id}
              index={index}
              title={floorPlan.title}
              alt={floorPlan.alt}
              preview={floorPlan.preview}
              onTitleChange={(id: string, field: 'title' | 'alt', value: string) => updateFloorPlanField(id, field, value)}
              onAltChange={(id: string, field: 'title' | 'alt', value: string) => updateFloorPlanField(id, field, value)}
              onImageUpload={(id: string, file: File) => {
                const preview = URL.createObjectURL(file);
                updateFloorPlanImage(id, file, preview);
              }}
              onImageRemove={(id: string) => updateFloorPlanField(id, 'preview', '')}
              onRemoveCard={removeFloorPlan}
              canRemove={formData.floorPlans.length > 1}
            />
          ))}
        </div>
      </section>

      {/* Project Images Section (Exactly 5 Required) */}
      <section className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Project Images (Exactly 5 Required)</h2>
          <p className="text-gray-600 mt-2">All 5 project image slots must be filled with images and alt text.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.projectImages.map((image) => (
            <ProjectImageCard
              key={image.id}
              id={image.id}
              alt={image.alt}
              preview={image.preview}
              onAltChange={(id: string, field: 'alt', value: string) => updateProjectImageField(id, field, value)}
              onImageUpload={(id: string, file: File) => {
                const preview = URL.createObjectURL(file);
                updateProjectImageFile(id, file, preview);
              }}
              onImageRemove={(id: string) => updateProjectImageField(id, 'preview', '')}
              onRemoveCard={removeProjectImage}
              canRemove={false} // Never allow removal since exactly 5 are required
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectSection2;