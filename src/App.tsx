import { ReactElement, useCallback, useEffect, useState } from 'react'
import useLocalStorage from 'react-use-localstorage'

import './App.css'
import Timer from './Components/Counter'
import {
  DAILY_GOAL,
  LONG_BREAK_INTERVAL,
  SHORT_BREAK_INTERVAL,
  WORK_INTERVAL,
} from './constants'

export interface StorageProps {
  pomsToday: number
  pomGoal: number
}

const defaultStorage: StorageProps = {
  pomsToday: 0,
  pomGoal: DAILY_GOAL,
}

function App() {
  const [initialized, setInitialized] = useState(false)
  const [pomGoal, setPomGoal] = useState(8)
  const [pomsToday, setPomsToday] = useState(0)

  const [storage, setStorage] = useLocalStorage('storage', JSON.stringify(defaultStorage))

  useEffect(() => {
    setInitialized(true)
  }, [])

  const saveSettings = useCallback(() => {
    const parsedStorage = JSON.parse(storage)
    setStorage(JSON.stringify({ ...parsedStorage, pomsToday }))
  }, [setStorage, storage, pomsToday])

  const onTimerFinish = useCallback(() => {
    setPomsToday((_pomsToday) => _pomsToday + 1)
    saveSettings()
  }, [saveSettings])

  return (
    <div className="App">
      <Timer
        longBreakInterval={LONG_BREAK_INTERVAL}
        onTimerFinish={onTimerFinish}
        shortBreakInterval={SHORT_BREAK_INTERVAL}
        workInterval={WORK_INTERVAL}
      />
      <div>
        {pomsToday} / {pomGoal}
      </div>
    </div>
  )
}

export default App
