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
