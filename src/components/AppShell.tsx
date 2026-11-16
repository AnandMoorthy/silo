import type { CSSProperties, ReactNode } from 'react'
import { WorldMotif } from './WorldMotif'

export function AppShell({
  children,
  accent,
  title,
  worldId,
  showMotif = false,
}: {
  children: ReactNode
  accent?: string
  title?: string
  worldId?: string
  /** Large atmospheric motif under the title (world screens). */
  showMotif?: boolean
}) {
  return (
    <div
      className="app-shell"
      data-world={worldId || undefined}
      style={accent ? ({ ['--accent']: accent } as CSSProperties) : undefined}
    >
      <div className="app-frame">
        {title ? (
          <header className={showMotif && worldId ? 'app-header-row' : undefined}>
            <h1 className="app-header">{title}</h1>
            {showMotif && worldId ? <WorldMotif worldId={worldId} size="md" /> : null}
          </header>
        ) : null}
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
