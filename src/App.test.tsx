import { render, screen } from '@testing-library/react'

import App from './App'
import {
  DAILY_GOAL,
  LONG_BREAK_INTERVAL,
  SESSION_INTERVAL,
  SHORT_BREAK_INTERVAL,
} from './constants'

test('renders default counter', () => {
  render(<App />)
  const linkElement = screen.getByText(RegExp(SESSION_INTERVAL + ':00'))
  expect(linkElement).toBeInTheDocument()
})

test('renders default daily count', () => {
  render(<App />)
  const linkElement = screen.getByText(RegExp('0 / ' + DAILY_GOAL))
  expect(linkElement).toBeInTheDocument()
})
