import * as React from "react"

function getCountdownValues(countdownMillis: number) {
  if (Number.isNaN(countdownMillis))
    return {
      days: 99,
      hours: 99,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    }

  let diffSeconds = Math.max(0, countdownMillis / 1000)
  const days = Math.floor(diffSeconds / 86400)
  diffSeconds %= 86400
  const hours = Math.floor(diffSeconds / 3600)
  diffSeconds %= 3600
  const minutes = Math.floor(diffSeconds / 60)
  diffSeconds %= 60
  const seconds = Math.floor(diffSeconds)
  const milliseconds = diffSeconds % 1

  return { days, hours, minutes, seconds, milliseconds }
}

/**
 * a React hook that returns an object containing days, hours, ..., milliseconds
 * counting down to countdownTo. The values will update every `granularity` milliseconds. (default: 1000ms)
 *
 * @param countdownTo
 * @param granularity
 */
export function useCountdown(countdownTo: Date, granularity = 1000) {
  const countdownToMillis = countdownTo.getTime()

  function calcCountdownMillis() {
    return countdownToMillis - new Date().getTime()
  }

  const [countdownMillis, setCountdownMillis] = React.useState(calcCountdownMillis)

  React.useEffect(() => {
    const newCountdownMillis = calcCountdownMillis()
    if (Number.isNaN(newCountdownMillis)) return

    setCountdownMillis(newCountdownMillis)
    const interval = window.setInterval(() => {
      setCountdownMillis(calcCountdownMillis())
    }, granularity)
    return () => window.clearInterval(interval)
  }, [countdownToMillis])

  return getCountdownValues(countdownMillis)
}
