import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

import { IHackathonState } from "@/common/types";

interface IAugmentedHackathonState extends IHackathonState {
    milestoneMillis: number | null;
}

const stateFile = fileURLToPath(new URL("../../state/cache.json", import.meta.url));
const defaultStateFile = fileURLToPath(new URL("../../state/default.json", import.meta.url));

async function loadStateFromFile(file: string): Promise<IHackathonState> {
  const file_contents = await readFile(file.toString());
  return JSON.parse(file_contents.toString()) as IHackathonState;
}

async function loadState(): Promise<IHackathonState> {
  try {
    return await loadStateFromFile(stateFile);
  } catch (err) {
    console.error("Could not read state.");
    console.error(err);
  }

  console.info("Loading state from default...");
  try {
    return await loadStateFromFile(defaultStateFile);
  } catch (err) {
    console.error("Could not read default state.");
    console.error(err);
  }

  process.exit(1);
}

export function getHackathonState(): IAugmentedHackathonState {
  const milestone = state.overlay.milestone.when;
  const date = new Date(milestone).getTime();

  return {
    ...state,
    milestoneMillis: !milestone || isNaN(date) ? null : Math.max(0, date - Date.now()),
  };
}

export async function setHackathonState(newState: IHackathonState) {
  state = newState;

  try {
    await writeFile(stateFile.toString(), JSON.stringify(state));
  } catch (error) {
    console.error("Failed to write state to disk.");
    console.error(error);
    return;
  }

  console.log("Written state to disk.");
}

let state: IHackathonState = await loadState();