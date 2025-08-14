
import { Search } from "lucide-react"

interface CourseSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function CourseSearch({ value, onChange }: CourseSearchProps) {
  return (
    <div className="relative w-full lg:w-auto">
      <input
        type="text"
        placeholder="Search courses..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full lg:w-64"
      />
      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  )
}
