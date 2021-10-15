import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

export interface SessionsCountProps {
  sessionGoal: number
  sessionsToday: number
}

export default function SessionsCount(props: SessionsCountProps): ReactElement {
  const { sessionGoal, sessionsToday } = props
  return (
    <Container>
      {sessionsToday} / {sessionGoal}
    </Container>
  )
}

const Container = styled.div`
  border-top: 1px solid #444444;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
`
