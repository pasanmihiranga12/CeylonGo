import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import StarRating from './StarRating'
import SmartImage from './SmartImage'
import { destinationImagePath } from '../utils/images'

export default function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destinations/${destination.id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition-shadow duration-500 hover:shadow-card"
    >
      <SmartImage
        candidates={[destination.imageUrl, destinationImagePath(destination.name)]}
        alt={destination.name}
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/90 via-jungle-950/10 to-transparent" />

      {destination.category && (
        <span className="absolute left-4 top-4 rounded-full bg-ivory-50/90 px-3 py-1 text-xs font-semibold text-jungle-900 backdrop-blur">
          {destination.category.name}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 text-ivory-50">
        <h3 className="text-xl leading-snug text-ivory-50">{destination.name}</h3>
        {destination.location && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ivory-50/80">
            <MapPin size={13} className="shrink-0" />
            {destination.location}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={destination.averageRating} reviewCount={destination.reviewCount} size={13} />
          {destination.entryFee !== null && destination.entryFee !== undefined && (
            <span className="text-sm font-semibold">
              {destination.entryFee > 0 ? `$${destination.entryFee}` : 'Free'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}