import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import useLocalStorage from 'react-use-localstorage'
import { appWindow } from '@tauri-apps/api/window'
import { emit, listen } from '@tauri-apps/api/event'

import './App.css'
import {
  DAILY_GOAL,
  LONG_BREAK_INTERVAL,
  SHORT_BREAK_INTERVAL,
  SESSION_INTERVAL,
} from './constants'
import HomeScreen from './Containers/HomeScreen'
import SessionsCount from './Components/SessionsCount'
import SettingsScreen from './Containers/SettingsScreen'
import Timer from './Components/Counter'

export interface StorageProps {
  sessionsToday: number
  sessionGoal: number
}

const defaultStorage: StorageProps = {
  sessionsToday: 0,
  sessionGoal: DAILY_GOAL,
}

function App() {
  const [initialized, setInitialized] = useState(false)
  const [sessionGoal, setSessionGoal] = useState(8)
  const [sessionsToday, setSessionsToday] = useState(0)
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const [storage, setStorage] = useLocalStorage('storage', JSON.stringify(defaultStorage))

  const dateCheckInterval = useRef<NodeJS.Timeout>()

  const saveSettings = useCallback(() => {
    const parsedStorage = JSON.parse(storage)
    setStorage(JSON.stringify({ ...parsedStorage, sessionsToday }))
  }, [setStorage, storage, sessionsToday])

  const checkForNewDay = useCallback(() => {
    if (currentDate.getDate() !== new Date().getDate()) {
      setSessionsToday(0)
      setCurrentDate(new Date())
      saveSettings()
    }
  }, [saveSettings, currentDate])

  const clearDateCheck = useCallback(() => {
    if (dateCheckInterval.current) {
      clearInterval(dateCheckInterval.current)
    }
  }, [])

  const startDateCheck = useCallback(() => {
    clearDateCheck()
    dateCheckInterval.current = setInterval(checkForNewDay, 1000 * 60)
  }, [checkForNewDay, clearDateCheck])

  const onTimerStart = useCallback(() => {
    appWindow.hide()
    appWindow.setSkipTaskbar(true)
    emit('frontend-onTimerStart')
    alert('Timer started')
  }, [])

  const onTimerFinish = useCallback(() => {
    setSessionsToday((_sessionsToday) => _sessionsToday + 1)
    saveSettings()
    appWindow.show()
    appWindow.setFocus()
    appWindow.setSkipTaskbar(false)
  }, [saveSettings])

  const setupListeners = async () => {
    const clearOnTimerStartListener = await listen('backend-onTimerStart', onTimerStart)

    return () => {
      clearOnTimerStartListener()
    }
  }

  useEffect(() => {
    if (!initialized) {
      setupListeners()
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (initialized) {
      startDateCheck()
    }
  }, [initialized, startDateCheck])

  return (
    <div className="App">
      <Timer
        longBreakInterval={LONG_BREAK_INTERVAL}
        onTimerStart={onTimerStart}
        onTimerFinish={onTimerFinish}
        sessionInterval={SESSION_INTERVAL}
        shortBreakInterval={SHORT_BREAK_INTERVAL}
      />
      <SessionsCount sessionGoal={sessionGoal} sessionsToday={sessionsToday} />
      <HomeScreen />
      <SettingsScreen />
    </div>
  )
}

export default App
