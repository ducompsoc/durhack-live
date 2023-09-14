"use client";
import React from "react";
import { useFormikContext } from "formik";

import { Buttons } from "./";

const DefaultOverlayFormButtons = React.memo(() => {
  const formik = useFormikContext();

  return (
    <Buttons>
      <button type="button" onClick={formik.handleReset} disabled={!formik.dirty}>Reset</button>{" "}
      <button type="submit" disabled={!formik.dirty}>Submit</button>
    </Buttons>
  );
});

export default DefaultOverlayFormButtons;
