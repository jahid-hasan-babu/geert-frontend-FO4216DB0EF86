"use client";

import React, { useState, useEffect } from "react";
import {
  useGetHomeDataQuery,
  usePostHomeDataMutation,
} from "@/redux/features/legal/legalApi";
import { Toaster, toast } from "sonner";

const HomePage = () => {
  const { data, isLoading } = useGetHomeDataQuery(undefined);
  const [postHomeData, { isLoading: isPosting }] = usePostHomeDataMutation();

  const [formData, setFormData] = useState({ header: "", title: "" });

  useEffect(() => {
    if (data) {
      setFormData({ header: data.header, title: data.title });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      await postHomeData(formData).unwrap();
      toast.success("Home data saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 space-y-4">
      {/* Sonner Toaster */}
      <Toaster position="top-right" richColors />

      <h2 className="text-xl font-semibold" data-translate>
        Home Page Header and Title Management
      </h2>

      <div>
        <label className="block font-medium mb-1" data-translate>
          Header
        </label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={formData.header}
          onChange={(e) => setFormData({ ...formData, header: e.target.value })}
        />
      </div>

      <div>
        <label className="block font-medium mb-1" data-translate>
          Title
        </label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded cursor-pointer ${
          isPosting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSubmit}
        disabled={isPosting}
        data-translate
      >
        {isPosting ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default HomePage;
