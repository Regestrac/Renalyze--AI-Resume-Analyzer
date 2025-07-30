import React from 'react'
import { cn } from '~/lib/utils'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent
} from '~/components/Accordion'

interface Tip {
  type: 'good' | 'improve'
  tip: string
  explanation: string
}

interface Feedback {
  toneAndStyle: {
    score: number
    tips: Tip[]
  }
  content: {
    score: number
    tips: Tip[]
  }
  structure: {
    score: number
    tips: Tip[]
  }
  skills: {
    score: number
    tips: Tip[]
  }
}

interface DetailsProps {
  feedback: Feedback
}

// ScoreBadge component
const ScoreBadge = ({ score }: { score: number }) => {
  const badgeClasses = cn(
    'inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold',
    score > 69
      ? 'bg-green-100 text-green-700'
      : score > 39
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700'
  )

  const icon = score > 69
    ? '/icons/check.svg'
    : score > 39
      ? '/icons/warning.svg'
      : '/icons/cross.svg'

  return (
    <div className={badgeClasses}>
      <img src={icon} alt="score" className="w-3 h-3 mr-1" />
      {score}/100
    </div>
  )
}

// CategoryHeader component
const CategoryHeader = ({ tips }: { tips: Tip[] }) => {
  return (
    <div className="space-y-4">
      {/* Tips grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-2">
            <img
              src={tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'}
              alt={tip.type}
              className="w-4 h-4 mt-0.5 flex-shrink-0"
            />
            <p className={cn(
              'text-sm',
              tip.type === 'good' ? 'text-green-700' : 'text-yellow-700'
            )}>
              {tip.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Explanation boxes */}
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              'p-3 rounded-lg text-sm',
              tip.type === 'good'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            )}
          >
            <p className="font-medium mb-1">{tip.tip}</p>
            <p className="text-xs opacity-90">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const Details = ({ feedback }: DetailsProps) => {
  if (!feedback) return null

  const sections = [
    {
      id: 'tone-and-style',
      title: 'Tone and Style',
      data: feedback.toneAndStyle
    },
    {
      id: 'content',
      title: 'Content',
      data: feedback.content
    },
    {
      id: 'structure',
      title: 'Structure',
      data: feedback.structure
    },
    {
      id: 'skills',
      title: 'Skills',
      data: feedback.skills
    }
  ]

  return (
    <div className="w-full space-y-4">
      <Accordion allowMultiple>
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            id={section.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <AccordionHeader
              itemId={section.id}
              className="hover:bg-gray-50 px-4 py-3 border-b border-gray-100"
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-gray-800">
                  {section.title}
                </h3>
                <ScoreBadge score={section.data.score} />
              </div>
            </AccordionHeader>
            <AccordionContent
              itemId={section.id}
              className="px-4 py-4"
            >
              <CategoryHeader tips={section.data.tips} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Details