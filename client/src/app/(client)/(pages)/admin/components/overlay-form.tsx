"use client"

import { Form, Formik, type FormikValues } from "formik"
import * as React from "react"

interface IOverlayFormProps {
  initialValues: FormikValues
  handleSubmit: (values: FormikValues) => void
  children: React.ReactNode
}

export const OverlayForm = React.memo(({ initialValues, handleSubmit, children }: IOverlayFormProps) => {
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      <Form>{children}</Form>
    </Formik>
  )
})
