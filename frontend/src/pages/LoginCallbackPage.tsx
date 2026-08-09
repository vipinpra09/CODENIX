import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const LoginCallbackPage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/profile', { replace: true })
  }, [navigate])

  return <p className="rounded-2xl border border-slate-200 bg-white p-5">Completing sign-in...</p>
}
