"use client";


import React from "react";

import useCountdown from "@/app/util/countdownHook";
import { zeroPad } from "@/app/util/util";

function digitise(num: string) {
  return num.split("").map((char, index) => <span className="digit" key={index}>{char}</span>);
}

declare type NextUpCountdownProps = {
  countdownTo: string | Date;
  className?: string;
  separatorClassName?: string;
  inline?: boolean;
}

export default function NextUpCountdown(props: NextUpCountdownProps) {
  let { countdownTo } = props;

  if (typeof countdownTo === "string") {
    countdownTo = new Date(countdownTo);
  }

  const countdownValues = useCountdown(countdownTo, 500);

  if (countdownTo.toString() === "Invalid Date") return <></>;

  const Wrapper = props.inline ?
    ({ children }) => <span>{children}</span> :
    ({ children }) => <div>{children}</div>;

  return (
    <Wrapper className={props.className} >
      {digitise(countdownValues.minutes.toString())}
      <span className={props.separatorClassName}>:</span>
      {digitise(zeroPad(countdownValues.seconds))}
    </Wrapper>
  );
}
