import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { getFaculties, getFacultySubjects, getTags, type Faculty, type Subject, type Tag } from '../../api/catalog.ts'
import { uploadMaterial, UploadError, type UploadStep } from '../../api/materials.ts'
import Tape from '../notebook/Tape.tsx'
import FileDropzone from './FileDropzone.tsx'

const fieldClass =
  'w-full rounded border border-outline bg-surface-container-lowest px-3.5 py-2.5 text-body-md text-ink placeholder:text-secondary transition-colors focus:border-pen focus:outline-none focus:ring-1 focus:ring-pen'

const STEP_LABELS: Record<UploadStep, string> = {
  url: 'ბმულის მომზადება...',
  storage: 'ფაილი იტვირთება...',
  confirm: 'დადასტურება...',
}

/** Turns a failed upload into a message for the user; the full error also goes to the console. */
function uploadErrorMessage(error: unknown) {
  if (!(error instanceof UploadError)) return 'რაღაც შეცდომა მოხდა. სცადე თავიდან.'

  const { step, status } = error
  if (status === undefined) {
    return step === 'storage'
      ? 'ფაილის საცავში გაგზავნა ვერ მოხერხდა (ქსელი ან S3 CORS).'
      : 'სერვერთან კავშირი ვერ დამყარდა. შეამოწმე ინტერნეტი.'
  }
  // S3 answers 403 when the link expired or the request doesn't match what it was signed for
  if (step === 'storage') {
    return status === 403
      ? 'ატვირთვის ბმული არავალიდურია ან ვადა გაუვიდა. სცადე თავიდან.'
      : 'ფაილის საცავში ატვირთვა ვერ მოხერხდა. სცადე თავიდან.'
  }
  if (status === 401 || status === 403) return 'არ ხართ შესული ან ამის უფლება არ გაქვთ.'
  if (status === 413) return 'ფაილი ძალიან დიდია.'
  if (status === 400 || status === 422) {
    return step === 'url' ? 'ეს ფაილი არ მიიღება (ტიპი ან ზომა).' : 'მონაცემები არასწორია. შეამოწმე ველები.'
  }
  if (status >= 500) return 'სერვერის შეცდომა. სცადე ცოტა ხანში.'
  return 'ატვირთვა ვერ მოხერხდა. სცადე თავიდან.'
}

function FieldLabel({ htmlFor, optional = false, children }: { htmlFor?: string; optional?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-label text-label-sm uppercase text-on-surface-variant">
      {children}{' '}
      {optional ? (
        <span className="font-normal normal-case text-secondary">(არასავალდებულო)</span>
      ) : (
        <span className="font-bold text-primary">*</span>
      )}
    </label>
  )
}

type UploadFormProps = {
  onSubmitted: () => void
}

