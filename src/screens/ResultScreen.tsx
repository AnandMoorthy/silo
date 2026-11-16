import { AppShell } from '../components/AppShell'
import { StatBars } from '../components/StatBar'
import { WORLD_ACCENTS, requireWorld } from '../content/loadWorlds'
import type { PickSide, Stats } from '../engine'
import { useSaveStore } from '../store/saveStore'

export function ResultScreen({
  worldId,
  before,
}: {
  worldId: string
  pick: PickSide
  before: Stats
}) {
  const world = requireWorld(worldId)
  const state = useSaveStore((s) => s.getWorldState(worldId))
  const lastResult = useSaveStore((s) => s.lastResult)
  const continueAfterResult = useSaveStore((s) => s.continueAfterResult)
  const accent = WORLD_ACCENTS[worldId] ?? '#9aa4b2'
  const resultText = lastResult?.logEntry.result ?? 'Done.'

  return (
    <AppShell accent={accent} title={world.title} worldId={worldId}>
      <p className="result-line">{resultText}</p>
      <StatBars
        labels={world.statLabels}
        values={state.stats}
        previous={before}
        accent={accent}
        showDelta
      />
      <button
        type="button"
        className="btn btn--primary"
        onClick={() => continueAfterResult(worldId)}
      >
        Continue
      </button>
    </AppShell>
  )
}
