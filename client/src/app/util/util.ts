export function classList(selector: string) {
  return document.querySelector(selector)!.classList;
}

export async function waitFor(seconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export function zeroPad(num: number) {
  if (num < 10) {
    return `0${num}`;
  }

  return num.toString();
}
