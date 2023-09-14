"use client";
import React from "react";
import { Form, Formik, FormikValues } from "formik";

interface IOverlayFormProps {
  initialValues: FormikValues;
  handleSubmit: any;
  children: React.ReactNode;
}

const OverlayForm = React.memo(({ initialValues, handleSubmit, children }: IOverlayFormProps) => {
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

export default OverlayForm;
