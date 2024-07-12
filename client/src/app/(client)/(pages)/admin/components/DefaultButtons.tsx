"use client";
import React from "react";
import { useFormikContext } from "formik";
import { Buttons } from ".";

const DefaultOverlayFormButtons = React.memo(() => {
  const formik = useFormikContext();

  return (
    <Buttons>
      <button type="button" className="dh-btn" onClick={formik.handleReset} disabled={!formik.dirty}>Reset</button>{" "}
      <button type="submit" className="dh-btn" disabled={!formik.dirty}>Submit</button>
    </Buttons>
  );
});

export default DefaultOverlayFormButtons;
