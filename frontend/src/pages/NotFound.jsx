import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col items-center justify-center px-6 text-center">
      <Compass size={40} className="text-jungle-700" />
      <h1 className="mt-4 text-3xl">Page not found</h1>
      <p className="mt-2 text-ink-700">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  )
}
