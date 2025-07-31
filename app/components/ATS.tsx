type SuggestionType = {
  type: 'good' | 'improve'
  tip: string
}

type ATSPropsType = {
  score: number
  suggestions: SuggestionType[]
}

const ATS = ({ score, suggestions }: ATSPropsType) => {
  // Determine gradient background based on score
  const gradientBg = score > 69
    ? 'from-green-100'
    : score > 49
      ? 'from-yellow-100'
      : 'from-red-100'

  // Determine icon based on score
  const icon = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg'

  return (
    <div className={`bg-gradient-to-b ${gradientBg} to-white p-6 rounded-xl shadow-lg`}>
      {/* Top section with icon, score, and description */}
      <div className="flex items-start space-x-4 mb-6">
        <img src={icon} alt="ATS Status" className="w-12 h-12 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ATS Score: {score}/100</h2>
          <p className="text-gray-600 mt-2">
            This score indicates how well your resume matches the requirements for this position.
          </p>
        </div>
      </div>

      {/* Subtitle and explanation */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Improve Your ATS Score</h3>
      <p className="text-gray-600 mb-6">
        Our analysis shows several areas where your resume can be optimized to better match job requirements.
      </p>

      {/* Suggestions list */}
      <div className="space-y-4 mb-6">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start space-x-3">
            <img
              src={suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'}
              alt={suggestion.type}
              className="w-5 h-5 mt-0.5 flex-shrink-0"
            />
            <p className={suggestion.type === 'good' ? 'text-green-600' : 'text-yellow-600'}>
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Closing line */}
      <p className="text-gray-700 font-medium">
        Keep refining your resume to increase your chances of landing interviews!
      </p>
    </div>
  )
}

export default ATS