export default function UploadForm({ onSubmitted }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [facultyId, setFacultyId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [tags, setTags] = useState<string[]>([])

  // Lists from the backend: undefined while loading
  const [faculties, setFaculties] = useState<Faculty[]>()
  const [tagOptions, setTagOptions] = useState<Tag[]>()
  const [listsFailed, setListsFailed] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(false)
  const subjectsRequest = useRef(0)

  const [step, setStep] = useState<UploadStep | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([getFaculties(), getTags()]).then(
      ([facultyList, tagList]) => {
        if (!active) return
        setFaculties(facultyList)
        setTagOptions(tagList)
      },
      (failure: unknown) => {
        console.error('[upload] could not load faculties/tags', failure)
        if (active) setListsFailed(true)
      },
    )
    return () => {
      active = false
    }
  }, [])

  const chooseFaculty = (id: string) => {
    setFacultyId(id)
    setSubjectId('')
    setSubjects([])
    if (!id) return

    // Ignore answers to older requests if the faculty is changed quickly
    const request = ++subjectsRequest.current
    setSubjectsLoading(true)
    getFacultySubjects(Number(id))
      .then(
        (list) => request === subjectsRequest.current && setSubjects(list),
        (failure: unknown) => {
          console.error('[upload] could not load subjects', failure)
          if (request === subjectsRequest.current) setError('საგნების ჩატვირთვა ვერ მოხერხდა.')
        },
      )
      .finally(() => request === subjectsRequest.current && setSubjectsLoading(false))
  }

  const toggleTag = (tag: string) =>
    setTags((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]))

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!file) return setError('მიამაგრე ფაილი.')
    if (tags.length === 0) return setError('აირჩიე მინიმუმ ერთი თაგი.')

    const fields = new FormData(form)
    const description = String(fields.get('description') ?? '').trim()

    setError(null)
    try {
      await uploadMaterial(
        file,
        {
          title: String(fields.get('title') ?? '').trim(),
          description: description || undefined,
          subjectId: Number(subjectId),
          tagNames: tags,
        },
        setStep,
      )
    } catch (failure) {
      console.error('[upload]', failure)
      setError(uploadErrorMessage(failure))
      setStep(null)
      return
    }

    setStep(null)
    form.reset()
    setFile(null)
    setFacultyId('')
    setSubjectId('')
    setSubjects([])
    setTags([])
    onSubmitted()
  }

  const submitting = step !== null

  return (
    <div className="sheet rise p-space-lg sm:p-space-xl">
      <Tape className="-top-3.5 left-1/2 w-32 -translate-x-1/2 -rotate-[1.5deg]" />

      <form onSubmit={onSubmit} className="space-y-space-lg">
        {listsFailed && (
          <p role="alert" className="rounded border border-status-rejected-border bg-status-rejected-bg px-space-md py-2.5 text-body-md text-status-rejected">
            ფაკულტეტების და თაგების ჩატვირთვა ვერ მოხერხდა. განაახლე გვერდი.
          </p>
        )}

        <div>
          <FieldLabel>ფაილის მიბმა</FieldLabel>
          <FileDropzone file={file} onChange={setFile} />
        </div>

        <div>
          <FieldLabel htmlFor="upload-title">სათაური</FieldLabel>
          <input
            id="upload-title"
            name="title"
            type="text"
            required
            placeholder="მაგ. მონაცემთა სტრუქტურები - ლექციების კონსპექტი"
            className={fieldClass}
          />
        </div>

        <div className="grid gap-space-md sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="upload-faculty">ფაკულტეტი</FieldLabel>
            <select
              id="upload-faculty"
              name="faculty"
              required
              disabled={!faculties}
              value={facultyId}
              onChange={(event) => chooseFaculty(event.target.value)}
              className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-secondary`}
            >
              <option value="">{faculties ? 'აირჩიეთ ფაკულტეტი' : 'იტვირთება...'}</option>
              {faculties?.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="upload-course">საგანი</FieldLabel>
            <select
              id="upload-course"
              name="course"
              required
              disabled={!facultyId || subjectsLoading}
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-secondary`}
            >
              <option value="">
                {!facultyId ? 'ჯერ აირჩიეთ ფაკულტეტი' : subjectsLoading ? 'იტვირთება...' : 'აირჩიეთ საგანი'}
              </option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 block font-label text-label-sm uppercase text-on-surface-variant">
            კატეგორია / თაგები <span className="font-bold text-primary">*</span>
          </legend>
          <div className="flex flex-wrap gap-space-sm">
            {!tagOptions && !listsFailed && <span className="text-body-sm text-secondary">იტვირთება...</span>}
            {tagOptions?.map(({ id, name }) => {
              const active = tags.includes(name)
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTag(name)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 font-label text-label-md transition-[background-color,border-color,color,rotate] ${
                    active
                      ? '-rotate-2 border-primary bg-sticky text-on-sticky'
                      : 'border-outline bg-surface-container-low text-on-surface-variant hover:-rotate-1 hover:border-ink hover:text-ink'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div>
          <FieldLabel htmlFor="upload-description" optional>
            აღწერა
          </FieldLabel>
          <textarea
            id="upload-description"
            name="description"
            rows={3}
            placeholder="დამატებითი დეტალები მასალის შესახებ..."
            className={`${fieldClass} bg-ruled resize-none bg-local py-0 leading-8`}
          />
        </div>

        {error && (
          <p role="alert" className="rounded border border-status-rejected-border bg-status-rejected-bg px-space-md py-2.5 text-body-md text-status-rejected">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-space-md pt-space-sm">
          {step && <span className="font-hand text-[20px] text-pen">{STEP_LABELS[step]}</span>}
          <button
            type="submit"
            disabled={submitting}
            className="btn-press flex cursor-pointer items-center gap-space-sm rounded bg-primary px-8 py-2.5 font-headline text-body-lg font-bold text-on-primary disabled:cursor-wait disabled:opacity-70"
          >
            ატვირთვა
            <span className="material-symbols-outlined text-[18px]">upload</span>
          </button>
        </div>
      </form>
    </div>
  )
}
