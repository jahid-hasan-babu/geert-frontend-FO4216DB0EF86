"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
  useGetCoursesCategoryQuery,
  useAddCourseCategoryMutation,
  useEditCourseCategoryMutation,
  useDeleteCourseCategoryMutation,
} from "@/redux/features/users&category/usersCategoryApi";
import { useTranslate } from "@/hooks/useTranslate";

interface Category {
  id: string;
  name: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { translateBatch } = useTranslate();
  const lang = localStorage.getItem("selectedLanguage") || "en";

  const { data, isLoading } = useGetCoursesCategoryQuery({});
  const [addCategory, { isLoading: isAdding }] = useAddCourseCategoryMutation();
  const [editCategory, { isLoading: isEditing }] = useEditCourseCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCourseCategoryMutation();

  useEffect(() => {
    if (data?.data) {
      setCategories(data?.data?.data);
    }
  }, [data]);

  // Add category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      const [msg] = await translateBatch(["Please enter a category name"], lang);
      toast.error(msg);
      return;
    }

    try {
      await addCategory(newCategory.trim()).unwrap();
      setNewCategory("");

      const [msg] = await translateBatch(["Category added successfully"], lang);
      toast.success(msg);
    } catch (error) {
      const [msg] = await translateBatch(["Failed to add category"], lang);
      toast.error(msg);
      console.error("Add category error:", error);
    }
  };

  // Edit category
  const handleEditClick = (category: Category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      const [msg] = await translateBatch(["Please enter a category name"], lang);
      toast.error(msg);
      return;
    }

    try {
      await editCategory({
        id: editCategoryId,
        name: editCategoryName.trim(),
      }).unwrap();
      setEditCategoryId(null);
      setEditCategoryName("");

      const [msg] = await translateBatch(["Category updated successfully"], lang);
      toast.success(msg);
    } catch (error) {
      const [msg] = await translateBatch(["Failed to update category"], lang);
      toast.error(msg);
      console.error("Update category error:", error);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteCategory(deleteConfirmId).unwrap();
      setDeleteConfirmId(null);

      const [msg] = await translateBatch(["Category deleted successfully"], lang);
      toast.success(msg);
    } catch (error) {
      const [msg] = await translateBatch(["Failed to delete category"], lang);
      toast.error(msg);
      console.error("Delete category error:", error);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6" data-translate>
        Category Management
      </h1>

      {/* Add new category */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
        />
        <Button
          onClick={handleAddCategory}
          disabled={isAdding}
          className="bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer"
          data-translate
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
        </Button>
      </div>

      {/* Categories list */}
      {isLoading ? (
        <div className="flex justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <div className="space-y-2">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              {editCategoryId === category.id ? (
                <>
                  <Input
                    data-translate
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateCategory()}
                    className="flex-1"
                  />
                  <div className="flex gap-2 ml-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateCategory}
                      disabled={isEditing}
                      className="bg-[#3399CC] hover:bg-[#52b9ec]"
                      data-translate
                    >
                      {isEditing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditCategoryId(null)}
                      disabled={isEditing}
                      data-translate
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer"
                      onClick={() => handleEditClick(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteConfirmId(category.id)}
                      className="cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4" data-translate>
              Confirm Delete
            </h2>
            <p className="text-sm mb-6" data-translate>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                data-translate
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                data-translate
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
