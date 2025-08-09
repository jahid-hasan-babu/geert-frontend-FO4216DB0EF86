interface CourseFilterProps {
  filters: string[]
  activeFilter: string
  onChange: (filter: string) => void
}

export default function CourseFilter({ filters, activeFilter, onChange }: CourseFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 cursor-pointer ${
            activeFilter === filter ? "bg-[#3399CC] text-white" : "bg-[#EBF5FA] text-[#404040]"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
