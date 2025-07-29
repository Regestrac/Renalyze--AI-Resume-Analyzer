import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar';
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

  const upload = usePuterStore((state) => state.fs.upload)

  const navigate = useNavigate();

  const handleAnalyze = async ({ companyName, file, jobDescription, jobTitle }: FormDatatype) => {
    setIsProcessing(true);
    setStatusText('Uploading the file...');

    const uploadedFile = await upload([file])
    if (!uploadedFile) {
      return setStatusText("Error: Failed to upload file.")
    }

    setStatusText("Converting to image...")
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
      return setStatusText("Error: Failed to convert pdf to image")
    }

    setStatusText("Uploading the image...")
    const uploadedImage = await upload([imageFile.file]);
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

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className='page-heading py-16'>
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src='/images/resume-scan.gif' className='w-full' />
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
                <button type='submit' className='primary-button'>Upload</button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
};

export default Upload;