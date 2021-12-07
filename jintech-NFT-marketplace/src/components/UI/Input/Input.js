import React, { useRef, useImperativeHandle } from "react";
import classes from "./Input.module.css";
const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return { focus: activate };
  });

  return (
    <div
      className={`${classes.control} ${
        props.isValid !== false ? classes.invalid : ""
      }`}
    >
      <div className={classes.labelDiv}>
        <label htmlFor={props.id}>{props.label}</label>
      </div>
      <div className={classes.inputDiv}>
        <input
          ref={inputRef}
          type={props.type}
          id={props.id}
          value={props.value}
          //value={enteredEmail}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
        {props.isValid && props.message && (
          <p className={classes.errorText}>{props.message}</p>
        )}
      </div>
    </div>
  );
});

export default Input;
