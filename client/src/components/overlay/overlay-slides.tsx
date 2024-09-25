"use client"

import isEqual from "lodash/isEqual"
import * as React from "react"

import { type IOverlayState, useHackathon } from "@/lib/socket"
import { waitFor } from "@/lib/utils"

import { NextUpCountdown } from "./"

const MainTextStyle = {
  major: { font: "900 72px 'Exo 2'", className: "major-text" },
  minor: { font: "600 34px 'Exo 2'", className: "minor-text" },
} as const

type MainTextStyleType = (typeof MainTextStyle)[keyof typeof MainTextStyle]

let fakeCanvasContext: CanvasRenderingContext2D | null
if (document !== undefined) fakeCanvasContext = document.createElement("canvas").getContext("2d")

function breakUpParagraph(paragraph: string, style: MainTextStyleType) {
  if (fakeCanvasContext == null) {
    const message =
      "this browser doesn't support the '2d' context identifier for canvas elements, overlay slide paragraphs won't work right"
    alert(message)
    throw new Error(message)
  }

  const limit = 980
  const lines: string[] = []
  fakeCanvasContext.font = style.font

  let currentLine = ""
  for (const word of paragraph.trim().split(" ")) {
    const potentialLine = `${currentLine} ${word}`

    if (fakeCanvasContext.measureText(potentialLine).width > limit) {
      lines.push(currentLine)
      currentLine = word
      continue
    }

    currentLine = potentialLine
  }
  lines.push(currentLine)

  return lines.map((line) => line.trim())
}

declare type MainTextElementProps = {
  textStyle: MainTextStyleType
  animationDelay: number
  children: React.ReactNode
}

function MainTextElement(props: MainTextElementProps) {
  return (
    <div className={props.textStyle.className}>
      <div>
        <div style={{ animationDelay: `${props.animationDelay}s` }}>
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  )
}

function SeparatorElement() {
  return <></>
}

declare type SlideProps = {
  slideText: string
  className?: string
}

function Slide(props: SlideProps) {
  const paragraphs = props.slideText
    .trim()
    .split("\n")
    .map((paragraph) => paragraph.trim())

  if (!paragraphs.length) {
    return
  }

  let currentAnimationDelay = 0

  const paragraphLines = paragraphs.map((paragraph) =>
    breakUpParagraph(paragraph, MainTextStyle.minor).map((line, lineIndex) => {
      const element = (
        <MainTextElement key={lineIndex} textStyle={MainTextStyle.minor} animationDelay={currentAnimationDelay}>
          {line}
        </MainTextElement>
      )
      currentAnimationDelay += 0.3
      return element
    }),
  )

  const paragraphElements = paragraphLines.map((paragraphLines, paragraphIndex) => (
    <React.Fragment key={paragraphIndex}>{paragraphLines}</React.Fragment>
  ))

  return <div data-max-delay={currentAnimationDelay}>{paragraphElements}</div>
}

declare type NextUpSlideProps = IOverlayState["main"]["nextUp"] & { className?: string }

function NextUpSlide(props: NextUpSlideProps) {
  const { enabled, pretext, text: title, when } = props

  if (!enabled) return <></>

  let currentAnimationDelay = 0
  function incrementAnimationDelay() {
    currentAnimationDelay += 0.3
  }

  function Pretext() {
    if (!pretext) return

    const element = (
      <MainTextElement textStyle={MainTextStyle.minor} animationDelay={currentAnimationDelay}>
        {pretext}
      </MainTextElement>
    )
    incrementAnimationDelay()
    return element
  }

  function Title() {
    if (!title) return

    return (
      <>
        {breakUpParagraph(title, MainTextStyle.major).map((line, lineIndex) => {
          const element = (
            <MainTextElement key={lineIndex} textStyle={MainTextStyle.major} animationDelay={currentAnimationDelay}>
              {line}
            </MainTextElement>
          )
          incrementAnimationDelay()
          return element
        })}
        ;
      </>
    )
  }

  function Countdown() {
    if (!when) return

    const element = (
      <>
        <SeparatorElement />
        <MainTextElement textStyle={MainTextStyle.minor} animationDelay={currentAnimationDelay}>
          Starting in <NextUpCountdown className={"nextup-countdown"} countdownTo={new Date(when)} inline={true} />
        </MainTextElement>
      </>
    )
    incrementAnimationDelay()
    return element
  }

  // pre-generate the contents, otherwise currentAnimationDelay will be 0 when the return statement evaluates
  // note the functions cannot be referenced as components as they lazy-load; currentAnimationDelay will still be 0
  const contents = (
    <>
      {Pretext()}
      {Title()}
      {Countdown()}
    </>
  )

  return (
    <div className={props.className} data-max-delay={currentAnimationDelay}>
      {contents}
    </div>
  )
}

