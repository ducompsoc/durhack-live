import { readFileSync, promises } from "fs";

import { IHackathonState } from "@/common/types";

interface IAugmentedHackathonState extends IHackathonState {
    milestoneMillis: number | null;
}

const stateFile = new URL("../../state/cache.json", import.meta.url);
const defaultStateFile = new URL("../../state/default.json", import.meta.url);

function loadStateFromFile(file: URL): IHackathonState {
    return JSON.parse(readFileSync(file.toString()).toString()) as IHackathonState;
}

function loadState(): IHackathonState {
    try {
        return loadStateFromFile(stateFile);
    } catch (err) {
        console.error("Could not read state.");
        console.error(err);
    }

    console.info("Loading state from default...");
    try {
        return loadStateFromFile(defaultStateFile);
    } catch (err) {
        console.error("Could not read default state.");
        console.error(err)
    }

    process.exit(1);
}

let state: IHackathonState = loadState();

export function getHackathonState(): IAugmentedHackathonState {
    const milestone = state.overlay.milestone.when;
    const date = new Date(milestone).getTime()

    return {
        ...state,
        milestoneMillis: !milestone || isNaN(date) ? null : Math.max(0, date - Date.now()),
    };
}

export function setHackathonState(newState: IHackathonState) {
    state = newState;

    promises.writeFile(stateFile.toString(), JSON.stringify(state)).then(() => {
        console.log("Written state to disk.");
    }).catch(err => {
        console.error("Failed to write state to disk.");
        console.error(err);
    });
}
