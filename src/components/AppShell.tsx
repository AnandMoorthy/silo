import type { CSSProperties, ReactNode } from 'react'

export function AppShell({
  children,
  accent,
  title,
}: {
  children: ReactNode
  accent?: string
  title?: string
}) {
  return (
    <div
      className="app-shell"
      style={accent ? ({ ['--accent']: accent } as CSSProperties) : undefined}
    >
      <div className="app-frame">
        {title ? (
          <header>
            <h1 className="app-header">{title}</h1>
          </header>
        ) : null}
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
