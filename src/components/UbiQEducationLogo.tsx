
const UbiQEducationLogo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 200 50" className="w-full h-full">
        <text
          x="10"
          y="35"
          fontSize="24"
          fontWeight="400"
          fill="currentColor"
          fontFamily="serif"
          style={{ fontStyle: 'italic' }}
        >
          UbiQ
        </text>
        <text
          x="80"
          y="35"
          fontSize="16"
          fontWeight="300"
          fill="currentColor"
          fontFamily="sans-serif"
        >
          Education
        </text>
        <circle cx="185" cy="25" r="8" fill="hsl(var(--accent))" />
      </svg>
    </div>
  )
}

export default UbiQEducationLogo
