'use client';

import React from 'react';
import { Button, ErrorAlert, FormSection, Textbox } from '@/app/login/components';
import { Formik, ErrorMessage, Form, Field, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import { makeLiveApiRequest } from '@/app/util/api';

export default function CheckInPage() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>();
  const router = useRouter();

  function setUnknownError() {
    setError(`An unknown error occurred. Please try a refresh, and if you\'re still having problems,
      ask a member of the DurHack team.`
    );
  }

  const handleSubmit = React.useCallback(async (submission: any) => {
    setError(undefined);

  }, []);

  function ErrorMessage() {
    if (!error) return <></>;
    return <ErrorAlert>{error}</ErrorAlert>;
  }

  function LoadingMessage() {
    if (!loading) return <></>;
    return <div>
      <ErrorMessage/>
      <p>Verifying your details...</p>
    </div>;
  }

  function CheckInForm() {
    const { values, setValues } = useFormikContext();

    React.useEffect(() => {
      (async () => {
        const profile_request = await makeLiveApiRequest('/users/me');
        let profile_response: Response;
        try {
          profile_response = await fetch(profile_request);
        } catch (error) {
          return setUnknownError();
        }

        if (profile_response.status === 401) return router.push('/login');

        if (!profile_response.ok) {
          return setUnknownError();
        }

        const profile = (await profile_response.json()).data;

        if (profile.checked_in) return router.push('/');

        console.log(profile);

        await setValues({
          age: profile.age || values.age,
          phone_number: profile.phone_number || values.phone_number,
          university: profile.university || values.university,
          graduation_year: profile.graduation_year || values.graduation_year,
          ethnicity: profile.ethnicity || values.ethnicity,
          gender: profile.gender || values.gender,
          h_UK_consent: profile.h_UK_consent || values.h_UK_consent,
          h_UK_marketing: profile.h_UK_marketing || values.h_UK_marketing,
        });

        setLoading(false);
      })();
    }, []);

    if (loading) return <></>;

    return (
      <>
        <ErrorMessage/>
        <p>
          Welcome to DurHack! To check-in, please make sure the details below are correct, and fill in any we&rsquo;re missing.
        </p>

        <FormSection>
          <label htmlFor="age">Age:</label>
          <Textbox
            name="age"
            type="number"
            min={18}
            placeholder="Age"
            required
          />
          <ErrorMessage name="age"/>
        </FormSection>

        <FormSection>
          <label htmlFor="phone_number">Phone number:</label>
          <Textbox
            name="phone_number"
            type="text"
            placeholder="Phone number"
            required
          />
          <ErrorMessage name="phone_number"/>
        </FormSection>

        <FormSection>
          <label htmlFor="university">University:</label>
          <Textbox
            name="university"
            type="text"
            placeholder="University"
            required
          />
          <ErrorMessage name="university"/>
        </FormSection>

        <FormSection>
          <label htmlFor="graduation_year">Graduation Year:</label>
          <Textbox
            name="graduation_year"
            type="text"
            placeholder="Graduation Year"
            required
          />
          <ErrorMessage name="graduation_year"/>
        </FormSection>

        <FormSection>
          <label htmlFor="ethnicity">Ethnicity (optional): </label>
          <Field as="select"
            name="ethnicity"
            placeholder="Ethnicity"
            required
          >
            <option value="american">American Indian or Alaskan Native</option>
            <option value="asian">Asian / Pacific Islander</option>
            <option value="black">Black or African American</option>
            <option value="hispanic">Hispanic</option>
            <option value="white">White / Caucasian</option>
            <option value="multiple">Multiple ethnicity / Other</option>
            <option value="pnts">Prefer not to say</option>
          </Field>
          <ErrorMessage name="ethnicity"/>
        </FormSection>

        <FormSection>
          <label htmlFor="gender">Gender (optional): </label>
          <Field as="select"
            name="gender"
            placeholder="Gender"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Non-Binary / Third Gender</option>
            <option value="other">Other</option>
            <option value="pnts">Prefer not to say</option>
          </Field>
          <ErrorMessage name="gender"/>
        </FormSection>

        <FormSection>
          <Field type="checkbox" name="h_UK_consent" required />
          <label htmlFor="h_UK_consent" style={{ textTransform: 'none' }}> (required){' '}
            <span style={{ fontWeight: 'normal' }}>I authorise you to share my application/registration information with Hackathons UK Limited for event administration, Hackathons UK Limited administration, and with my authorisation email in-line with the Hackathons UK Limited Privacy Policy.</span>
          </label>
          <ErrorMessage name="h_UK_consent"/>
        </FormSection>

        <FormSection>
          <input type="checkbox" name="h_UK_marketing" />
          <label htmlFor="h_UK_marketing" style={{ textTransform: 'none' }}> (optional){' '}
            <span style={{ fontWeight: 'normal' }}>I authorise Hackathons UK Limited to send me occasional messages about hackathons and their activities.
            </span></label>
          <ErrorMessage name="h_UK_marketing"/>
        </FormSection>

        <p>
          <Button type="submit">Check in</Button>
        </p>
      </>
    );
  }

  return (
    <main>
      <Formik
        initialValues={{
          age: '',
          phone_number: '',
          university: '',
          graduation_year: '',
          ethnicity: 'pnts',
          gender: 'pnts',
          h_UK_consent: false,
          h_UK_marketing: false,
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <LoadingMessage/>
          <CheckInForm/>
        </Form>
      </Formik>

    </main>
  );
}
