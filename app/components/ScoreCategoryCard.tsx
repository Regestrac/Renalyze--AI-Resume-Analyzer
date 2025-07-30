import ScoreBadge from '~/components/ScoreBadge'

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