import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5">
    <h1 className="text-xl font-bold">Page not found</h1>
    <p className="mt-2 text-sm text-slate-600">The page you requested does not exist.</p>
    <Link className="mt-3 inline-block text-sm font-semibold text-brand" to="/">Back to home</Link>
  </section>
)
