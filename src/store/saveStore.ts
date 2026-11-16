import { create } from 'zustand'
import {
  applyChoiceEffects,
  clearRecap,
  finishChapter,
  isChapterFinished,
  type ChoiceLog,
  type PickSide,
  type Save,
  type Screen,
  type Stats,
  type WorldState,
  SAVE_KEY,
  createWorldState,
  cloneStats,
} from '../engine'
import { WORLDS, requireWorld } from '../content/loadWorlds'

function blankSave(): Save {
  return { version: 2, worlds: {} }
}

function readSave(): Save {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return blankSave()
    const parsed = JSON.parse(raw) as Save
    if (parsed.version !== 2 || typeof parsed.worlds !== 'object') {
      return blankSave()
    }
    return parsed
  } catch {
    return blankSave()
  }
}

function writeSave(save: Save): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save))
}

function withWorld(
  save: Save,
  worldId: string,
  updater: (state: WorldState) => WorldState,
): Save {
  const world = requireWorld(worldId)
  const current = save.worlds[worldId] ?? createWorldState(world)
  return {
    ...save,
    worlds: {
      ...save.worlds,
      [worldId]: updater(current),
    },
  }
}

interface SaveStore {
  save: Save
  screen: Screen
  lastResult: {
    worldId: string
    pick: PickSide
    before: Stats
    logEntry: ChoiceLog
  } | null
  enterWorld: (worldId: string) => void
  confirmRecap: (worldId: string) => void
  startChapter: (worldId: string) => void
  choose: (worldId: string, pick: PickSide) => void
  continueAfterResult: (worldId: string) => void
  leaveToHome: () => void
  openLog: (worldId: string) => void
  openEnding: (worldId: string) => void
  resetWorld: (worldId: string) => void
  resetAll: () => void
  getWorldState: (worldId: string) => WorldState
}

export const useSaveStore = create<SaveStore>((set, get) => ({
  save: readSave(),
  screen: { name: 'home' },
  lastResult: null,

  getWorldState(worldId) {
    const world = requireWorld(worldId)
    return get().save.worlds[worldId] ?? createWorldState(world)
  },

  enterWorld(worldId) {
    const world = requireWorld(worldId)
    let save = get().save
    if (!save.worlds[worldId]) {
      save = withWorld(save, worldId, () => createWorldState(world))
      writeSave(save)
      set({ save })
    }
    let state = save.worlds[worldId]!
    if (state.status === 'complete') {
      set({ screen: { name: 'ending', worldId } })
      return
    }

    // Mid-chapter: resume the current card. Recap waits until after the chapter ends.
    if (state.cardIndex > 0 && !isChapterFinished(world, state)) {
      set({ screen: { name: 'card', worldId } })
      return
    }

    // Last card was answered, then the tab closed before chapter-end UI.
    if (state.cardIndex > 0 && isChapterFinished(world, state)) {
      const sessionChoices = state.log.filter(
        (entry) => entry.chapter === state.chaptersDone,
      )
      save = withWorld(save, worldId, (current) => finishChapter(current, world))
      writeSave(save)
      state = save.worlds[worldId]!
      set({ save })
      if (state.status === 'complete') {
        set({ screen: { name: 'ending', worldId } })
        return
      }
      set({
        screen: { name: 'chapterEnd', worldId, sessionChoices },
      })
      return
    }

    if (state.unseenRecap.length > 0) {
      set({ screen: { name: 'recap', worldId } })
      return
    }

    set({ screen: { name: 'world', worldId } })
  },

  confirmRecap(worldId) {
    const save = withWorld(get().save, worldId, clearRecap)
    writeSave(save)
    set({ save, screen: { name: 'world', worldId } })
  },

  startChapter(worldId) {
    const world = requireWorld(worldId)
    const state = get().getWorldState(worldId)
    if (state.status === 'complete') {
      set({ screen: { name: 'ending', worldId } })
      return
    }
    if (state.chaptersDone >= world.chapters.length) {
      set({ screen: { name: 'ending', worldId } })
      return
    }
    set({ screen: { name: 'card', worldId } })
  },

  choose(worldId, pick) {
    const world = requireWorld(worldId)
    let logEntry: ChoiceLog | null = null
    let before: Stats = cloneStats(world.startStats)
    const save = withWorld(get().save, worldId, (state) => {
      const applied = applyChoiceEffects(state, world, pick)
      logEntry = applied.logEntry
      before = applied.before
      return applied.state
    })
    writeSave(save)
    if (!logEntry) throw new Error('Choice failed to produce a log entry')
    set({
      save,
      lastResult: { worldId, pick, before, logEntry },
      screen: { name: 'result', worldId, pick, before },
    })
  },

  continueAfterResult(worldId) {
    const world = requireWorld(worldId)
    const state = get().getWorldState(worldId)
    if (!isChapterFinished(world, state)) {
      set({ screen: { name: 'card', worldId }, lastResult: null })
      return
    }

    const sessionStartChapter = state.chaptersDone
    const sessionChoices = state.log.filter(
      (entry) => entry.chapter === sessionStartChapter,
    )
    const save = withWorld(get().save, worldId, (current) =>
      finishChapter(current, world),
    )
    writeSave(save)
    const finished = save.worlds[worldId]!
    if (finished.status === 'complete') {
      set({
        save,
        lastResult: null,
        screen: { name: 'ending', worldId },
      })
      return
    }
    set({
      save,
      lastResult: null,
      screen: { name: 'chapterEnd', worldId, sessionChoices },
    })
  },

  leaveToHome() {
    set({ screen: { name: 'home' }, lastResult: null })
  },

  openLog(worldId) {
    set({ screen: { name: 'log', worldId } })
  },

  openEnding(worldId) {
    set({ screen: { name: 'ending', worldId } })
  },

  resetWorld(worldId) {
    const world = requireWorld(worldId)
    const save: Save = {
      ...get().save,
      worlds: {
        ...get().save.worlds,
        [worldId]: createWorldState(world),
      },
    }
    writeSave(save)
    set({ save, screen: { name: 'home' }, lastResult: null })
  },

  resetAll() {
    const save = blankSave()
    writeSave(save)
    set({ save, screen: { name: 'home' }, lastResult: null })
  },
}))

export function listWorldStates(save: Save): Array<{
  content: (typeof WORLDS)[number]
  state: WorldState
}> {
  return WORLDS.map((content) => ({
    content,
    state: save.worlds[content.id] ?? createWorldState(content),
  }))
}
