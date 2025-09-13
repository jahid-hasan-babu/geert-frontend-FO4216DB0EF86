"use client";

import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

interface CourseFilterProps {
  filters: string[];
  activeFilter: string;
  onChange: (filter: string) => void;
}

export default function CourseFilter({
  filters,
  activeFilter,
  onChange,
}: CourseFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <TranslateInitializer />
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`text-sm lg:text-base px-3 lg:px-6 py-1 lg:py-3 rounded-full font-medium transition-colors duration-200 cursor-pointer font-sans capitalize ${
            activeFilter === filter
              ? "bg-[#3399CC] text-white"
              : "bg-[#EBF5FA] text-[#404040]"
          }`}
          data-translate
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
