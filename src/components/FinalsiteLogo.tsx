
const FinalsiteLogo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 200 50" className="w-full h-full">
        <text
          x="10"
          y="35"
          fontSize="24"
          fontWeight="600"
          fill="#0072b8"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Finalsite
        </text>
        <circle cx="185" cy="25" r="8" fill="#0072b8" />
      </svg>
    </div>
  )
}

export default FinalsiteLogo
