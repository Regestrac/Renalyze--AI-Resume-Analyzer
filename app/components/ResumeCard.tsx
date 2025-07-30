import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, companyName, jobTitle, imagePath, feedback } = resume;

  const [resumeUrl, setResumeUrl] = useState('');

  const fs = usePuterStore((state) => state.fs);

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setResumeUrl(url)
    }

    loadResume();
  }, [imagePath])

  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName ? <h2 className="!text-black font-bold break-words">{companyName}</h2> : null}
          {jobTitle ? <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3> : null}
          {!companyName && !jobTitle ? <h2 className="!text-black font-bold break-words">Resume</h2> : null}
        </div>
        <div className="flex-shrink-0">
          {feedback?.overallScore || 0}/100
        </div>
      </div>
      {resumeUrl ? (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="Resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      ) : null}
    </Link>
  )
}

export default ResumeCard;