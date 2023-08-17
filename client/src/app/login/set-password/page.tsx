'use client';

import React from 'react';
import { Button, ErrorAlert, FormSection, Textbox } from '@/app/login/components';
import { Formik, ErrorMessage, Form } from 'formik';
import { useRouter } from 'next/navigation';

export default function SetPasswordPage() {
  const [error, setError] = React.useState<string>();
  const [verifyCode, setVerifyCode] = React.useState<string>();
  const router = useRouter();

  function handleVerifyCodeSubmit(verify_code: string): void {

  }

  function handleSetPasswordSubmit(password: string): void {

  }

  const handleSubmit = React.useCallback((submission: { verify_code?: string, password?: string }) => {
    setError(undefined);
    console.log(submission);

    if (submission.password) {
      return handleSetPasswordSubmit(submission.password);
    }

    if (submission.verify_code) {
      return handleVerifyCodeSubmit(submission.verify_code);
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
