"use client";

import React  from "react";
import isEqual from "lodash/isEqual";

import { IOverlayState, useHackathon } from "@/app/util/socket";
import { waitFor } from "@/app/util/util";

import NextUpCountdown from "./NextUpCountdown";


const MainTextStyle = {
  major: { font: "900 72px 'Exo 2'", className: "major-text" },
  minor: { font: "600 34px 'Exo 2'", className: "minor-text" },
} as const;

type MainTextStyleType = typeof MainTextStyle[keyof typeof MainTextStyle];

const fakeCanvasContext = document.createElement("canvas").getContext("2d");
function breakUpParagraph(paragraph: string, style: MainTextStyleType) {
  const limit = 980;
  const lines: string[] = [];
  fakeCanvasContext.font = style.font;

  let currentLine = "";
  paragraph.trim().split(" ").forEach(word => {
    const potentialLine = `${currentLine} ${word}`;

    if (fakeCanvasContext.measureText(potentialLine).width > limit) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = potentialLine;
  });
  lines.push(currentLine);

  return lines.map(line => line.trim());
}

declare type MainTextElementProps = {
  textStyle: MainTextStyleType,
  animationDelay: number,
  children: React.ReactNode,
}

function MainTextElement(props: MainTextElementProps) {
  return (
    <div className={props.textStyle.className}>
      <div>
        <div style={{animationDelay: `${props.animationDelay}s`}}>
          <div>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeparatorElement() {
  return <></>;
}

declare type SlideProps = {
  slideText: string;
  className?: string;
}

function Slide(props: SlideProps) {
  const paragraphs = props.slideText
    .trim()
    .split("\n")
    .map(paragraph => paragraph.trim());

  if (!paragraphs.length) {
    return;
  }

  let currentAnimationDelay = 0;

  const paragraphLines = paragraphs.map(paragraph =>
    breakUpParagraph(paragraph, MainTextStyle.minor).map((line, lineIndex) => {
      const element = <MainTextElement
        key={lineIndex}
        textStyle={MainTextStyle.minor}
        animationDelay={currentAnimationDelay}
      >
        {line}
      </MainTextElement>;
      currentAnimationDelay += 0.3;
      return element;
    })
  );

  const paragraphElements = paragraphLines.map((paragraphLines, paragraphIndex) => (
    <React.Fragment key={paragraphIndex}>
      {paragraphLines}
    </React.Fragment>
  ));

  return (
    <div data-max-delay={currentAnimationDelay}>
      {paragraphElements}
    </div>
  );
}

declare type NextUpSlideProps = IOverlayState["main"]["nextUp"] & { className?: string }

function NextUpSlide(props: NextUpSlideProps) {
  const { enabled, pretext, text: title, when } = props;

  if (!enabled) return <></>;

  let currentAnimationDelay = 0;
  function incrementAnimationDelay() { currentAnimationDelay += 0.3; }

  function Pretext() {
    if (!pretext) return;

    const element = <MainTextElement
      textStyle={MainTextStyle.minor}
      animationDelay={currentAnimationDelay}
    >
      {pretext}
    </MainTextElement>;
    incrementAnimationDelay();
    return element;
  }

  function Title() {
    if (!title) return;

    return (
      <>
        {breakUpParagraph(title, MainTextStyle.major).map((line, lineIndex) => {
          const element = (<MainTextElement
            key={lineIndex}
            textStyle={MainTextStyle.major}
            animationDelay={currentAnimationDelay}
          >
            {line}
          </MainTextElement>);
          incrementAnimationDelay();
          return element;
        })};
      </>
    );
  }

  function Countdown() {
    if (!when) return;

    return (
      <>
        <SeparatorElement />
        <MainTextElement textStyle={MainTextStyle.minor} animationDelay={currentAnimationDelay}>
          Starting in <NextUpCountdown
            className={"nextup-countdown"}
            countdownTo={new Date(when)}
            inline={true}
          />
        </MainTextElement>
      </>
    );
  }

  return (
    <div className={props.className} data-max-delay={currentAnimationDelay}>
      <Pretext />
      <Title />
      <Countdown />
    </div>
  );
}

export default function OverlaySlides() {
  const { state } = useHackathon();
  const [lastMain, setLastMain] = React.useState<IOverlayState["main"] | null>(null);

  const [nextUp, setNextUp] = React.useState<IOverlayState["main"]["nextUp"] | null>(null);
  const [slides, setSlides] = React.useState<IOverlayState["main"]["slides"] | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number | null>(null);

  function getSlideCount() {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    return containerElement.childElementCount;
  }

  function getSlideAtIndex(index: number) {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const element = Array.from(containerElement.childNodes)[index];
    if (!(element instanceof HTMLElement)) return;
    return element;
  }

  function getCurrentlyVisibleSlides() {
    const containerElement = containerRef.current;
    if (!containerElement) return [];

    return Array.from(containerElement.childNodes).filter((element) =>
      element instanceof HTMLElement && element.classList.contains("animate-in")
    ) as HTMLElement[];
  }

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    void onHackathonStateChange();
  }, [state]);

  async function onHackathonStateChange() {
    const newOverlayState = state?.overlay;
    if (!newOverlayState) return;

    if (isEqual(lastMain, newOverlayState.main)) return;

    setLastMain(newOverlayState.main);
    void updateMain(newOverlayState.main);
  }

  async function updateMain(options: IOverlayState["main"]) {
    const { nextUp, slides } = options;
    console.log(`updating main: ${nextUp}, ${slides}`);

    await animateOutSlides();

    setNextUp(nextUp);
    setSlides(slides);

    setActiveSlideIndex(0);
  }

  async function animateOutSlide(slide: HTMLElement): Promise<void> {
    slide.classList.add("animate-out");
    slide.classList.remove("animate-in");

    await waitFor((Number(slide.dataset.maxDelay) || 1) + 1.5);

    slide.classList.remove("animate-out");
  }

  async function animateOutSlides() {
    await Promise.all(getCurrentlyVisibleSlides().map(slide => animateOutSlide(slide)));
  }

  function currentSlideIsNextUpAndTimerEndingSoon(): boolean {
    if (activeSlideIndex === null) return;

    const currentSlide = getSlideAtIndex(activeSlideIndex);
    if (!currentSlide) return;

    return (currentSlide?.classList.contains("nextup") && !!nextUp?.when &&
    (new Date(nextUp.when).getTime() - Date.now()) < (1000 * 60 * 1.5));
  }

  React.useEffect(() => {
    if (activeSlideIndex === null) return;

    const currentSlide = getSlideAtIndex(activeSlideIndex);

    if (getSlideCount() <= 1) return;
    if (currentSlideIsNextUpAndTimerEndingSoon()) {
      console.debug("'Next Up' is about to end - stop slide progression.");
      return;
    }

    const millisToAnimateOut = ((Number(currentSlide?.dataset.maxDelay) || 1) + 1.5) * 1000;
    const millisDisplayTime = 15000;
    console.debug(`Starting timeout (${millisToAnimateOut + millisDisplayTime}ms) till next slide progression...`);
    const timeout = setTimeout(progressActiveSlideIndex, millisToAnimateOut + millisDisplayTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [slides, nextUp, activeSlideIndex]);

  async function progressActiveSlideIndex() {
    await animateOutSlides();

    let newActiveSlideIndex = 0;
    if (activeSlideIndex !== null) {
      newActiveSlideIndex = (activeSlideIndex + 1) % getSlideCount();
    }
    setActiveSlideIndex(newActiveSlideIndex);
  }

  React.useEffect(() => {
    void displayActiveSlide();
  }, [nextUp, slides, activeSlideIndex]);

  async function displayActiveSlide() {
    const containerElement = containerRef.current;

    if (!containerElement || !getSlideCount()) {
      return;
    }

    if (activeSlideIndex === null) return;

    const currentSlide = getSlideAtIndex(activeSlideIndex);
    if (!currentSlide) return;

    currentSlide.classList.add("animate-in");

    return currentSlide;
  }

  return (
    <div className="slides" ref={containerRef}>
      <NextUpSlide className="nextup" {...nextUp} />
      {slides?.map((slideText, slideIndex) => <Slide
        key={slideIndex}
        slideText={slideText}
      />)}
    </div>
  );
}
