import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { EventPage } from './components/event-page/EventPage';
import { LoginPage } from './components/login-page/LoginPage';
import { AdminPage } from './components/admin-page/AdminPage';
import { DiscordPage } from './components/discord-page/DiscordPage';
import { SchedulePage } from './components/schedule-page/SchedulePage';

const theme = {
	primaryLight: '#D7BFE7',
	primaryDark: '#751C9E',
	secondaryA: '#D7BFE7',
	secondaryB: '#92CED4',
	dark: '#222',
};

export const App = React.memo(() => (
	<ThemeProvider theme={theme}>
		<Router>
			<Switch>
				<Route exact path="/">
					<EventPage />
				</Route>

				<Route path="/admin">
					<AdminPage />
				</Route>

				<Route path="/discord">
					<DiscordPage />
				</Route>

				<Route path="/schedule">
					<SchedulePage />
				</Route>

				<Route path="/login">
					<LoginPage />
				</Route>
			</Switch>
		</Router>
	</ThemeProvider>
));
