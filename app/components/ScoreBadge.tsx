const ScoreBadge = ({ score }: { score: number }) => {
  // Determine background and text color based on score
  const badgeClasses =
    score > 70
      ? 'bg-green-100 text-green-700'
      : score > 49
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700'

  // Map score to label
  const label = score > 90 ? 'Excellent' : score > 70 ? 'Good' : score > 49 ? 'Average' : 'Poor'

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${badgeClasses}`}
    >
      {label}
    </span>
  )
}

export default ScoreBadge;
