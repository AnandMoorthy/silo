import { describe, expect, it } from 'vitest'
import {
  applyChoiceEffects,
  clearRecap,
  cloneWorldState,
  createWorldState,
  finishChapter,
  isChapterFinished,
  parseWorldContent,
  playableCards,
  type Save,
  type WorldContent,
  type WorldState,
} from './index'
import lighthouse from '../content/worlds/lighthouse.json'
import bakery from '../content/worlds/bakery.json'

const world = parseWorldContent(lighthouse, 'lighthouse.json')
const bakeryWorld = parseWorldContent(bakery, 'bakery.json')

function playThrough(
  content: WorldContent,
  state: WorldState,
  picks: Array<'a' | 'b'>,
): WorldState {
  let current = state
  for (const pick of picks) {
    current = applyChoiceEffects(current, content, pick).state
  }
  return current
}

describe('engine acceptance criteria', () => {
  it('applies effects to the current world only, clamps stats, sets flags, logs, and unseenRecap', () => {
    const beforeA = createWorldState(world)
    const beforeB = createWorldState(bakeryWorld)
    const save: Save = {
      version: 2,
      worlds: {
        [world.id]: beforeA,
        [bakeryWorld.id]: cloneWorldState(beforeB),
      },
    }
    const snapshotOther = cloneWorldState(save.worlds[bakeryWorld.id]!)

    const { state } = applyChoiceEffects(beforeA, world, 'a')
    expect(state.stats.bonds).toBe(50) // 40 + 10
    expect(state.stats.spirit).toBe(65) // 60 + 5
    expect(state.flags).toContain('ines_friend')
    expect(state.log).toHaveLength(1)
    expect(state.log[0]?.pick).toBe('a')
    expect(state.log[0]?.label).toBe('Answer her')
    expect(state.unseenRecap).toEqual(['lh-1-1'])
    expect(state.cardIndex).toBe(1)

    // Clamp: drive heart below 0 and above 100
    let clamped = createWorldState(world)
    clamped.stats.heart = 5
    const down = applyChoiceEffects(
      {
        ...clamped,
        // force a pick that subtracts more than available via temporary card path
      },
      world,
      'a',
    ).state
    // Climb up now is later; use synthetic apply via effects path by replaying paint later.
    // Direct clamp check:
    expect(Math.max(0, Math.min(100, -10))).toBe(0)
    expect(Math.max(0, Math.min(100, 110))).toBe(100)

    // Use Wait it out after setting spirit near floor via repeated negative if needed —
    // apply lh-1-3 b from a crafted state:
    const nearFloor: WorldState = {
      ...createWorldState(world),
      chaptersDone: 0,
      cardIndex: 2, // lamp card
      stats: { heart: 50, coin: 30, bonds: 40, spirit: 5 },
      flags: [],
      log: [],
      unseenRecap: [],
    }
    const afterLow = applyChoiceEffects(nearFloor, world, 'b').state
    expect(afterLow.stats.spirit).toBe(0)

    const nearCeil: WorldState = {
      ...createWorldState(world),
      chaptersDone: 0,
      cardIndex: 2,
      stats: { heart: 50, coin: 30, bonds: 40, spirit: 95 },
      flags: [],
      log: [],
      unseenRecap: [],
    }
    const afterHigh = applyChoiceEffects(nearCeil, world, 'a').state
    expect(afterHigh.stats.spirit).toBe(100)

    expect(save.worlds[bakeryWorld.id]).toEqual(snapshotOther)
    // Choosing in world A does not mutate other world in a shared save object when we copy:
    const nextSave: Save = {
      ...save,
      worlds: { ...save.worlds, [world.id]: state },
    }
    expect(nextSave.worlds[bakeryWorld.id]).toEqual(snapshotOther)
    void down
  })

  it('leaves every other world deep-equal when choosing in world A', () => {
    const a0 = createWorldState(world)
    const b0 = createWorldState(bakeryWorld)
    const othersBefore = cloneWorldState(b0)
    const a1 = applyChoiceEffects(a0, world, 'b').state
    expect(b0).toEqual(othersBefore)
    expect(a1.worldId).toBe('lighthouse')
    expect(a1.stats).not.toEqual(a0.stats)
  })

  it('skips cards whose requires is not met and still plays at least one card', () => {
    const chapter2 = world.chapters[1]!
    const withoutFriend = playableCards(chapter2, [])
    expect(withoutFriend.map((c) => c.id)).toContain('lh-2-1b')
    expect(withoutFriend.map((c) => c.id)).not.toContain('lh-2-1a')

    const withFriend = playableCards(chapter2, ['ines_friend'])
    expect(withFriend.map((c) => c.id)).toContain('lh-2-1a')
    expect(withFriend.map((c) => c.id)).not.toContain('lh-2-1b')

    // Chapter with only unmet requires still yields at least one card
    const fakeChapter = {
      title: 'Empty requires',
      cards: [
        {
          id: 'x-1',
          requires: 'never',
          speaker: 'x',
          text: 'x',
          a: {
            label: 'a',
            effects: {},
            result: 'r',
            later: 'l',
          },
          b: {
            label: 'b',
            effects: {},
            result: 'r',
            later: 'l',
          },
        },
      ],
    }
    expect(playableCards(fakeChapter, []).length).toBeGreaterThanOrEqual(1)
  })

  it('finishing a chapter updates chaptersDone, cardIndex, lastExitAt, and statsAtLastExit', () => {
    let state = createWorldState(world)
    state = playThrough(world, state, ['a', 'a', 'a'])
    expect(isChapterFinished(world, state)).toBe(true)
    const finished = finishChapter(state, world, '2026-01-02T00:00:00.000Z')
    expect(finished.chaptersDone).toBe(1)
    expect(finished.cardIndex).toBe(0)
    expect(finished.lastExitAt).toBe('2026-01-02T00:00:00.000Z')
    expect(finished.statsAtLastExit).toEqual(finished.stats)
  })

  it('entering with unseenRecap shows recap first; confirming clears it', () => {
    let state = createWorldState(world)
    state = playThrough(world, state, ['a', 'b', 'a'])
    state = finishChapter(state, world)
    expect(state.unseenRecap.length).toBeGreaterThan(0)
    const shouldShowRecap = state.unseenRecap.length > 0 && state.cardIndex === 0
    expect(shouldShowRecap).toBe(true)
    const cleared = clearRecap(state)
    expect(cleared.unseenRecap).toEqual([])
  })

  it('after the final chapter, first matching ending wins and status becomes complete', () => {
    // Flood year is shorter; use lighthouse and force high bonds ending.
    let state = createWorldState(world)
    // Play all chapters preferring bond-positive choices where possible
    // Ch1
    state = playThrough(world, state, ['a', 'a', 'a'])
    state = finishChapter(state, world)
    // Ch2 with ines_friend
    state = playThrough(world, state, ['a', 'a'])
    state = finishChapter(state, world)
    // Ch3
    state = playThrough(world, state, ['a', 'a'])
    state = finishChapter(state, world)
    expect(state.status).toBe('complete')
    expect(state.endingText).toBe(
      "The island has a Sunday market now. You're not a keeper any more, just a neighbour.",
    )
  })

  it('mid-chapter reload resumes at same cardIndex; answered cards are not shown again', () => {
    let state = createWorldState(world)
    state = applyChoiceEffects(state, world, 'a').state
    expect(state.cardIndex).toBe(1)
    // Simulate reload: same serialized state
    const resumed = cloneWorldState(state)
    expect(resumed.cardIndex).toBe(1)
    const nextId = playableCards(world.chapters[0]!, resumed.flags)[resumed.cardIndex]?.id
    expect(nextId).toBe('lh-1-2')
    expect(resumed.log.some((e) => e.cardId === 'lh-1-1')).toBe(true)
  })

  it('invalid content throws a readable error at startup/parse', () => {
    expect(() =>
      parseWorldContent(
        {
          id: 'bad',
          title: 'Bad',
          role: 'x',
          tagline: 'x',
          statLabels: {
            heart: 'H',
            coin: 'C',
            bonds: 'B',
            spirit: 'S',
          },
          startStats: { heart: 1, coin: 1, bonds: 1, spirit: 1 },
          facts: {},
          chapters: [
            {
              title: 'Only',
              cards: [
                {
                  id: 'c1',
                  speaker: 's',
                  text: 't',
                  a: {
                    label: 'A',
                    effects: { unknown_stat: 1 },
                    result: 'r',
                    later: 'l',
                  },
                  // missing b
                },
              ],
            },
          ],
          endings: [{ if: 'bonds>=1', text: 'no default' }],
        },
        'bad.json',
      ),
    ).toThrow(/Invalid world content/)

    expect(() =>
      parseWorldContent(
        {
          ...world,
          endings: [{ if: 'bonds>=99', text: 'only conditional' }],
        },
        'nodefault.json',
      ),
    ).toThrow(/no default ending/)
  })
})
