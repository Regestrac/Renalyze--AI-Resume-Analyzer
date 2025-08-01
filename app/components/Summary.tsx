import ScoreCategoryCard from './ScoreCategoryCard';
import ScoreGauge from './ScoreGauge';

const Summary = ({ feedback }: { feedback: Feedback | null; }) => {
  return (
    <div className='bg-white rounded-2xl shadow-md w-full'>
      <div className='flex flex-row items-center p-4 gap-8'>
        <ScoreGauge score={feedback?.overallScore || 0} />

        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl font-bold'>Your Resume Score</h2>
          <p className='text-sm text-gray-500'>
            This score is calculated base on the variables listed below
          </p>
        </div>
      </div>

      <ScoreCategoryCard title='Tone & Style' score={feedback?.toneAndStyle.score || 0} />
      <ScoreCategoryCard title='Content' score={feedback?.content.score || 0} />
      <ScoreCategoryCard title='Structure' score={feedback?.structure.score || 0} />
      <ScoreCategoryCard title='Skills' score={feedback?.skills.score || 0} />
    </div>
  )
}

export default Summary