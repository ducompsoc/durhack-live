'use client';

import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react';
import { useRouter } from 'next/navigation';

import { makeLiveApiRequest } from '@/app/util/api';

import { ErrorAlert, FormSection, Button, Textbox } from './components';

export default function LoginPage() {
  const [error, setError] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const router = useRouter();

  function setUnknownError() {
    setError(`An unknown error occurred. Please try a refresh, and if you\'re still having problems,
      ask a member of the DurHack team.`
    );
  }

  async function handleEmailSubmit(submissionEmail: string): Promise<void> {
    const request = await makeLiveApiRequest('/auth/check-email', {
      method: 'POST',
      body: new URLSearchParams({ email: submissionEmail }),
    });

    let check_email_response: Response;
    try {
      check_email_response = await fetch(request);
    } catch (error) {
      return setUnknownError();
    }

    if (check_email_response.status === 404) {
      return setError(`We can\'t find a DurHack ticket for that email address. If you\'re a Durham student,
          you might want to try both your name and CIS code (e.g. if john.smith@durham.ac.uk doesn\'t work, try
          abcd12@durham.ac.uk). If you\'re still struggling, please chat to a member of the DurHack team; it could be
          a mistake.`
      );
    }

    if (!check_email_response.ok) {
      return setUnknownError();
    }

    const user_details = await check_email_response.json();

    if (!user_details.password_set) {
      const redirect_to = new URL('/login/set-password', window.location);
      redirect_to.searchParams.set('email', submissionEmail);
      return router.push(redirect_to.toString());
    }

    setEmail(submissionEmail);
  }

  async function handlePasswordSubmit(submissionPassword: string): Promise<void> {
    const login_request = await makeLiveApiRequest('/auth/login', {
      method: 'POST',
      body: new URLSearchParams({ email: email, password: submissionPassword }),
    });

    let login_response: Response;
    try {
      login_response = await fetch(login_request);
    } catch (error) {
      return setUnknownError();
    }

    if (login_response.status === 401) {
      return setError('Incorrect password.');
    }

    if (!login_response.ok) {
      return setUnknownError();
    }

    const profile_request = await makeLiveApiRequest('/users/me');
    let profile_response: Response;
    try {
      profile_response = await fetch(profile_request);
    } catch (error) {
      return setUnknownError();
    }

    if (!profile_response.ok) {
      return setUnknownError();
    }

    const profile = await profile_response.json();
    if (!profile.checked_in) {
      return router.push('/login/check-in');
    }
    return router.push('/');
  }

  const handleSubmit = React.useCallback(async (submission: { email?: string, password?: string }) => {
    setError(undefined);

    if (submission.password) {
      return await handlePasswordSubmit(submission.password);
    }

    if (submission.email) {
      return await handleEmailSubmit(submission.email);
    }

    throw new Error('Validation failed.');
  }, []);

  function PasswordFormSection() {
    if (!email) return <></>;
    return (
      <FormSection>
        <label htmlFor="password">Password:</label>
        <Textbox
          name="password"
          type="password"
          placeholder="Your password"
          minLength={6}
          required
          autoFocus
        />
        <ErrorMessage name="password"/>
      </FormSection>
    );
  }

  function EmailFormSection() {
    if (email) return <></>;
    return (
      <FormSection>
        <label htmlFor="email">Email address:</label>
        <Textbox
          name="email"
          type="email"
          placeholder="your.name@durham.ac.uk"
          required
        />
        <ErrorMessage name="email"/>
      </FormSection>
    );
  }

  return (
    <main>
      <Formik
        initialValues={{ email: '', password: '', }}
        onSubmit={handleSubmit}
      >
        <Form>
          {error ? <ErrorAlert>{error}</ErrorAlert> : <></>}
          <EmailFormSection/>
          <PasswordFormSection/>
          <p>
            <Button type="submit">Log in</Button>
          </p>
        </Form>
      </Formik>
    </main>
  );
}
