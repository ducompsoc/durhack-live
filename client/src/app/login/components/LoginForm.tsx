'use client';

import { useFormik } from 'formik';
import React from 'react';
import { redirect } from 'next/navigation';
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
const CheckInForm = React.memo(() => {
	const [error, setError] = React.useState<string>();
	const [loading, setLoading] = React.useState<boolean>(false);
	const [checkedIn, setCheckedIn] = React.useState<boolean>(false);

	const errorMessage = error ? <ErrorAlert>{error}</ErrorAlert> : <></>;

	const handleSubmit = React.useCallback((submission: any) => {
		setError(undefined);

		query('POST', 'checkin', submission)
			.then(res => {
				if (res.hUKConsent) {
					localStorage.setItem('checkin', 'true');
					setCheckedIn(true);
					return;
				}

				if (res.message) {
					setError(res.message);
					return;
				}

				throw new Error(res);
			})
			.catch(err => {
				console.error(err);

				setError(
					'An unknown error occurred. Please try a refresh, and if you\'re still having problems, ask a '
					+ 'member of the DurHack team.',
				);
			});
	}, []);

	const formik = useFormik({
		initialValues: {},
		onSubmit: handleSubmit,
	});

	React.useEffect(() => {
		setLoading(true);
		setError(undefined);

		query('GET', 'checkin')
			.then(res => {
				if (res.checkedIn) {
					localStorage.setItem('checkin', 'true');
				}

				setLoading(false);
				setCheckedIn(!!res.checkedIn);
				formik.setValues({
					...res,
					ethnicity: res.ethnicity || 'Prefer not to say',
					gender: res.gender || 'Prefer not to say',
					hUKConsent: res.hUKConsent || false,
					hUKMarketing: res.hUKMarketing || false,
				});
			})
			.catch(err => {
				console.error(err);

				setError(
					'An unknown error occurred. Please try a refresh, and if you\'re still having problems, ask a '
					+ 'member of the DurHack team.',
				);
			});
	}, []);

	if (loading) {
		return <div>{errorMessage}<p>Verifying your details...</p></div>;
	}

	if (checkedIn) {
		return redirect("/");
	}

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<p>
					Welcome to DurHack! To check-in, please make sure the details below are correct, and fill in any we're missing.
				</p>

				<FormSection>
					<label htmlFor="age">Age:</label>
					<Textbox
						key="age"
						id="age"
						type="number"
						min={18}
						placeholder="Age"
						required
						{...formik.getFieldProps('age')}
					/>
				</FormSection>

				<FormSection>
					<label htmlFor="phoneNumber">Phone number:</label>
					<Textbox
						key="phoneNumber"
						id="phoneNumber"
						type="text"
						placeholder="Phone number"
						required
						{...formik.getFieldProps('phoneNumber')}
					/>
				</FormSection>

				<FormSection>
					<label htmlFor="university">University:</label>
					<Textbox
						key="university"
						id="university"
						type="text"
						placeholder="University"
						required
						{...formik.getFieldProps('university')}
					/>
				</FormSection>

				<FormSection>
					<label htmlFor="graduationYear">Graduation Year:</label>
					<Textbox
						key="graduationYear"
						id="graduationYear"
						type="text"
						placeholder="Graduation Year"
						required
						{...formik.getFieldProps('graduationYear')}
					/>
				</FormSection>

				<FormSection>
					<label htmlFor="ethnicity">Ethnicity (optional):</label>
					<select
						key="ethnicity"
						id="ethnicity"
						placeholder="Ethnicity"
						required
						{...formik.getFieldProps('ethnicity')}
					>
						<option value="American Indian or Alaskan Native">American Indian or Alaskan Native</option>
						<option value="Asian / Pacific Islander">Asian / Pacific Islander</option>
						<option value="Black or African American">Black or African American</option>
						<option value="Hispanic">Hispanic</option>
						<option value="White / Caucasian">White / Caucasian</option>
						<option value="Multiple ethnicity / Other">Multiple ethnicity / Other</option>
						<option value="Prefer not to say">Prefer not to say</option>
					</select>
				</FormSection>

				<FormSection>
					<label htmlFor="gender">Gender (optional):</label>
					<select
						key="gender"
						id="gender"
						placeholder="Gender"
						required
						{...formik.getFieldProps('gender')}
					>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Non-Binary / Third Gender">Non-Binary / Third Gender</option>
						<option value="Other">Other</option>
						<option value="Prefer not to say">Prefer not to say</option>
					</select>
				</FormSection>

				<FormSection>
					<input type="checkbox" id="hUKConsent" key="hUKConsent" required {...formik.getFieldProps('hUKConsent')} />
					<label htmlFor="hUKConsent" style={{ textTransform: 'none' }}>(required) <span style={{ fontWeight: 'normal' }}>I authorise you to share my application/registration information with Hackathons UK Limited for event administration, Hackathons UK Limited administration, and with my authorisation email in-line with the Hackathons UK Limited Privacy Policy.</span></label>
				</FormSection>

				<FormSection>
					<input type="checkbox" id="hUKMarketing" key="hUKMarketing" {...formik.getFieldProps('hUKMarketing')} />
					<label htmlFor="hUKMarketing" style={{ textTransform: 'none' }}>(optional) <span style={{ fontWeight: 'normal' }}>I authorise Hackathons UK Limited to send me occasional messages about hackathons and their activities.</span></label>
				</FormSection>

				<p>
					<Button type="submit">Check in</Button>
				</p>

				{errorMessage}
			</form>
		</div>
	);
});

/* eslint-disable jsx-a11y/label-has-associated-control */
const LoginForm = React.memo(() => {
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
						'An unknown error occurred. Please try a refresh, and if you\'re still having problems, ask a '
						+ 'member of the DurHack team.',
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
							'We can\'t find a DurHack ticket for that email address. If you\'re a Durham student, you might want ' +
							'to try both your name and CIS code (e.g. if john.smith@durham.ac.uk doesn\'t work, try abcd12@durham.ac.uk). ' +
							'If you\'re still struggling, please chat to a member of the DurHack team; it could be a mistake.',
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
					'An unknown error occurred. Please try a refresh, and if you\'re still having problems, ask a '
					+ 'member of the DurHack team.',
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
					Next time you log in, we&apos;d like to ask you for a password instead. What{' '}
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
					Welcome to DurHack! We&apos;ve just emailed you a verification code.
				</p>
				<p>
					<strong>Please check your email, and type your code in here.</strong> Make sure you double-check your spam folder.{' '}
					If it&apos;s been a while and you still don&apos;t have one, please talk to someone on the DurHack team.
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
		if (localStorage.getItem('checkin')) {
			return redirect("/");
		}

		return <CheckInForm />;
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

export default LoginForm;
