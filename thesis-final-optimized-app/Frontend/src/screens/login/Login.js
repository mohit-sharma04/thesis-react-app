import React, { useState, lazy } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@material-ui/core";

const ErrorPopover = lazy(() => import("../../common/ErrorPopover"));

const Login = ({ loginUser, isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmailClass, setInvalidEmailClass] = useState("none");
  const [anchorEl, setAnchorEl] = useState(null);

  const setParentAnchorElNull = () => {
    setAnchorEl(null);
  };

  const changeEmailHandler = (event) => {
    setEmail(event.target.value);
    setInvalidEmailClass("none");
  };

  const changePasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  const loginHandler = async (event) => {
    event.preventDefault();

    if (email === "") {
      setAnchorEl(event.currentTarget.children[0]);
      return;
    }

    if (password === "") {
      setAnchorEl(event.currentTarget.children[2]);
      return;
    }

    const emailPattern =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

    if (!email.match(emailPattern)) {
      setInvalidEmailClass("block");
      return;
    }

    setInvalidEmailClass("none");
    loginUser(email, password);
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={loginHandler}>
        <FormControl required margin="dense">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            value={email}
            type="email"
            onChange={changeEmailHandler}
          />
          {email && invalidEmailClass === "block" && (
            <FormHelperText className={invalidEmailClass}>
              <span className="red">Enter valid Email</span>
            </FormHelperText>
          )}
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <FormControl required margin="dense">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={changePasswordHandler}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />
        {isLogin && (
          <FormControl>
            <span>Login Successful.</span>
          </FormControl>
        )}
        <br />
        <Button variant="contained" color="primary" type="submit">
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default Login;
