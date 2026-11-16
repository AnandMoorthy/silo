import type { Stats, WorldState } from './types'

const STAT_CONDITION = /^(heart|coin|bonds|spirit)(>=|<=|>|<)(-?\d+)$/

export function flagMet(requires: string | undefined, flags: string[]): boolean {
  if (!requires) return true
  if (requires.startsWith('!')) {
    return !flags.includes(requires.slice(1))
  }
  return flags.includes(requires)
}

export function evaluateEndingCondition(
  condition: string | undefined,
  stats: Stats,
): boolean {
  if (!condition) return true
  const match = STAT_CONDITION.exec(condition)
  if (!match) {
    throw new Error(`Invalid ending condition: "${condition}"`)
  }
  const [, stat, op, rawValue] = match
  const left = stats[stat as keyof Stats]
  const right = Number(rawValue)
  switch (op) {
    case '>=':
      return left >= right
    case '<=':
      return left <= right
    case '>':
      return left > right
    case '<':
      return left < right
    default:
      return false
  }
}

export function cloneWorldState(state: WorldState): WorldState {
  return structuredClone(state)
}
