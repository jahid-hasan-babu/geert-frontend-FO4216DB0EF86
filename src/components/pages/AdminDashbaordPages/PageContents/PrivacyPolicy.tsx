"use client";

import React, { useEffect, useState } from "react";
import {
  useGetLegalDataQuery,
  usePostLegalDataMutation,
} from "@/redux/features/legal/legalApi";
import { toast } from "sonner";
import Editor from "@/components/ui/Editor/Editor";

const PrivacyPolicy = () => {
  // ✅ Fetch legal data
  const { data, isLoading, isError } = useGetLegalDataQuery(undefined);
  const [postLegalData, { isLoading: isPosting }] = usePostLegalDataMutation();
  console.log("Data fetched:", data);

  const [privacyPolicy, setPrivacyPolicy] = useState("");

  // ✅ Set fetched data into editor state
  useEffect(() => {
    if (data?.privacyPolicy) {
      setPrivacyPolicy(data.privacyPolicy);
    }
  }, [data]);

  // ✅ Save handler
  const handleSave = async () => {
    try {
      await postLegalData({
        privacyPolicy,
        termsOfService: data?.termsOfService || "",
        cookiePolicy: data?.cookiePolicy || "",
        regularityInfo: data?.regularityInfo || "",
      }).unwrap();
      toast.success("Privacy Policy updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Privacy Policy");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-600">Failed to load data.</div>;

  return (
    <div className="bg-white p-6 space-y-4">
      <h2 className="text-xl font-semibold">Privacy Policy</h2>

      <div
        className="prose max-w-none border p-4 rounded bg-gray-50"
        dangerouslySetInnerHTML={{ __html: data?.privacyPolicy || "" }}
      />

      <div className="text-xl mt-4">Edit Privacy Policy:</div>

      <Editor
        contents={privacyPolicy}
        onSave={(content) => setPrivacyPolicy(content)}
        onBlur={() => {}}
      />

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

export default PrivacyPolicy;