export function OverlaySlides() {
  const { state } = useHackathon()
  const [lastMain, setLastMain] = React.useState<IOverlayState["main"] | null>(null)

  const [nextUp, setNextUp] = React.useState<IOverlayState["main"]["nextUp"] | null>(null)
  const [slides, setSlides] = React.useState<IOverlayState["main"]["slides"] | null>(null)
  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number | null>(null)

  function getSlideCount() {
    const containerElement = containerRef.current
    if (!containerElement) return 0

    return containerElement.childElementCount
  }

  function getSlideAtIndex(index: number) {
    const containerElement = containerRef.current
    if (!containerElement) return

    const element = Array.from(containerElement.childNodes)[index]
    if (!(element instanceof HTMLElement)) return
    return element
  }

  function getCurrentlyVisibleSlides() {
    const containerElement = containerRef.current
    if (!containerElement) return []

    return Array.from(containerElement.childNodes).filter(
      (element) =>
        element instanceof HTMLElement &&
        (element.classList.contains("animate-in") || element.classList.contains("visible")),
    ) as HTMLElement[]
  }

  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    void onHackathonStateChange()
  }, [state])

  async function onHackathonStateChange() {
    const newOverlayState = state?.overlay
    if (!newOverlayState) return

    if (isEqual(lastMain, newOverlayState.main)) return

    setLastMain(newOverlayState.main)
    void updateMain(newOverlayState.main)
  }

  async function updateMain(options: IOverlayState["main"]) {
    const { nextUp, slides } = options
    console.log(`updating main: ${nextUp}, ${slides}`)

    await animateOutSlides()

    setNextUp(nextUp)
    setSlides(slides)

    setActiveSlideIndex(0)
  }

  async function animateOutSlide(slide: HTMLElement): Promise<void> {
    slide.classList.add("animate-out")
    slide.classList.remove("visible")
    slide.classList.remove("animate-in")

    await waitFor((Number(slide.dataset.maxDelay) || 1) + 1.5)

    slide.classList.remove("animate-out")
  }

  async function animateOutSlides() {
    await Promise.all(getCurrentlyVisibleSlides().map((slide) => animateOutSlide(slide)))
  }

  function currentSlideIsNextUpAndTimerEndingSoon(): boolean {
    if (activeSlideIndex === null) return false

    const currentSlide = getSlideAtIndex(activeSlideIndex)
    if (!currentSlide) return false

    return (
      currentSlide?.classList.contains("nextup") &&
      !!nextUp?.when &&
      new Date(nextUp.when).getTime() - Date.now() < 1000 * 60 * 1.5
    )
  }

  React.useEffect(() => {
    if (activeSlideIndex === null) return

    const currentSlide = getSlideAtIndex(activeSlideIndex)

    if (getSlideCount() <= 1) return
    if (currentSlideIsNextUpAndTimerEndingSoon()) {
      console.debug("'Next Up' is about to end - stop slide progression.")
      return
    }

    const millisToAnimateOut = ((Number(currentSlide?.dataset.maxDelay) || 1) + 1.5) * 1000
    const millisDisplayTime = 15000
    console.debug(`Starting timeout (${millisToAnimateOut + millisDisplayTime}ms) till next slide progression...`)
    const timeout = setTimeout(progressActiveSlideIndex, millisToAnimateOut + millisDisplayTime)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [slides, nextUp, activeSlideIndex])

  async function progressActiveSlideIndex() {
    await animateOutSlides()

    let newActiveSlideIndex = 0
    if (activeSlideIndex !== null) {
      newActiveSlideIndex = (activeSlideIndex + 1) % getSlideCount()
    }
    setActiveSlideIndex(newActiveSlideIndex)
  }

  React.useEffect(() => {
    void displayActiveSlide()
  }, [nextUp, slides, activeSlideIndex])

  async function displayActiveSlide() {
    const containerElement = containerRef.current

    if (!containerElement || !getSlideCount()) {
      return
    }

    if (activeSlideIndex === null) return

    const currentSlide = getSlideAtIndex(activeSlideIndex)
    if (!currentSlide) return

    currentSlide.classList.add("animate-in")
    await waitFor((Number(currentSlide?.dataset.maxDelay) || 0) + 1)
    currentSlide.classList.add("visible")
    currentSlide.classList.remove("animate-in")
  }

  return (
    <div className="slides" ref={containerRef}>
      <NextUpSlide
        className="nextup"
        enabled={nextUp?.enabled ?? false}
        pretext={nextUp?.pretext ?? ""}
        text={nextUp?.text ?? ""}
        when={nextUp?.when ?? ""}
      />
      {slides?.map((slideText, slideIndex) => (
        <Slide key={slideIndex} slideText={slideText} />
      ))}
    </div>
  )
}
