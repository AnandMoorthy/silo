import { useSaveStore } from './store/saveStore'
import { HomeScreen } from './screens/HomeScreen'
import { RecapScreen } from './screens/RecapScreen'
import { WorldStateScreen } from './screens/WorldStateScreen'
import { CardScreen } from './screens/CardScreen'
import { ResultScreen } from './screens/ResultScreen'
import { ChapterEndScreen } from './screens/ChapterEndScreen'
import { EndingScreen } from './screens/EndingScreen'
import { StoryLogScreen } from './screens/StoryLogScreen'

export default function App() {
  const screen = useSaveStore((s) => s.screen)

  switch (screen.name) {
    case 'home':
      return <HomeScreen />
    case 'recap':
      return <RecapScreen worldId={screen.worldId} />
    case 'world':
      return <WorldStateScreen worldId={screen.worldId} />
    case 'card':
      return <CardScreen worldId={screen.worldId} />
    case 'result':
      return (
        <ResultScreen
          worldId={screen.worldId}
          pick={screen.pick}
          before={screen.before}
        />
      )
    case 'chapterEnd':
      return (
        <ChapterEndScreen
          worldId={screen.worldId}
          sessionChoices={screen.sessionChoices}
        />
      )
    case 'ending':
      return <EndingScreen worldId={screen.worldId} />
    case 'log':
      return <StoryLogScreen worldId={screen.worldId} />
    default:
      return <HomeScreen />
  }
}
