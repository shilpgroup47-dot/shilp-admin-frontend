// Enums and Literal Types
export type ProjectState = 'on-going' | 'completed';
export type ProjectType = 'residential' | 'commercial' | 'plot';
export type HouseStatus = 'Ready to Move' | 'Sample House Ready';

// Brochure Type
export type Brochure = {
  readonly type: 'File';
  readonly format: 'PDF';
  readonly path: '/uploads/brochures/';
  readonly description: string;
};

// About Us Section
export type AboutUsSection = {
  readonly description: readonly [string, string, string]; // exactly 3
  readonly image: string;
  readonly alt: string;
};

// Reusable Image Type
export type ImageItem = {
  readonly id: string;
  readonly image: string;
  readonly alt: string;
};

// Floor Plan
export type FloorPlan = {
  readonly id: string;
  readonly title: string;
  readonly image: string;
  readonly alt: string;
};

// Animation
export type Animation = {
  readonly id: string;
  readonly title: string;
  readonly svgOrImage: string;
  readonly alt: string;
};

// Location Section
export type LocationSection = {
  readonly title: string;
  readonly locationTitle: string;
  readonly locationArea: string;
  readonly number1: string;
  readonly number2: string;
  readonly email1: string;
  readonly email2: string;
  readonly mapIframeUrl: string;
};

// Project Updated Images
export type ProjectUpdatedImages = {
  readonly title: string;
  readonly images: readonly ImageItem[];
  readonly locationSection: LocationSection;
};

// Card Detail
export type CardDetail = {
  readonly image: string;
  readonly location: string;
  readonly areaFt: string;
  readonly projectType: ProjectType;
  readonly house: HouseStatus;
};

// Project Detail
export type ProjectDetail = {
  readonly projectTitle: string;
  readonly slug: string;
  readonly brochure: Brochure;
  readonly projectState: ProjectState;
  readonly shortAddress: string;
  readonly projectStatusPercentage: number;
  readonly aboutUsSection: AboutUsSection;
  readonly floorPlans: readonly FloorPlan[];
  readonly projectImages: readonly ImageItem[];
  readonly animations: readonly Animation[];
  readonly youtubeUrl: string;
  readonly projectUpdatedImages: ProjectUpdatedImages;
  readonly cardDetail: CardDetail;
};

// Root Project Document
export type Project = {
  readonly _id: string;
  readonly projectDetail: ProjectDetail;
  readonly createdAt: string;
  readonly updatedAt: string;
};

// Form types for admin panel
export type AboutDescription = {
  id: string;
  text: string;
};

export type FloorPlanForm = {
  id: string;
  title: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

export type ImageItemForm = {
  id: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

export type AmenityForm = {
  id: string;
  title: string;
  svgOrImage: string;
  alt: string;
  file?: File;
  preview?: string;
};

// Project form data structure for admin panel
export type ProjectForm = {
  projectTitle: string;
  slug: string;
  brochureFile?: File;
  projectState: ProjectState;
  shortAddress: string;
  projectStatusPercentage: number;
  aboutUsDescriptions: AboutDescription[];
  aboutUsImageFile?: File;
  aboutUsImagePreview?: string;
  aboutUsAlt: string;
  floorPlans: FloorPlanForm[];
  projectImages: ImageItemForm[];
  amenities: AmenityForm[];
  youtubeUrl: string;
  updatedImagesTitle: string;
  updatedImages: ImageItemForm[];
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