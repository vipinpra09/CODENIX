import { useState } from 'react'

const defaultCode = '#include <stdio.h>\n\nint main(void){\n  printf("Hello, Codenix!\\n");\n  return 0;\n}'

export const CompilerPage = () => {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState('')

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h1 className="text-xl font-bold">Compiler</h1>
      <p className="text-sm text-slate-600">Safe mode: browser editor is ready. Secure execution integration is pending.</p>
      <textarea
        aria-label="C code editor"
        className="h-64 w-full rounded border border-slate-300 bg-slate-950 p-3 font-mono text-xs text-green-200"
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={() => setOutput('Execution is not enabled yet. Integrate secure sandbox before production run support.')}>Run</button>
        <button className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={() => setCode(defaultCode)}>Reset</button>
        <button className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={() => navigator.clipboard.writeText(code)}>Copy</button>
      </div>
      <div className="rounded bg-slate-100 p-3 text-sm" aria-live="polite">{output || 'Output panel'}</div>
    </section>
  )
}
