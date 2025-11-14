import axios from "axios";
import { API_CONFIG } from "../config";

// Create axios instance for blog API
const blogApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add auth interceptor
blogApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// TypeScript Interfaces
export interface PointChild {
  title: string;
  subtitle: string;
}

export interface Point {
  title: string;
  subtitle: string;
  image?: string;
  child?: PointChild[];
}

export interface Blog {
  _id: string;
  title: string;
  description: string;
  publish: string;
  date: string;
  url: string;
  image: string;
  alt?: string;
  points: Point[];
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  description: string;
  publish?: string;
  date: string;
  url: string;
  alt?: string;
  points: Point[];
  status?: "draft" | "published" | "archived";
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  _id?: string;
}

// API Functions
export const blogApi = {
  /**
   * Create a new blog with images
   */
  async createBlog(blogData: CreateBlogData, images: {
    mainImage?: File;
    pointImages?: { [key: number]: File };
  }): Promise<Blog> {
    const formData = new FormData();

    // Add blog data fields
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("publish", blogData.publish || "By Shilp Group");
    formData.append("date", blogData.date);
    formData.append("url", blogData.url);
    formData.append("alt", blogData.alt || "");
    formData.append("status", blogData.status || "draft");
    formData.append("points", JSON.stringify(blogData.points));

    // Add main image
    if (images.mainImage) {
      formData.append("image", images.mainImage);
    }

    // Add point images
    if (images.pointImages) {
      Object.entries(images.pointImages).forEach(([index, file]) => {
        formData.append(`point_${index}_image`, file);
      });
    }

    const response = await blogApiClient.post<{ success: boolean; data: Blog }>(
      "/api/blogs",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },

  /**
   * Get all blogs
   */
  async getAllBlogs(status?: "draft" | "published" | "archived"): Promise<Blog[]> {
    const params = status ? { status } : {};
    const response = await blogApiClient.get<{ success: boolean; data: Blog[] }>(
      "/api/blogs",
      { params }
    );
    return response.data.data;
  },

  /**
   * Get a single blog by ID
   */
  async getBlogById(id: string): Promise<Blog> {
    const response = await blogApiClient.get<{ success: boolean; data: Blog }>(
      `/api/blogs/${id}`
    );
    return response.data.data;
  },

  /**
   * Get a blog by URL slug
   */
  async getBlogByUrl(url: string): Promise<Blog> {
    const response = await blogApiClient.get<{ success: boolean; data: Blog }>(
      `/api/blogs/url/${url}`
    );
    return response.data.data;
  },

  /**
   * Update a blog
   */
  async updateBlog(
    id: string,
    blogData: UpdateBlogData,
    images?: {
      mainImage?: File;
      pointImages?: { [key: number]: File };
    }
  ): Promise<Blog> {
    const formData = new FormData();

    // Add updated fields
    if (blogData.title) formData.append("title", blogData.title);
    if (blogData.description) formData.append("description", blogData.description);
    if (blogData.publish) formData.append("publish", blogData.publish);
    if (blogData.date) formData.append("date", blogData.date);
    if (blogData.url) formData.append("url", blogData.url);
    if (blogData.alt !== undefined) formData.append("alt", blogData.alt);
    if (blogData.status) formData.append("status", blogData.status);
    if (blogData.points) formData.append("points", JSON.stringify(blogData.points));

    // Add new images if provided
    if (images?.mainImage) {
      formData.append("image", images.mainImage);
    }

    if (images?.pointImages) {
      Object.entries(images.pointImages).forEach(([index, file]) => {
        formData.append(`point_${index}_image`, file);
      });
    }

    const response = await blogApiClient.put<{ success: boolean; data: Blog }>(
      `/api/blogs/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },

  /**
   * Delete a blog
   */
  async deleteBlog(id: string): Promise<void> {
    await blogApiClient.delete(`/api/blogs/${id}`);
  },
};

export default blogApi;
