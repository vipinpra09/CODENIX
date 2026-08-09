import { useEffect, useState } from 'react'
import { api, type UserProfile } from '../services/api'
import { AccessDenied } from './AccessDenied'
import { Loading } from './ui'

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null | undefined>(undefined)

  useEffect(() => {
    api.getCurrentUser().then(setUser).catch(() => setUser(null))
  }, [])

  if (user === undefined) {
    return <Loading label="Checking access..." />
  }

  if (!user) {
    return (
      <div>
        <AccessDenied message="You must be signed in as an admin to access this area. Sign in with Google, or return to the student app." />
        <div className="mt-4 text-center">
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="inline-block rounded bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Continue with Google
          </a>
        </div>
      </div>
    )
  }

  if (user.role !== 'ADMIN') {
    return (
      <AccessDenied message="Your account does not have admin privileges. If you believe this is a mistake, contact a Codenix administrator." />
    )
  }

  return <>{children}</>
}
