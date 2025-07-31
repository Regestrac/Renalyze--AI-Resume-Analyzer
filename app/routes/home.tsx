import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Renalyze" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const auth = usePuterStore((state) => state.auth);
  const kv = usePuterStore((state) => state.kv);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      const resumes = await kv.list('resume:*', true) as KVItem[];
      const parsedResumes = resumes.map((resume) => JSON.parse(resume.value));
      setResumes(parsedResumes);
      setIsLoading(false);
    }
    loadResumes();
  }, [])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section pb-12">
        <div className="page-heading py-10">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!isLoading && resumes.length > 0 ? (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          ) : (
            <h2>No resumes found. Start by uploading your resume.</h2>
          )}
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" alt="Loading" className="w-[200px]" />
          </div>
        ) : null}
        {!isLoading && resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 mt-10">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        ) : null}
        {!isLoading && resumes.length > 0 ? (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard resume={resume} key={resume.id} onDelete={(id) => {
                setResumes(prev => prev.filter(r => r.id !== id));
              }} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
