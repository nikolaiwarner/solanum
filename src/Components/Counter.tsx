import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import * as Notification from '@tauri-apps/api/notification'

import { secondsToTime } from '../Lib/Time'

export interface TimerProps {
  longBreakInterval: number
  onTimerFinish: () => void
  onTimerStart: () => void
  sessionInterval: number
  shortBreakInterval: number
}

export default function Timer(props: TimerProps): ReactElement {
  const {
    onTimerFinish,
    onTimerStart,
    sessionInterval,
    longBreakInterval,
    shortBreakInterval,
  } = props

  const [endTime, setEndTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [length, setLength] = useState(sessionInterval * 60 * 1000)
  const [currentTime, setCurrentTime] = useState(length)
  const [startTime, setStartTime] = useState(new Date().getTime())

  const timerInterval = useRef<NodeJS.Timeout>()

  const tick = useCallback(() => {
    setCurrentTime(startTime + length - new Date().getTime())
  }, [startTime, length])

  const startTimerInterval = useCallback(() => {
    timerInterval.current = setInterval(tick, 500)
  }, [tick])

  const stopTimerInterval = useCallback(() => {
    timerInterval.current && clearInterval(timerInterval.current)
  }, [])

  const start = useCallback(() => {
    sendNotification('Go!')
    setStartTime(new Date().getTime())
    setIsRunning(true)
    timerInterval.current = setInterval(tick, 500)
    // onTimerStart()
    console.log('start')
  }, [tick])

  const reset = useCallback(() => {
    setCurrentTime(length)
    setIsRunning(false)
    stopTimerInterval()
  }, [length])

  const playEndSound = useCallback(() => {
    const sound = new Howl({
      src: ['./sounds/alarm-bell.mp3'],
    })
    sound.play()
    sound.fade(0, 1, 10000)
  }, [])

  const sendNotification = useCallback(async (message: string) => {
    // let canSend = await Notification.isPermissionGranted()
    // if (!canSend) {
    //   canSend = (await Notification.requestPermission()) === 'granted'
    // }
    // canSend &&
    //   Notification.sendNotification({
    //     body: message,
    //     icon: './images/icon.png',
    //     title: 'Solanum',
    //   })
  }, [])

  useEffect(() => {
    if (isRunning) {
      startTimerInterval()
    } else {
      stopTimerInterval()
    }
    return () => {
      stopTimerInterval()
    }
  }, [isRunning, stopTimerInterval, startTimerInterval])

  useEffect(() => {
    if (isRunning && currentTime < 0) {
      onTimerFinish()
      setIsRunning(false)
      setCurrentTime(length)
      setEndTime(new Date().getTime())
      playEndSound()
      sendNotification("Time's up!")
    }
  }, [isRunning, onTimerFinish, currentTime, playEndSound, sendNotification])

  return (
    <div className="timer">
      <h1>{secondsToTime(currentTime / 1000)}</h1>
      <button onClick={start}>Start</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
