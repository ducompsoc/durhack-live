"use client";

import * as React from "react";
import { Form, Formik, FormikValues } from "formik";

interface IOverlayFormProps {
  initialValues: FormikValues;
  handleSubmit: any;
  children: React.ReactNode;
}

export const OverlayForm = React.memo(({ initialValues, handleSubmit, children }: IOverlayFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form>
        {children}
      </Form>
    </Formik>
  );
});
