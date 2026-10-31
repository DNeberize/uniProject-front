import { useState } from 'react'
import PageContainer from '../components/layout/PageContainer.tsx'
import StickyNote from '../components/notebook/StickyNote.tsx'
import UploadForm from '../components/upload/UploadForm.tsx'

export default function UploadPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <PageContainer title="მასალის ატვირთვა">
      <p className="mt-space-md font-hand text-[22px] font-semibold text-pen">გაუზიარე ცოდნა და ჩანაწერები თანაკურსელებს ✍️</p>

      <div className="max-w-5xl">
        {submitted && (
          <div
            role="status"
            className="rise mt-space-lg flex items-center gap-2.5 rounded-md border border-status-approved-border bg-status-approved-bg px-space-md py-3 text-status-approved"
          >
            <span className="material-symbols-outlined text-[20px]">check</span>
            <span className="font-label text-label-md">მასალა წარმატებით აიტვირთა და ელოდება მოდერატორის დადასტურებას.</span>
          </div>
        )}

        <div className="mt-space-xl grid items-start gap-space-xl lg:grid-cols-12">
          <div className="lg:col-span-8">
            <UploadForm onSubmitted={() => setSubmitted(true)} />
          </div>

          <div className="flex justify-center lg:col-span-4 lg:justify-start lg:pt-space-lg">
            <StickyNote className="w-full max-w-[280px] rotate-[1.5deg]">
              <p className="font-hand text-[22px] font-bold leading-snug text-pen">
                📌 ატვირთვის შემდეგ მასალა მოდერატორის დადასტურებას ელოდება.
              </p>
              <p className="mt-space-md border-t border-on-sticky/20 pt-3 font-hand text-[18px]">~ SANGU Moderation Team</p>
            </StickyNote>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
