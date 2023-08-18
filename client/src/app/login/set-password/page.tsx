'use client';

import React from 'react';
import { Button, ErrorAlert, FormSection, Textbox } from '@/app/login/components';
import { Formik, ErrorMessage, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { makeLiveApiRequest } from '@/app/util/api';

export default function SetPasswordPage() {
  const [email, setEmail] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [verifyCode, setVerifyCode] = React.useState<string>();
  const router = useRouter();

  React.useEffect( () => {
    (async () => {
      const query_email = new URLSearchParams(window.location.search).get('email');
      if (!query_email) return router.push('/login');
      setEmail(query_email);

      await requestVerifyCode();
    })();
  });

  function setUnknownError() {
    setError(`An unknown error occurred. Please try a refresh, and if you\'re still having problems,
      ask a member of the DurHack team.`
    );
  }

  async function requestVerifyCode(send_again = false) {
    const send_verify_request = await makeLiveApiRequest('/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ email: verify_email, send_again: send_again }),
    });

    let send_verify_response: Response;
    try {
      send_verify_response = await fetch(send_verify_request);
    } catch (error) {
      return setUnknownError();
    }

    if (send_verify_response.status === 304) return;

    if (send_verify_response.status === 404) return router.push('/login');

    if (!send_verify_response.ok) return setUnknownError();
  }

  async function handleVerifyCodeSubmit(submission_verify_code: string): Promise<void> {
    const check_verify_request = await makeLiveApiRequest('/auth/check-verify', {
      method: 'POST',
      body: new URLSearchParams({ email: email, verify_code: submission_verify_code }),
    });

    let check_verify_response: Response;
    try {
      check_verify_response = await fetch(check_verify_request);
    } catch (error) {
      return setUnknownError();
    }

    if (check_verify_response.status === 400) return setError('That\'s not the right code, or it\'s expired - try again.');
    if (check_verify_response.status === 404) return router.push('/login');
    if (!check_verify_response.ok) return setUnknownError();

    setVerifyCode(submission_verify_code);
  }

  async function handleSetPasswordSubmit(submission_password: string): Promise<void> {
    const set_password_request = await makeLiveApiRequest('/auth/set-password', {
      method: 'POST',
      body: new URLSearchParams({ email: email, verify_code: verifyCode, password: submission_password }),
    });

    let set_password_response: Response;
    try {
      set_password_response = await fetch(set_password_request);
    } catch (error) {
      return setUnknownError();
    }

    if (set_password_response.status === 400) return setError('That\'s not the right code, or it\'s expired - try again.');
    if (set_password_response.status === 404) return router.push('/login');
    if (!set_password_response.ok) return setUnknownError();

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

  const handleSubmit = React.useCallback(async (submission: { verify_code?: string, password?: string }) => {
    setError(undefined);
    console.log(submission);

    if (submission.password) {
      return await handleSetPasswordSubmit(submission.password);
    }

    if (submission.verify_code) {
      return await handleVerifyCodeSubmit(submission.verify_code);
    }

    throw new Error('Validation failed.');
  }, []);

  function VerifyCodeFormSection() {
    if (verifyCode) return <></>;
    return (
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
            name="verify_code"
            type="text"
            placeholder="ABC123"
            minLength={6}
            maxLength={6}
            required
          />
        </FormSection>
      </>
    );
  }

  function SetPasswordFormSection() {
    if (!verifyCode) return <></>;
    return (
      <>
        <p>Thanks, you&apos;re in!</p>

        <p>
          Next time you log in, we&apos;d like to ask you for a password instead. What{' '}
          would you like your password to be?
        </p>
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
      </>
    );
  }

  return (
    <main>
      <Formik
        initialValues={{ verify_code: '', password: '', }}
        onSubmit={handleSubmit}
      >
        <Form>
          {error ? <ErrorAlert>{error}</ErrorAlert> : <></>}
          <VerifyCodeFormSection/>
          <SetPasswordFormSection/>
          <p>
            <Button type="submit">{verifyCode ? 'Set Password' : 'Submit'}</Button>
          </p>
        </Form>
      </Formik>
    </main>
  );
}
