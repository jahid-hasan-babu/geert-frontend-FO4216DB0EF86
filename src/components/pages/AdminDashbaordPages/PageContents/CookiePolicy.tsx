"use client";

import React, { useEffect, useState } from "react";
import {
  useGetLegalDataQuery,
  usePostLegalDataMutation,
} from "@/redux/features/legal/legalApi";
import { toast } from "sonner";
import Editor from "@/components/ui/Editor/Editor";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

const CookiePolicyEditor = () => {

  // ✅ Fetch legal data
  const { data, isLoading, isError } = useGetLegalDataQuery(undefined);
  const [postLegalData, { isLoading: isPosting }] = usePostLegalDataMutation();

  const [cookiePolicy, setCookiePolicy] = useState("");

  // ✅ Load existing Cookie Policy from API
  useEffect(() => {
    if (data?.cookiePolicy) {
      setCookiePolicy(data.cookiePolicy);
    }
  }, [data]);

  // ✅ Save handler
  const handleSave = async () => {
    try {
      await postLegalData({
        privacyPolicy: data?.privacyPolicy || "",
        termsOfService: data?.termsOfService || "",
        cookiePolicy,
        regularityInfo: data?.regularityInfo || "",
      }).unwrap();
      toast.success(<span data-translate>Cookie Policy updated successfully!</span>);

      setCookiePolicy(""); // ✅ clear editor after save
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Cookie Policy");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-600">Failed to load data.</div>;

  return (
    <div className="bg-white p-6 space-y-4">
      <TranslateInitializer />
      <h2 className="text-xl font-semibold" data-translate>
        Cookie Policy
      </h2>

      {/* ✅ Render current Cookie Policy */}
      <div
        className="prose max-w-none border p-4 rounded bg-gray-50"
        dangerouslySetInnerHTML={{ __html: data?.cookiePolicy || "" }}
      />

      <div className="text-xl mt-4" data-translate>
        Edit Cookie Policy:
      </div>

      {/* ✅ Rich Text Editor */}
      <Editor
        contents={cookiePolicy}
        onSave={(content) => setCookiePolicy(content)}
        onBlur={() => {}}
      />

      {/* ✅ Save button */}
      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded ${
          isPosting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={handleSave}
        disabled={isPosting}
        data-translate
      >
        {isPosting ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default CookiePolicyEditor;
