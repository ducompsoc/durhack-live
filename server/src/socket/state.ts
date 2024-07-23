import { readFile, writeFile } from "fs/promises"
import path from "node:path"

import { IHackathonState, HackathonStateSchema } from "@/common/schema/hackathon_state"
import { dirname } from "@/dirname";

interface IAugmentedHackathonState extends IHackathonState {
  milestoneMillis: number | null
}

const stateFile = path.resolve(path.join(dirname, "..", "state", "cache.json"))
const defaultStateFile = path.resolve(path.join(dirname, "..", "state", "default.json"))

async function loadStateFromFile(file: string): Promise<IHackathonState> {
  const file_contents = await readFile(file.toString())

  const parsed_file = JSON.parse(file_contents.toString()) as unknown
  return HackathonStateSchema.parse(parsed_file)
}

async function loadState(): Promise<IHackathonState> {
  try {
    return await loadStateFromFile(stateFile)
  } catch (err) {
    console.error("Could not read state.")
    console.error(err)
  }

  console.info("Loading state from default...")
  try {
    return await loadStateFromFile(defaultStateFile)
  } catch (err) {
    console.error("Could not read default state.")
    console.error(err)
  }

  process.exit(1)
}

export function getHackathonState(): IAugmentedHackathonState {
  const milestone = state.overlay.milestone.when
  const date = new Date(milestone).getTime()

  return {
    ...state,
    milestoneMillis: !milestone || isNaN(date) ? null : Math.max(0, date - Date.now()),
  }
}

export async function setHackathonState(newState: IHackathonState) {
  state = newState

  try {
    await writeFile(stateFile.toString(), JSON.stringify(state))
  } catch (error) {
    console.error("Failed to write state to disk.")
    console.error(error)
    return
  }

  console.log("Written state to disk.")
}

let state: IHackathonState = await loadState()
