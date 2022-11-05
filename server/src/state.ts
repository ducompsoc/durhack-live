import { join } from 'path';
import { readFileSync, promises } from 'fs';

import { IHackathonState } from './types';

interface IAugmentedHackathonState extends IHackathonState {
    milestoneMillis: number | null;
}

let state: IHackathonState = {
    schedule: [
        {
            name: 'Registration',
            icon: 'fas fa-clipboard-list',
            liveLink: '',
            recordingLink: '',
            start: '2021-02-19T09:30:00.000Z',
            end: '2021-02-19T11:00:00.000Z',
            state: 'scheduled',
            onStream: false,
        },
        {
            name: 'Opening Keynote',
            icon: 'fas fa-microphone',
            liveLink: '',
            recordingLink: '',
            start: '2021-02-19T11:15:00.000Z',
            end: '2021-02-19T11:45:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Team-Forming Activity',
            icon: 'fas fa-lightbulb',
            liveLink: '',
            recordingLink: '',
            start: '2021-02-19T11:45:00.000Z',
            end: '2021-02-19T12:00:00.000Z',
            state: 'scheduled',
            onStream: false,
        },
        {
            name: 'Hacking Begins',
            icon: 'fas fa-laptop-code',
            liveLink: '',
            recordingLink: '',
            start: '2021-02-19T12:00:00.000Z',
            end: '',
            state: 'scheduled',
            onStream: false,
        },
        {
            name: 'Workshop 1',
            icon: 'fas fa-tools',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T12:30:00.000Z',
            end: '2020-11-14T13:15:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Workshop 2',
            icon: 'fas fa-tools',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T13:30:00.000Z',
            end: '2020-11-14T14:15:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Workshop 3',
            icon: 'fas fa-tools',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T14:30:00.000Z',
            end: '2020-11-14T15:15:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Workshop 4',
            icon: 'fas fa-tools',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T15:30:00.000Z',
            end: '2020-11-14T16:15:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Workshop 5',
            icon: 'fas fa-tools',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T16:30:00.000Z',
            end: '2020-11-14T17:15:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Chatting with Durham Groups Live',
            icon: 'fas fa-microphone-alt',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T18:00:00.000Z',
            end: '2020-11-14T19:00:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Chatting Hackathons Panel Live',
            icon: 'fas fa-microphone-alt',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T20:00:00.000Z',
            end: '2020-11-14T21:00:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Mini-Event',
            icon: 'fas fa-dice',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-14T22:00:00.000Z',
            end: '2020-11-14T23:00:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Devpost Submission Deadline',
            icon: 'fas fa-calendar-check',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-15T11:00:00.000Z',
            end: '',
            state: 'scheduled',
            onStream: false,
        },
        {
            name: 'Hacking Ends',
            icon: 'fas fa-laptop-code',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-15T12:00:00.000Z',
            end: '',
            state: 'scheduled',
            onStream: false,
        },
        {
            name: 'Hacking Video Stream',
            icon: 'fas fa-photo-video',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-15T13:00:00.000Z',
            end: '2020-11-15T15:30:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
        {
            name: 'Closing Ceremony',
            icon: 'fas fa-bullhorn',
            liveLink: '',
            recordingLink: '',
            start: '2020-11-15T17:00:00.000Z',
            end: '2020-11-15T18:00:00.000Z',
            state: 'scheduled',
            onStream: true,
        },
    ],
    announcement: {
        enabled: false,
        title: '',
        text: '',
        buttonText: '',
        buttonLink: '',
    },
    tips: [],
    startedAt: new Date(),
    overlay: {
        currentScene: {
            scene: 'Default',
            countdown: 0,
            music: true,
        },
        main: {
            darkMode: false,
            nextUp: {
                enabled: false,
                pretext: 'Next up',
                text: '',
                when: '',
            },
            slides: [],
        },
        feature: {
            enabled: false,
            icon: '',
            title: '',
            text: '',
        },
        upperThird: {
            enabled: false,
            text: '',
        },
        lowerThird: {
            enabled: false,
            icon: '',
            text: '',
        },
        milestone: {
            enabled: false,
            text: '',
            when: '',
        },
        youtube: {
            enabled: false,
            queue: [],
            skipped: 0,
        },
    },
};

try {
    state = JSON.parse(readFileSync(join(__dirname, '../state.json')).toString());
} catch (err) {
    console.error('Could not read state.');
    console.error(err);
}

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

    promises.writeFile(join(__dirname, '../state.json'), JSON.stringify(state)).then(() => {
        console.log('Written state to disk.');
    }).catch(err => {
        console.error('Failed to write state to disk.');
        console.error(err);
    });
}
