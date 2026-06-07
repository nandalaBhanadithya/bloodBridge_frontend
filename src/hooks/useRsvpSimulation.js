import { useState, useEffect, useCallback } from 'react'

export function useRsvpSimulation({ total, threshold, updates, initialCount = 0 }) {
  const [active, setActive] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [chipStatuses, setChipStatuses] = useState(
    updates.map(() => ({ cls: 'bk', text: 'Sent' }))
  )
  const [thresholdMet, setThresholdMet] = useState(false)

  const start = useCallback(() => {
    setCount(initialCount)
    setChipStatuses(updates.map(() => ({ cls: 'bk', text: 'Sent' })))
    setThresholdMet(false)
    setActive(true)
  }, [updates, initialCount])

  useEffect(() => {
    if (!active) return

    let step = 0
    let currentCount = initialCount
    let cancelled = false

    const runStep = () => {
      if (cancelled || step >= updates.length) return

      const [cls, text] = updates[step]
      const idx = step
      setChipStatuses((prev) => {
        const next = [...prev]
        next[idx] = { cls, text }
        return next
      })

      if (cls === 'bg') currentCount++
      setCount(currentCount)

      if (currentCount >= threshold) {
        setThresholdMet(true)
        return
      }

      step++
      if (step < updates.length) {
        setTimeout(runStep, 1800)
      }
    }

    const timer = setTimeout(runStep, 1500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [active, updates, threshold, initialCount])

  const pct = Math.round((count / total) * 100)
  const statusBadge =
    count >= threshold
      ? { cls: 'bg', text: 'Threshold met! ✓' }
      : { cls: 'bb', text: 'Waiting...' }

  return { count, pct, chipStatuses, thresholdMet, statusBadge, start }
}
