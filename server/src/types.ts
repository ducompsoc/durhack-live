interface IScheduledEvent {
    name: string;
    icon: string;
    liveLink: string | null;
    recordingLink: string | null;
    start: string;
    end: string;
    state: 'scheduled' | 'in-progress' | 'done';
    onStream: boolean;
}

interface IOverlayState {
    currentScene: {
        scene: string;
        countdown: number;
        music: boolean;
    },
    main: {
        darkMode: boolean;
        nextUp: {
            enabled: boolean;
            pretext: string;
            text: string;
            when: string;
        };
        slides: string[];
    };
    feature: {
        enabled: boolean;
        icon: string;
        title: string;
        text: string;
    };
    upperThird: {
        enabled: boolean;
        text: string;
    };
    lowerThird: {
        enabled: boolean;
		icon: string;
		pretext: string;
		text: string;
		when: string;
    };
    milestone: {
        enabled: boolean;
        text: string;
        when: string;
    };
    youtube: {
        enabled: boolean;
        queue: {
            id: string;
            lowerThird: string;
        }[];
        skipped: number;
    };
}

export interface IHackathonState {
    schedule: IScheduledEvent[];
    announcement: {
        enabled: boolean;
        title: string;
        text: string;
        buttonText: string;
        buttonLink: string;
    };
    tips: string[];
    startedAt: Date;
    overlay: IOverlayState;
}