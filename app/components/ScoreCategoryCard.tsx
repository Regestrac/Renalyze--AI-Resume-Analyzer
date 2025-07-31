import { cn } from "~/lib/utils";

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
    <span className={cn('inline-block px-2 py-1 rounded-full text-xs font-semibold', badgeClasses)}>
      {label}
    </span>
  )
}

const ScoreCategoryCard = ({ title, score }: { title: string; score: number; }) => {
  const textColor = score > 70 ? 'text-green-600' : score > 49 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className='resume-summary'>
      <div className='category'>
        <div className='flex flex-row items-center space-x-2 justify-center'>
          <p className='text-2xl'>{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className='text-2xl'>
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  )
};

export default ScoreCategoryCard;