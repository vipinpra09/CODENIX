import { ShieldX } from 'lucide-react'
import { Card } from './ui'

export const AccessDenied = ({ message }: { message: string }) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Card className="max-w-md text-center">
      <ShieldX size={32} className="mx-auto text-slate-400" />
      <h1 className="mt-3 text-lg font-bold">Access denied</h1>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
    </Card>
  </div>
)
