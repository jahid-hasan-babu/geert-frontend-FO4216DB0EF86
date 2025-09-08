"use client";

import React, { useEffect, useState } from "react";
import {
  useGetLegalDataQuery,
  usePostLegalDataMutation,
} from "@/redux/features/legal/legalApi";
import { toast } from "sonner";
import Editor from "@/components/ui/Editor/Editor";

const TermsOfServiceEditor = () => {
  // ✅ Fetch legal data
  const { data, isLoading, isError } = useGetLegalDataQuery(undefined);
  const [postLegalData, { isLoading: isPosting }] = usePostLegalDataMutation();

  const [termsOfService, setTermsOfService] = useState("");

  // ✅ Load existing Terms of Service from API
  useEffect(() => {
    if (data?.termsOfService) {
      setTermsOfService(data.termsOfService);
    }
  }, [data]);

  // ✅ Save handler
  const handleSave = async () => {
    try {
      await postLegalData({
        privacyPolicy: data?.privacyPolicy || "",
        termsOfService, // ✅ correct field
        cookiePolicy: data?.cookiePolicy || "",
        regularityInfo: data?.regularityInfo || "",
      }).unwrap();

      toast.success("Terms of Service updated successfully!");
      setTermsOfService(""); // ✅ clear editor after save
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Terms of Service");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-600">Failed to load data.</div>;

  return (
    <div className="bg-white p-6 space-y-4">
      <h2 className="text-xl font-semibold">Terms of Service</h2>

      {/* ✅ Render HTML safely */}
      <div
        className="prose max-w-none border p-4 rounded bg-gray-50"
        dangerouslySetInnerHTML={{ __html: data?.termsOfService || "" }}
      />

      <div className="text-xl mt-4">Edit Terms of Service:</div>

      {/* ✅ Rich Text Editor */}
      <Editor
        contents={termsOfService}
        onSave={(content) => setTermsOfService(content)}
        onBlur={() => {}}
      />

      {/* ✅ Save button */}
      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded ${
          isPosting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={handleSave}
        disabled={isPosting}
      >
        {isPosting ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default TermsOfServiceEditor;
