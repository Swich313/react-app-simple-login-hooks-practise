import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import AuthContext from "../store/auth-context";

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from "../UI/Input/Input";

const inputValidation = (element, type) => {
  if (type === 'password') {
      return element.trim().length > 6
  } else if (type === 'email') {
    return element.includes('@')
  } return false

};

const InputReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT_EMAIL':
      return {value: {email: action.payload, password: state.value.password}, isValid: {email: inputValidation(action.payload, 'email'), password: state.isValid.password}};
    case 'USER_INPUT_PASS':
      return {value: {email: state.value.email, password: action.payload}, isValid: {email: state.isValid.email, password: inputValidation(action.payload, 'password')}};
    case 'INPUT_BLUR':
      return {value: {email: state.value.email, password: state.value.password}, isValid: {email: inputValidation(state.value.email, 'email'), password: inputValidation(state.value.password, 'password')}};
    default:
      return {value: {email: '', password: ''}, isValid: {email: false, password: false}};
  }
};

// const passwordReducer = (state, action) => {
//   switch (action.type) {
//     case 'USER_INPUT':
//       return {value: action.val, isValid: action.val.trim().length > 6};
//     case 'INPUT_BLUR':
//       return {value: state.value, isValid: state.value.trim().length > 6};
//     default:
//       return {value: '', isValid: null};
//   }
// }

const Login = (props) => {

  const [formIsValid, setFormIsValid] = useState(false);

  const [inputState, dispatchInput] = useReducer(InputReducer, {value: {email: '', password: ''}, isValid: {email: null, password: null}});
  // const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isvalid: null});

  const ctx = useContext(AuthContext);

  const {email: isValidEmail} = inputState.isValid;
  const {password: isValidPassword} = inputState.isValid;
  const {email, password} = inputState.value;

  const emailInputRef = useRef();
  const passwordInputRef = useRef();


  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Running!')
      setFormIsValid(
          isValidEmail && isValidPassword
      );
    }, 500);
    return () => {
      console.log('Cleaning up!')
      clearTimeout(timer);
    };
  }, [isValidEmail, isValidPassword]);

  const emailChangeHandler = (event) => {
    dispatchInput({type: 'USER_INPUT_EMAIL', payload: event.target.value});

  };

  const passwordChangeHandler = (event) => {
    dispatchInput({type: 'USER_INPUT_PASS', payload: event.target.value});

  };

  const validateHandler = () => {
    dispatchInput({type: 'INPUT_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) {
      ctx.onLogin(email, password);
    } else if (!isValidEmail) {
        emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();

    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input ref={emailInputRef}
               id="email"
               label="E-mail"
               type="email"
               isValid={isValidEmail}
               value={email}
               onChange={emailChangeHandler}
               onBlur={validateHandler}
        />
        <Input ref={passwordInputRef}
               id="password"
               label="Password"
               type="password"
               isValid={isValidPassword}
               value={password}
               onChange={passwordChangeHandler}
               onBlur={validateHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
