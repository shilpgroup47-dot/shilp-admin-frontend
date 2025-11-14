import React, { useState, useEffect, useCallback, useMemo } from "react";
import { blogApi } from "../../api";
import type { Blog, CreateBlogData, Point, PointChild } from "../../api";
import { SuccessModal } from "../../components/modals";

// Memoized Status Badge Component
const StatusBadge = React.memo(({ status }: { status: string }) => {
  const badgeClass = useMemo(() => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, [status]);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Memoized Blog Card Component
const BlogCard = React.memo(({ 
  blog, 
  onEdit, 
  onDelete 
}: { 
  blog: Blog; 
  onEdit: (blog: Blog) => void; 
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-blue-700 flex-1">{blog.title}</h3>
        <StatusBadge status={blog.status} />
      </div>
      <p className="text-gray-600 mb-3 line-clamp-2">{blog.description}</p>
      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
        <span>By {blog.publish}</span>
        <span>•</span>
        <span>{blog.date}</span>
        <span>•</span>
        <span>{blog.points.length} points</span>
      </div>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.alt || blog.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(blog)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog._id)}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

BlogCard.displayName = 'BlogCard';

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState<CreateBlogData>({
    title: "",
    description: "",
    publish: "By Shilp Group",
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    url: "",
    alt: "",
    points: [],
    status: "draft",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [pointImages, setPointImages] = useState<{ [key: number]: File }>({});
  const [pointImagePreviews, setPointImagePreviews] = useState<{
    [key: number]: string;
  }>({});

  // Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogApi.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle form input changes
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle main image selection
  const handleMainImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Handle point image selection
  const handlePointImageChange = useCallback((
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPointImages((prev) => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPointImagePreviews((prev) => ({
          ...prev,
          [index]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Add new point
  const addPoint = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      points: [...prev.points, { title: "", subtitle: "", image: "", child: [] }],
    }));
  }, []);

  // Remove point
  const removePoint = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index),
    }));
    // Clean up image data
    setPointImages((prev) => {
      const newPointImages = { ...prev };
      delete newPointImages[index];
      return newPointImages;
    });
    setPointImagePreviews((prev) => {
      const newPointImagePreviews = { ...prev };
      delete newPointImagePreviews[index];
      return newPointImagePreviews;
    });
  }, []);

  // Update point data
  const updatePoint = useCallback((index: number, field: keyof Point, value: string) => {
    setFormData((prev) => {
      const updatedPoints = [...prev.points];
      updatedPoints[index] = { ...updatedPoints[index], [field]: value };
      return { ...prev, points: updatedPoints };
    });
  }, []);

  // Add child to point
  const addChildToPoint = useCallback((pointIndex: number) => {
    setFormData((prev) => {
      const updatedPoints = [...prev.points];
      if (!updatedPoints[pointIndex].child) {
        updatedPoints[pointIndex].child = [];
      }
      updatedPoints[pointIndex].child!.push({ title: "", subtitle: "" });
      return { ...prev, points: updatedPoints };
    });
  }, []);

  // Remove child from point
  const removeChildFromPoint = useCallback((pointIndex: number, childIndex: number) => {
    setFormData((prev) => {
      const updatedPoints = [...prev.points];
      updatedPoints[pointIndex].child = updatedPoints[pointIndex].child?.filter(
        (_, i) => i !== childIndex
      );
      return { ...prev, points: updatedPoints };
    });
  }, []);

  // Update child data
  const updateChild = useCallback((
    pointIndex: number,
    childIndex: number,
    field: keyof PointChild,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedPoints = [...prev.points];
      if (updatedPoints[pointIndex].child) {
        updatedPoints[pointIndex].child![childIndex] = {
          ...updatedPoints[pointIndex].child![childIndex],
          [field]: value,
        };
      }
      return { ...prev, points: updatedPoints };
    });
  }, []);

  // Generate URL slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  // Handle title change and auto-generate slug
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      url: generateSlug(title),
    }));
  }, [generateSlug]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      publish: "By Shilp Group",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      url: "",
      alt: "",
      points: [],
      status: "draft",
    });
    setMainImage(null);
    setMainImagePreview("");
    setPointImages({});
    setPointImagePreviews({});
    setIsCreating(false);
    setEditingBlog(null);
  }, []);

  // Create blog
  const handleCreate = useCallback(async () => {
    try {
      if (!mainImage) {
        alert("Please select a main image");
        return;
      }

      setLoading(true);
      await blogApi.createBlog(formData, {
        mainImage,
        pointImages,
      });

      setSuccessMessage("Blog created successfully!");
      setShowSuccessModal(true);
      resetForm();
      fetchBlogs();
    } catch (error: unknown) {
      console.error("Error creating blog:", error);
      alert(error instanceof Error ? error.message : "Failed to create blog");
    } finally {
      setLoading(false);
    }
  }, [mainImage, formData, pointImages, resetForm, fetchBlogs]);

  // Edit blog
  const handleEdit = useCallback((blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      publish: blog.publish,
      date: blog.date,
      url: blog.url,
      alt: blog.alt || "",
      points: blog.points,
      status: blog.status,
    });
    setMainImagePreview(blog.image);
    setIsCreating(true);
  }, []);

  // Update blog
  const handleUpdate = useCallback(async () => {
    if (!editingBlog) return;

    try {
      setLoading(true);
      await blogApi.updateBlog(
        editingBlog._id,
        formData,
        mainImage
          ? {
              mainImage,
              pointImages,
            }
          : undefined
      );

      setSuccessMessage("Blog updated successfully!");
      setShowSuccessModal(true);
      resetForm();
      fetchBlogs();
    } catch (error: unknown) {
      console.error("Error updating blog:", error);
      alert(error instanceof Error ? error.message : "Failed to update blog");
    } finally {
      setLoading(false);
    }
  }, [editingBlog, formData, mainImage, pointImages, resetForm, fetchBlogs]);

  // Delete blog
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      setLoading(true);
      await blogApi.deleteBlog(id);
      setSuccessMessage("Blog deleted successfully!");
      setShowSuccessModal(true);
      fetchBlogs();
    } catch (error: unknown) {
      console.error("Error deleting blog:", error);
      alert(error instanceof Error ? error.message : "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  }, [fetchBlogs]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600">
            Blogs Management
          </h1>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Blog
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-blue-700 font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-2">URL Slug *</label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-blue-700 font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-blue-700 font-medium mb-2">Publish By</label>
                <input
                  type="text"
                  name="publish"
                  value={formData.publish}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-2">Date</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-blue-700 font-medium mb-2">Alt Text</label>
              <input
                type="text"
                name="alt"
                value={formData.alt}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Main Image */}
            <div className="mb-6">
              <label className="block text-blue-700 font-medium mb-2">Main Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
              {mainImagePreview && (
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="mt-2 h-32 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Points Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-700">Points</h3>
                <button
                  onClick={addPoint}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md"
                >
                  Add Point
                </button>
              </div>

              {formData.points.map((point, pointIndex) => (
                <div
                  key={pointIndex}
                  className="bg-white p-4 rounded-lg mb-4 border border-blue-200 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-blue-600">
                      Point {pointIndex + 1}
                    </h4>
                    <button
                      onClick={() => removePoint(pointIndex)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-2">
                    <label className="block text-blue-700 font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={point.title}
                      onChange={(e) =>
                        updatePoint(pointIndex, "title", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-blue-700 font-medium mb-1">Subtitle</label>
                    <textarea
                      value={point.subtitle}
                      onChange={(e) =>
                        updatePoint(pointIndex, "subtitle", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-blue-700 font-medium mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePointImageChange(pointIndex, e)}
                      className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />
                    {(pointImagePreviews[pointIndex] || point.image) && (
                      <img
                        src={pointImagePreviews[pointIndex] || point.image}
                        alt="Preview"
                        className="mt-2 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Child Points */}
                  <div className="ml-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-md font-medium text-blue-600">
                        Child Points
                      </h5>
                      <button
                        onClick={() => addChildToPoint(pointIndex)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm shadow-sm"
                      >
                        Add Child
                      </button>
                    </div>

                    {point.child?.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium text-sm">
                            Child {childIndex + 1}
                          </span>
                          <button
                            onClick={() =>
                              removeChildFromPoint(pointIndex, childIndex)
                            }
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mb-2">
                          <label className="block text-blue-700 font-medium mb-1 text-sm">
                            Title
                          </label>
                          <input
                            type="text"
                            value={child.title}
                            onChange={(e) =>
                              updateChild(
                                pointIndex,
                                childIndex,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-1 bg-white border border-blue-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-blue-700 font-medium mb-1 text-sm">
                            Subtitle
                          </label>
                          <textarea
                            value={child.subtitle}
                            onChange={(e) =>
                              updateChild(
                                pointIndex,
                                childIndex,
                                "subtitle",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-1 bg-white border border-blue-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={editingBlog ? handleUpdate : handleCreate}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading
                  ? "Saving..."
                  : editingBlog
                  ? "Update Blog"
                  : "Create Blog"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Blogs List */}
        {!isCreating && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <p className="text-blue-600 font-medium">Loading blogs...</p>
            ) : blogs.length === 0 ? (
              <p className="text-gray-600">
                No blogs found. Create your first blog!
              </p>
            ) : (
              blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Success"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default BlogsPage;
