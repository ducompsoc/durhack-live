import React from "react";

function getCountdownValues(countdownMillis: number) {
  if (isNaN(countdownMillis)) return {
    days: 99,
    hours: 99,
    minutes: 99,
    seconds: 99,
  };

  let diffSeconds = Math.max(0, countdownMillis/1000);
  const days = Math.floor(diffSeconds / 86400);
  diffSeconds %= 86400;
  const hours = Math.floor(diffSeconds / 3600);
  diffSeconds %= 3600;
  const minutes = Math.floor(diffSeconds / 60);
  diffSeconds %= 60;
  const seconds = Math.floor(diffSeconds);
  const milliseconds = diffSeconds % 1;

  return { days, hours, minutes, seconds, milliseconds };
}

export default function useCountdown(countdownTo: Date) {
  const countdownToMillis = countdownTo.getTime();

  function calcCountdownMillis() {
    return countdownToMillis - new Date().getTime();
  }

  const [countdownMillis, setCountdownMillis] = React.useState(calcCountdownMillis);

  React.useEffect(() => {
    setCountdownMillis(calcCountdownMillis());
    const interval = setInterval(() => {
      setCountdownMillis(calcCountdownMillis());
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownToMillis]);

  return getCountdownValues(countdownMillis);
}
