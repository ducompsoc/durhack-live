import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { EventPage } from './components/event-page/EventPage';
import { LoginPage } from './components/login-page/LoginPage';
import { AdminPage } from './components/admin-page/AdminPage';

const theme = {
	primaryLight: '#842FD7',
	primaryDark: '#751C9E',
	secondaryA: '#C5E3B3',
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

				<Route path="/login">
					<LoginPage />
				</Route>
			</Switch>
		</Router>
	</ThemeProvider>
));
