'use client';

import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

export interface IScheduledEvent {
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
	startedAt: Date;
	overlay: IOverlayState;
	announcement: {
		enabled: boolean;
		title: string;
		text: string;
		buttonText: string;
		buttonLink: string;
	};
	tips: string[];
}

export interface IHackathonConnectedConnection {
	connected: true;
	role: string | null;
	state: IHackathonState;
}

export type THackathonConnection = IHackathonConnectedConnection | { connected: false; role: string | null; state: IHackathonState | null };

const events = new EventEmitter();
let lastConnection: THackathonConnection = { connected: false, role: null, state: null };
let socket: Socket | null = null;

async function getBearerToken(): Promise<string> {

}

export function connect() {
  socket = io(window.location.origin);

  let userRole: string | null = null;

  socket.on('connect', async () => {
    console.log('Connected. Authenticating...');

    if (!sessionStorage.getItem('durhack-live-api-token-2023')) {
      sessionStorage.setItem('durhack-live-api-token-2023', await getBearerToken());
    }

		socket!.emit('authenticate', sessionStorage.getItem('durhack-live-api-token-2023'), (err: Error | string | null, role: string | null) => {
		  if (err) {
		    if (err === 'Auth failed.') {
		      sessionStorage.removeItem('durhack-live-api-token-2023');
          console.error('Couldn\'t authenticate socket connection - bad API token');
          return;
		    }

		    console.error(err);
		    return;
		  }

		  userRole = role;
		  if (lastConnection.connected) {
		    lastConnection.role = role;
		    events.emit('connection', lastConnection);
		  }

		  console.info('Authenticated.');
		});
  });

  socket.on('globalState', (state: IHackathonState) => {
    lastConnection = { connected: true, role: userRole, state };
    events.emit('connection', lastConnection);
  });

  socket.on('disconnect', () => {
    lastConnection = { connected: false, role: userRole, state: lastConnection ? lastConnection.state : null };
    events.emit('connection', lastConnection);
  });
}

export function pushHackathon(newState: IHackathonState) {
  if (socket) {
    socket.emit('pushState', newState);
  }
}

export function useHackathon(): THackathonConnection {
  const [connection, setConnection] = React.useState<THackathonConnection>(lastConnection);

  React.useEffect(() => {
    function handleConnection(result: THackathonConnection) {
      setConnection(result);
    }

    events.on('connection', handleConnection);
    return () => {
      events.removeListener('connection', handleConnection);
    };
  });

  return connection;
}

if (typeof window !== 'undefined' && localStorage.getItem('token')) {
  connect();
}
