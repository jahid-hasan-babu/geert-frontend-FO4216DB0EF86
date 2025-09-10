"use client";

import React, { useEffect, useState } from "react";
import {
  useGetHelpSupportQuery,
  useCreateHelpSupportMutation,
} from "@/redux/features/legal/legalApi"; 
import { toast } from "sonner";
import Editor from "@/components/ui/Editor/Editor";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

const HelpSupport = () => {
  const { data, isLoading, isError } = useGetHelpSupportQuery(undefined);
  console.log("Data fetched:", data);
  const [createHelpSupport, { isLoading: isPosting }] =
    useCreateHelpSupportMutation();

  const [helpSupport, setHelpSupport] = useState("");

  useEffect(() => {
    if (data?.data?.length > 0) {
      setHelpSupport(data.data[0].description);
    }
  }, [data]);

  // ✅ Save handler
  const handleSave = async () => {
    try {
      await createHelpSupport({ description: helpSupport }).unwrap();
      toast.success("Help & Support updated successfully!");
      setHelpSupport("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Help & Support");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-600">Failed to load data.</div>;

  return (
    <div className="bg-white p-6 space-y-4">
      <TranslateInitializer/>
      <h2 className="text-xl font-semibold" data-translate>Help & Support</h2>

      {/* ✅ Show current help-support description */}
      <div
        className="prose max-w-none border p-4 rounded bg-gray-50"
        dangerouslySetInnerHTML={{
          __html: data?.data?.[0]?.description || "No Help & Support info yet.",
        }}
      />

      <div className="text-xl mt-4" data-translate>Edit Help & Support:</div>

      {/* ✅ Rich Text Editor */}
      <Editor
        contents={helpSupport}
        onSave={(content) => setHelpSupport(content)}
        onBlur={() => {}}
      />
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

export default HelpSupport;
