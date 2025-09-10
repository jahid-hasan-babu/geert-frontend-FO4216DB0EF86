"use client";

import React, { useEffect, useState } from "react";
import {
  useGetLegalDataQuery,
  usePostLegalDataMutation,
} from "@/redux/features/legal/legalApi";
import { toast } from "sonner";
import Editor from "@/components/ui/Editor/Editor";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

const RegulatoryInfoEditor = () => {
  // ✅ Fetch legal data
  const { data, isLoading, isError } = useGetLegalDataQuery(undefined);
  const [postLegalData, { isLoading: isPosting }] = usePostLegalDataMutation();

  const [regulatoryInfo, setRegulatoryInfo] = useState("");

  // ✅ Load from API into editor
  useEffect(() => {
    if (data?.regularityInfo) {
      setRegulatoryInfo(data.regularityInfo);
    }
  }, [data]);

  // ✅ Save handler
  const handleSave = async () => {
    try {
      await postLegalData({
        privacyPolicy: data?.privacyPolicy || "",
        termsOfService: data?.termsOfService || "",
        cookiePolicy: data?.cookiePolicy || "",
        regularityInfo: regulatoryInfo,
      }).unwrap();

      toast.success("Regulatory Info updated successfully!");
      setRegulatoryInfo(""); // ✅ clear editor after save
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Regulatory Info");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-600">Failed to load data.</div>;

  return (
    <div className="bg-white p-6 space-y-4">
      <TranslateInitializer/>
      <h2 className="text-xl font-semibold" data-translate>Regulatory Info</h2>

      {/* ✅ Render HTML from API */}
      <div
        className="prose max-w-none border p-4 rounded bg-gray-50"
        dangerouslySetInnerHTML={{ __html: data?.regularityInfo || "" }}
      />

      <div className="text-xl mt-4" data-translate>Edit Regulatory Info:</div>

      <Editor
        contents={regulatoryInfo}
        onSave={(content) => setRegulatoryInfo(content)}
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

export default RegulatoryInfoEditor;
