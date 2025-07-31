import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/shared/FileUploader';
import Navbar from '~/components/Navbar';
import { prepareInstructions } from '~/constants';
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';

type FormDatatype = {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const fs = usePuterStore((state) => state.fs)
  const kv = usePuterStore((state) => state.kv)
  const ai = usePuterStore((state) => state.ai)

  const navigate = useNavigate();

  let timeout: ReturnType<typeof setTimeout>;

  const handleAnalyze = async ({ companyName, file, jobDescription, jobTitle }: FormDatatype) => {
    try {
      setIsProcessing(true);
      setStatusText('Uploading the file...');

      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) {
        return setStatusText("Error: Failed to upload file.")
      }

      setStatusText("Converting to image...")
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) {
        return setStatusText("Error: Failed to convert pdf to image")
      }

      setStatusText("Uploading the image...")
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) {
        return setStatusText("Error: Failed to upload image")
      }

      setStatusText("Preparing data...")
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: '',
      }
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing...");

      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );
      if (!feedback) {
        return setStatusText('Error: Failed to analyze resume');
      }
      if (feedback?.message?.stop_reason === "max_token") {
        throw new Error('Token limit exceeded for your free tier!')
      }
      const feedbackText = typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0].text;

      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analysis complete, redirecting...");
      navigate(`/resume/${uuid}`);
    } catch (err) {
      console.error('err: ', err);
      setStatusText(((err as any)?.error?.message || (err as any)?.error) + '. Navigating...');
      timeout = setTimeout(() => {
        navigate('/');
      }, 5000);
    }
  }

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const form = event.currentTarget.closest('form');
    if (!form) { return; }
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) { return; }

    handleAnalyze({ companyName, jobTitle, jobDescription, file })
  };

  useEffect(() => () => {
    clearTimeout(timeout);
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className='page-heading py-12'>
          <h1 className='w-full'>Smart Feedback For Your Dream Job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src='/images/resume-scan.gif' className='w-full max-md:mt-0! sm:w-[80%]' style={{ marginTop: -150 }} />
            </>
          ) : (
            <>
              <h2>Drop your resume for an ATS score and improvement tips</h2>
              <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                <div className='form-div'>
                  <label htmlFor='company-name'>Company Name</label>
                  <input type="text" name='company-name' placeholder='Company Name' id='company-name' />
                </div>
                <div className='form-div'>
                  <label htmlFor='job-title'>Job Title</label>
                  <input type="text" name='job-title' placeholder='Job Title' id='job-title' />
                </div>
                <div className='form-div'>
                  <label htmlFor='job-description'>Job Description</label>
                  <textarea rows={5} name='job-description' placeholder='Job Description' id='job-description' />
                </div>
                <div className='form-div'>
                  <label htmlFor='uploader'>Upload Resume</label>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>
                <button type='submit' className='primary-button'>Analyze</button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
};

export default Upload;