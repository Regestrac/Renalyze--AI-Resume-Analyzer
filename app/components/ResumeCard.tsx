import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import ScoreCircle from "./ScoreCircle";
import ConfirmationModal from "./shared/ConfirmationModal";

const ResumeCard = ({ resume, onDelete }: { resume: Resume; onDelete: (id: string) => void }) => {
  const { id, companyName, jobTitle, imagePath, feedback, resumePath } = resume;

  const [resumeUrl, setResumeUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fs = usePuterStore((state) => state.fs);
  const kv = usePuterStore((state) => state.kv);

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setResumeUrl(url)
    }

    loadResume();
  }, [imagePath])

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      // Delete files from FS
      if (imagePath) {
        await fs.delete(imagePath);
      }
      if (resumePath) {
        await fs.delete(resumePath);
      }

      // Delete from KV store
      if (id) {
        await kv.delete(`resume:${id}`);
        // Remove from UI
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="resume-card animate-in fade-in duration-1000 relative group">
        <Link to={`/resume/${id}`} className="block">
          <div className="resume-card-header">
            <div className="flex flex-col gap-2 w-full">
              {companyName ? <h2 className="!text-black font-bold break-words">{companyName}</h2> : null}
              {jobTitle ? <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3> : null}
              {!companyName && !jobTitle ? <h2 className="!text-black font-bold break-words">Resume</h2> : null}
            </div>
            <div className="flex-shrink-0">
              <ScoreCircle score={feedback?.overallScore || 0} />
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

        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 z-10 cursor-pointer md:opacity-0 group-hover:opacity-100"
          aria-label="Delete resume"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        heading="Delete Resume"
        description="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default ResumeCard;