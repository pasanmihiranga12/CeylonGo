import { Link } from 'react-router-dom'
import { BadgeCheck, Languages } from 'lucide-react'
import StarRating from './StarRating'
import SmartImage from './SmartImage'
import { guideImagePath } from '../utils/images'

export default function GuideCard({ guide }) {
  const languages = (guide.languages || '').split(',').map((l) => l.trim()).filter(Boolean)
  const specialities = (guide.specialities || '').split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow duration-500 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          candidates={[guide.profileImageUrl, guideImagePath(guide.name)]}
          alt={guide.name}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {guide.verified && (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-ivory-50/90 px-3 py-1 text-xs font-semibold text-jungle-900 backdrop-blur">
            <BadgeCheck size={13} className="text-jungle-700" /> Verified
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg leading-snug">{guide.name}</h3>
        {languages.length > 0 && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-700">
            <Languages size={14} className="shrink-0 text-jungle-700" />
            {languages.join(', ')}
          </p>
        )}
        {guide.bio && <p className="mt-3 line-clamp-2 text-sm text-ink-700">{guide.bio}</p>}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {specialities.slice(0, 2).map((s) => (
              <span key={s} className="rounded-full bg-ivory-100 px-3 py-1 text-xs font-medium text-jungle-900">
                {s}
              </span>
            ))}
          </div>
          {guide.hourlyRate && <span className="text-sm font-semibold text-jungle-900">${guide.hourlyRate}/hr</span>}
        </div>
      </div>
    </Link>
  )
}