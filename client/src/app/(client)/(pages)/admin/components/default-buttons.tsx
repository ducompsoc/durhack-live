"use client"

import { useFormikContext } from "formik"
import * as React from "react"

import { Buttons } from "."

export const DefaultButtons = React.memo(() => {
  const formik = useFormikContext()

  return (
    <Buttons>
      <button type="button" className="dh-btn" onClick={formik.handleReset} disabled={!formik.dirty}>
        Reset
      </button>{" "}
      <button type="submit" className="dh-btn" disabled={!formik.dirty}>
        Submit
      </button>
    </Buttons>
  )
})
