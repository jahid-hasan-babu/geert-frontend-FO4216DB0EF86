"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/category/all-category`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data.data.data || []);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.warning("Category name cannot be empty");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/category/create-category`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) => [...prev, res.data.data]);
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  // Start editing
  const handleEditClick = (category: Category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim() || !editCategoryId) {
      toast.warning("Category name cannot be empty");
      return;
    }
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/category/update-category/${editCategoryId}`,
        { name: editCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editCategoryId ? { ...cat, name: res.data.data.name } : cat
        )
      );
      setEditCategoryId(null);
      setEditCategoryName("");
      toast.success("Category updated successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button
          onClick={handleAddCategory}
          className="bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer"
        >
          Add
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              {editCategoryId === category.id ? (
                <>
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex gap-2 ml-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateCategory}
                      className="bg-[#3399CC] hover:bg-[#52b9ec]"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditCategoryId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span>{category.name}</span>
                  <Button
                    size="sm"
                    className="bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer"
                    onClick={() => handleEditClick(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
