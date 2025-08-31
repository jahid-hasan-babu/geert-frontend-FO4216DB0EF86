"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { LoadingOutlined } from '@ant-design/icons';
import {
	useGetCoursesCategoryQuery,
	useAddCourseCategoryMutation,
	useEditCourseCategoryMutation,
} from "@/redux/features/users&category/usersCategoryApi";
import { Spin } from "antd";

interface Category {
	id: string;
	name: string;
}

const CategoryPage = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [newCategory, setNewCategory] = useState("");
	const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
	const [editCategoryName, setEditCategoryName] = useState("");

	const { data, isLoading } = useGetCoursesCategoryQuery({});
	const [addCategory, { isLoading: isAdding }] = useAddCourseCategoryMutation();
	const [editCategory, { isLoading: isEditing }] =
		useEditCourseCategoryMutation();

	useEffect(() => {
		if (data?.data) {
			setCategories(data?.data?.data);
		}
	}, [data]);

	const handleAddCategory = async () => {
		if (!newCategory.trim()) {
			toast.error("Please enter a category name");
			return;
		}

		try {
			await addCategory(newCategory.trim()).unwrap();
			setNewCategory("");
			toast.success("Category added successfully");
		} catch (error) {
			toast.error("Failed to add category");
			console.error("Add category error:", error);
		}
	};

	// Start editing
	const handleEditClick = (category: Category) => {
		setEditCategoryId(category.id);
		setEditCategoryName(category.name);
	};

	const handleUpdateCategory = async () => {
		if (!editCategoryName.trim()) {
			toast.error("Please enter a category name");
			return;
		}

		try {
			await editCategory({
				id: editCategoryId,
				name: editCategoryName.trim(),
			}).unwrap();
			setEditCategoryId(null);
			setEditCategoryName("");
			toast.success("Category updated successfully");
		} catch (error) {
			toast.error("Failed to update category");
			console.error("Update category error:", error);
		}
	};

	return (
		<div className="p-6 bg-white min-h-screen">
			<h1 className="text-2xl font-bold mb-6">Category Management</h1>

			{/* Add new category */}
			<div className="flex gap-2 mb-6">
				<Input
					placeholder="Enter new category"
					value={newCategory}
					onChange={(e) => setNewCategory(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
				/>
				<Button
					onClick={handleAddCategory}
					disabled={isAdding}
					className="bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer"
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
										value={editCategoryName}
										onChange={(e) => setEditCategoryName(e.target.value)}
										onKeyPress={(e) =>
											e.key === "Enter" && handleUpdateCategory()
										}
										className="flex-1"
									/>
									<div className="flex gap-2 ml-2">
										<Button
											size="sm"
											onClick={handleUpdateCategory}
											disabled={isEditing}
											className="bg-[#3399CC] hover:bg-[#52b9ec]"
										>
											{isEditing ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												"Save"
											)}
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => setEditCategoryId(null)}
											disabled={isEditing}
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
