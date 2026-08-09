import { useEffect, useState } from 'react'
import { api, type UserProfile } from '../services/api'
import { clearGuestProgress, loadGuestProgress, mergeGuestProgress, saveGuestProgress } from '../utils/guestProgress'

export const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [message, setMessage] = useState('Guest mode: progress saved locally.')

  useEffect(() => {
    api.getCurrentUser().then((user) => {
      setProfile(user)
      if (user) {
        const guest = loadGuestProgress()
        api.getProgress().then((cloud) => {
          const merged = mergeGuestProgress(guest, cloud)
          return api.syncProgress(merged).then(() => {
            clearGuestProgress()
            saveGuestProgress({ ...merged, syncedAt: new Date().toISOString() })
            setMessage('Guest progress successfully synced to your account.')
          })
        }).catch(() => setMessage('Signed in, but cloud sync failed. Your local data is still safe.'))
      }
    }).catch(() => setMessage('Profile service unavailable. Continue in guest mode.'))
  }, [])

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h1 className="text-xl font-bold">Profile</h1>
      {profile ? (
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-slate-600">{profile.email}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Not signed in. You can learn as guest or sign in with Google.</p>
      )}
      <p className="rounded bg-blue-50 p-3 text-sm text-blue-700">{message}</p>
      <a href="http://localhost:8080/oauth2/authorization/google" className="inline-block rounded bg-brand px-4 py-2 text-sm font-semibold text-white">
        Continue with Google
      </a>
    </section>
  )
}
