import { slugify } from './slugify'

// ----------------------------------------------------------------------------
// Local image convention. Drop your own photos into frontend/public/images/...
// using these exact filenames (based on the destination/guide name) and they
// will be picked up automatically — no code changes needed. If a file isn't
// there yet, a styled placeholder shows the expected filename instead of a
// broken image icon. Anything the backend returns in imageUrl/profileImageUrl
// always takes priority over the local convention.
// ----------------------------------------------------------------------------

export function heroImagePath() {
  return '/images/misc/hero.jpg'
}

export function authImagePath(name) {
  return `/images/misc/${name}.jpg`
}

export function destinationImagePath(name) {
  return `/images/destinations/${slugify(name)}.jpg`
}

export function guideImagePath(name) {
  return `/images/guides/${slugify(name)}.jpeg`
}

export function expectedFilename(path) {
  return path.split('/').pop()
}
