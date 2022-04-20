import React, { useRef, useState } from "react";

const useInput = (validator) => {
  const [value, setvalue] = useState("");
  const [valueIsTouched, setvalueIsTouched] = useState(false);
  const inputRef = useRef();

  const valueIsValid = validator(value);
  const hasError = !valueIsValid && valueIsTouched;

  const valueChangeHandler = (e) => {
    setvalue(e.target.value);
  };

  const valueBlurHandler = () => {
    setvalueIsTouched(true);
  };

  const reset = () => {
    setvalue("");
    setvalueIsTouched(false);
  };

  return {
    value,
    valueIsValid,
    hasError,
    inputRef,
    valueChangeHandler,
    valueBlurHandler,
    reset,
  };
};

export default useInput;
