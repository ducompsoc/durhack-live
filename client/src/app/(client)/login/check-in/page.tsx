"use client";

import React from "react";
import { Formik, ErrorMessage as FormikErrorMessage, Form, Field, useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { makeLiveApiRequest } from "@/app/util/api";
import { attemptStateSocketAuth } from "@/app/util/socket";

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

    const check_in_request = await makeLiveApiRequest("/user/check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        checked_in: true,
        ...submission,
      }),
    });

    let check_in_response: Response;
    try {
      check_in_response = await fetch(check_in_request);
    } catch (error) {
      return setUnknownError();
    }

    if (check_in_response.status === 400) return setError("Form contains invalid input.");
    if (check_in_response.status === 401) return router.push("/login");

    if (!check_in_response.ok) return setUnknownError();

    void attemptStateSocketAuth();

    const get_redirect_request = await makeLiveApiRequest("/auth/login", {
      redirect: "follow",
    });

    let get_redirect_response: Response;
    try {
      get_redirect_response = await fetch(get_redirect_request);
    } catch (error) {
      return setUnknownError();
    }

    if (!get_redirect_response.ok) return setUnknownError();

    if (get_redirect_response.redirected) return router.push(get_redirect_response.url);
  }, []);

  function ErrorMessage() {
    if (!error) return <></>;
    return <p className="dh-err">{error}</p>;
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
        const profile_request = await makeLiveApiRequest("/user");
        let profile_response: Response;
        try {
          profile_response = await fetch(profile_request);
        } catch (error) {
          return setUnknownError();
        }

        if (profile_response.status === 401) return router.push("/login");

        if (!profile_response.ok) {
          return setUnknownError();
        }

        const profile = (await profile_response.json()).data;

        if (profile.checked_in || profile.role !== "hacker") return router.push("/");

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
      <div className="grid gap-y-2">
        <ErrorMessage />
        <p>
          Welcome to DurHack! To check-in, please make sure the details below
          are correct, and fill in any we&rsquo;re missing.
        </p>

        <div>
          <label htmlFor="age">Age:</label>
          <Field
            className="dh-input w-full"
            name="age"
            type="number"
            min={18}
            placeholder="Age"
            required
          />
          <FormikErrorMessage name="age" />
        </div>

        <div>
          <label htmlFor="phone_number">Phone number:</label>
          <Field
            className="dh-input w-full"
            name="phone_number"
            type="text"
            placeholder="Phone number"
            required
          />
          <FormikErrorMessage name="phone_number" />
        </div>

        <div>
          <label htmlFor="university">University:</label>
          <Field
            className="dh-input w-full"
            name="university"
            type="text"
            placeholder="University"
            required
          />
          <FormikErrorMessage name="university" />
        </div>

        <div>
          <label htmlFor="graduation_year">Graduation Year:</label>
          <Field
            className="dh-input w-full"
            name="graduation_year"
            type="number"
            min={2020}
            max={2030}
            placeholder="Graduation Year"
            required
          />
          <FormikErrorMessage name="graduation_year" />
        </div>

        <div>
          <label htmlFor="ethnicity">Ethnicity (optional): </label>
          <Field
            className="dh-input w-full"
            as="select"
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
          <FormikErrorMessage name="ethnicity" />
        </div>

        <div>
          <label htmlFor="gender">Gender (optional): </label>
          <Field
            className="dh-input w-full"
            as="select"
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
          <FormikErrorMessage name="gender" />
        </div>

        <div>
          <label>
            <Field
              className="dh-check mr-2"
              type="checkbox"
              name="h_UK_consent"
              required
            />
            <span className="font-semibold">(required)</span>
            <br />I authorise you to share my application/registration
            information with Hackathons UK Limited for event administration,
            Hackathons UK Limited administration, and with my authorisation
            email in-line with the Hackathons UK Limited Privacy Policy.
          </label>
          <FormikErrorMessage name="h_UK_consent" />
        </div>

        <div>
          <label>
            <Field
              className="dh-check mr-2"
              type="checkbox"
              name="h_UK_marketing"
            />
            <span className="font-semibold">(optional)</span>
            <br />I authorise Hackathons UK Limited to send me occasional
            messages about hackathons and their activities.
          </label>
          <FormikErrorMessage name="h_UK_marketing" />
        </div>

        <p>
          <button type="submit" className="dh-btn">
            Check in
          </button>
        </p>
      </div>
    );
  }

  return (
    <main>
      <Formik
        initialValues={{
          age: "",
          phone_number: "",
          university: "",
          graduation_year: "",
          ethnicity: "pnts",
          gender: "pnts",
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
