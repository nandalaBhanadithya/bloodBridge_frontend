import { useState, useEffect } from 'react'

export function useLiveTick(intervalMs = 2000) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  const seconds = tick * (intervalMs / 1000)
  const label =
    seconds < 60
      ? `Updated ${seconds}s ago`
      : `Updated ${Math.floor(seconds / 60)}m ago`

  return label
}
