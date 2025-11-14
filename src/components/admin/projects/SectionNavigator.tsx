import React from 'react';
import { Check } from 'lucide-react';

interface SectionNavigatorProps {
  currentSection: number;
  completedSections: Set<number>;
  onSectionChange: (section: number) => void;
  isDisabled?: boolean;
}

const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  currentSection,
  completedSections,
  onSectionChange,
  isDisabled = false,
}) => {
  const sections = [
    { id: 1, title: 'Basic Info & About Us', color: 'blue' },
    { id: 2, title: 'Floor Plans & Images', color: 'purple' },
    { id: 3, title: 'Amenities & Media', color: 'orange' },
    { id: 4, title: 'Location & Details', color: 'teal' },
  ];

  const getStepClasses = (sectionId: number, color: string) => {
    const baseClasses = 'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all';
    
    if (currentSection === sectionId) {
      return `${baseClasses} bg-${color}-600 text-white ring-4 ring-${color}-200`;
    } else if (completedSections.has(sectionId)) {
      return `${baseClasses} bg-green-600 text-white`;
    } else {
      return `${baseClasses} bg-gray-200 text-gray-600`;
    }
  };

  const getLineClasses = (sectionId: number) => {
    if (completedSections.has(sectionId) && completedSections.has(sectionId + 1)) {
      return 'bg-green-600';
    } else if (completedSections.has(sectionId) || currentSection > sectionId) {
      return 'bg-gray-400';
    } else {
      return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Creation Progress</h3>
      <div className="flex items-center justify-between">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center">
            <button
              type="button"
              onClick={() => !isDisabled && onSectionChange(section.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center space-y-2 group ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <div className={getStepClasses(section.id, section.color)}>
                {completedSections.has(section.id) ? (
                  <Check size={16} />
                ) : (
                  <span>{section.id}</span>
                )}
              </div>
              <span className={`text-xs text-center max-w-20 transition-colors ${
                currentSection === section.id 
                  ? `text-${section.color}-600 font-medium` 
                  : 'text-gray-600'
              }`}>
                {section.title}
              </span>
            </button>
            {index < sections.length - 1 && (
              <div className={`h-1 w-16 mx-4 rounded transition-all ${getLineClasses(section.id)}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 bg-gray-100 rounded-full h-2">
        <div 
          className="bg-linear-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((completedSections.size + (currentSection > completedSections.size ? 1 : 0)) / 4) * 100}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        {completedSections.size} of 4 sections completed
      </p>
    </div>
  );
};

export default SectionNavigator;