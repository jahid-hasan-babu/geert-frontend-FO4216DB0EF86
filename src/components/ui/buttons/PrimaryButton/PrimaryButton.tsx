type Props = {
  label: string
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
  translate?: boolean // new prop for data-translate
}

export default function PrimaryButton({
  label,
  onClick,
  className = "",
  type = "button",
  translate = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-[#3399CC] text-white px-4 lg:px-8 py-2 lg:py-4 text-sm lg:text-lg rounded-full font-semibold transition-colors duration-200 shadow-lg cursor-pointer ${className}`}
      {...(translate ? { "data-translate": true } : {})} // add data-translate if translate is true
    >
      {label}
    </button>
  )
}
