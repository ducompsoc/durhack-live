import { useFormik } from 'formik';
import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { query } from '../../util/api';
import { connect } from '../../util/socket';

const FormSection = styled.div`
	padding: 16px 0px;
`;

const ErrorAlert = styled.p`
	color: #ff6060;
`;

const Textbox = styled.input`
	width: 100%;
	max-width: 480px;
	background: none;
	border: none;
	border-bottom: solid 1px #fff;
	font-size: 32px;
	color: #fff;
	padding: 9px 0px;
	outline: none;
`;

const Button = styled.button`
	display: inline-block;
	background-color: ${p => p.theme.secondaryA};
	box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
	border: none;
	border-radius: 100px;
	font-size: 20px;
	padding: 12px 48px;
	transition: .3s ease;
	outline: none;

	&:hover {
		opacity: 0.8;
	}
`;

/* eslint-disable jsx-a11y/label-has-associated-control */
export const LoginForm = React.memo(() => {
	const [error, setError] = React.useState<string>();
	const [email, setEmail] = React.useState<string>();
	const [authType, setAuthType] = React.useState<'code' | 'password'>();
	const [passwordCreation, setPasswordCreation] = React.useState<boolean>(false);
	const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

	const errorMessage = error ? <ErrorAlert>{error}</ErrorAlert> : <></>;

	const handleSubmit = React.useCallback((submission: { email?: string; code?: string; password?: string; confirmPassword?: string }) => {
		setError(undefined);

		if (passwordCreation) {
			if (submission.password !== submission.confirmPassword) {
				setError('The two passwords you entered are not the same.');

				return;
			}

			query('POST', 'password', { password: submission.password })
				.then(() => {
					setLoggedIn(true);
				})
				.catch(err => {
					console.error(err);

					setError(
						'An unknown error occurred. Please try a refresh, and if you\'re still having problems, ask an '
						+ 'organiser on Slack or email hello@durhack.com.',
					);
				});
		}

		let body: { email?: string; verifyCode?: string; password?: string } = {};
		if (authType === undefined) {
			body = { email: submission.email };
		} else if (authType === 'code') {
			body = { email, verifyCode: submission.code };
		} else if (authType === 'password') {
			body = { email, password: submission.password };
		}

		query('POST', 'auth', body)
			.then(res => {
				if (res.statusCode === 400) {
					if (res.message === 'Incorrect email.') {
						setError(
							'We can\'t find a DurHack ticket for that email address. Please be sure you\'re using '
							+ 'your @durham.ac.uk Durham email address, and that it\'s spelt correctly. If you\'re '
							+ 'still struggling, please reach out to an Organiser; it could be a mistake.',
						);

						return;
					}

					setEmail(submission.email);

					if (res.message === 'Password required.') {
						setAuthType('password');

						return;
					}

					if (res.message === 'Verification code required.') {
						setAuthType('code');

						return;
					}

					setError(res.message);
					return;
				}

				if (res.token) {
					localStorage.setItem('token', res.token);
					connect();

					if (authType === 'code') {
						setPasswordCreation(true);
					} else {
						setLoggedIn(true);
					}

					return;
				}

				throw new Error(res);
			})
			.catch(err => {
				console.error(err);

				setError(
					'An unknown error occurred. Please try a refresh, and if you\'re still having problems, ask an '
					+ 'organiser on Slack or email hello@durhack.com.',
				);
			});
	}, [authType, email, passwordCreation]);

	const formik = useFormik({
		initialValues: {
			email: '',
			code: '',
			password: '',
			confirmPassword: '',
		},
		onSubmit: handleSubmit,
	});

	let formContent = <></>;
	if (passwordCreation) {
		formContent = (
			<>
				<p>Thanks, you&apos;re in!</p>

				<p>
					One last thing: next time you log in, we&apos;d like to ask you for a password instead. What{' '}
					would you like your password to be?
				</p>

				<FormSection>
					<label htmlFor="password">Password:</label>
					<Textbox
						key="createPassword"
						id="password"
						type="password"
						minLength={6}
						placeholder="Choose a password"
						required
						{...formik.getFieldProps('password')}
					/>
				</FormSection>

				<FormSection>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<Textbox
						key="createPasswordConfirm"
						id="confirmPassword"
						type="password"
						minLength={6}
						placeholder="Type your password again"
						required
						{...formik.getFieldProps('confirmPassword')}
					/>
				</FormSection>
			</>
		);
	} else if (authType === 'code') {
		formContent = (
			<>
				<p>
					Welcome to DurHack! To confirm you are a Durham student, we&apos;ve just emailed you a verification code.
				</p>
				<p>
					<strong>Please check your email, and type your code in here.</strong> Make sure you double-check your spam folder.{' '}
					If it&apos;s been a while and you still don&apos;t have one, please reach out to an Organiser.
				</p>

				<FormSection>
					<label htmlFor="code">Verification code:</label>
					<Textbox
						key="code"
						id="code"
						type="text"
						placeholder="ABC123"
						required
						{...formik.getFieldProps('code')}
					/>
				</FormSection>
			</>
		);
	} else if (authType === 'password') {
		formContent = (
			<>
				<FormSection>
					<label htmlFor="password">Password:</label>
					<Textbox
						key="password"
						id="password"
						type="password"
						placeholder="Your password"
						minLength={6}
						required
						autoFocus
						{...formik.getFieldProps('password')}
					/>
				</FormSection>
			</>
		);
	} else {
		formContent = (
			<>
				<FormSection>
					<label htmlFor="email">Email address:</label>
					<Textbox
						key="email"
						id="email"
						type="email"
						placeholder="your.name@durham.ac.uk"
						required
						{...formik.getFieldProps('email')}
					/>
				</FormSection>
			</>
		);
	}

	if (loggedIn) {
		return <Redirect to="/" />;
	}

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				{errorMessage}

				{formContent}

				<p>
					<Button type="submit">{passwordCreation ? 'Set password' : 'Log in'}</Button>
				</p>
			</form>
		</div>
	);
});
