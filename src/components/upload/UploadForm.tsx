import { useState, type FormEvent, type ReactNode } from 'react'
import { MOCK_FACULTIES } from '../../mocks/faculties.ts'
import { MATERIAL_TAGS, type MaterialTag } from '../../mocks/materials.ts'
import Tape from '../notebook/Tape.tsx'
import FileDropzone from './FileDropzone.tsx'

const fieldClass =
  'w-full rounded border border-outline bg-surface-container-lowest px-3.5 py-2.5 text-body-md text-ink placeholder:text-secondary transition-colors focus:border-pen focus:outline-none focus:ring-1 focus:ring-pen'

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
  const [tags, setTags] = useState<MaterialTag[]>([])

  const courses = MOCK_FACULTIES.find((f) => f.id === facultyId)?.courses ?? []

  const toggleTag = (tag: MaterialTag) =>
    setTags((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]))

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.currentTarget.reset()
    setFile(null)
    setFacultyId('')
    setTags([])
    onSubmitted()
  }

  return (
    <div className="sheet rise p-space-lg sm:p-space-xl">
      <Tape className="-top-3.5 left-1/2 w-32 -translate-x-1/2 -rotate-[1.5deg]" />

      <form onSubmit={onSubmit} className="space-y-space-lg">
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
              value={facultyId}
              onChange={(event) => setFacultyId(event.target.value)}
              className={fieldClass}
            >
              <option value="">აირჩიეთ ფაკულტეტი</option>
              {MOCK_FACULTIES.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="upload-course">საგანი</FieldLabel>
            <select
              key={facultyId}
              id="upload-course"
              name="course"
              required
              disabled={!facultyId}
              className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-secondary`}
            >
              <option value="">{facultyId ? 'აირჩიეთ საგანი' : 'ჯერ აირჩიეთ ფაკულტეტი'}</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
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
            {MATERIAL_TAGS.map((tag) => {
              const active = tags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTag(tag)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 font-label text-label-md transition-[background-color,border-color,color,rotate] ${
                    active
                      ? '-rotate-2 border-primary bg-sticky text-on-sticky'
                      : 'border-outline bg-surface-container-low text-on-surface-variant hover:-rotate-1 hover:border-ink hover:text-ink'
                  }`}
                >
                  {tag}
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

        <div className="flex justify-end pt-space-sm">
          <button
            type="submit"
            className="btn-press flex cursor-pointer items-center gap-space-sm rounded bg-primary px-8 py-2.5 font-headline text-body-lg font-bold text-on-primary"
          >
            ატვირთვა
            <span className="material-symbols-outlined text-[18px]">upload</span>
          </button>
        </div>
      </form>
    </div>
  )
}
