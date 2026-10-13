import React from 'react'

function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full max-w-6xl relative md:h-[800px] h-[650px] [background:linear-gradient(to_bottom,#111827,#111827)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate-600/.15)_80%,theme(colors.blue.500)_86%,theme(colors.indigo.400)_90%,theme(colors.blue.500)_94%,theme(colors.slate-600/.15))_border-box] rounded-2xl border border-transparent backdrop-blur-md shadow-2xl shadow-black/50 overflow-hidden animate-border">
      {children}
    </div>
  )
}

export default BorderAnimatedContainer
