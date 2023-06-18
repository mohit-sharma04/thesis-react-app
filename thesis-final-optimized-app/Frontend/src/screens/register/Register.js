import React, { useState, lazy } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
} from "@material-ui/core";

const ErrorPopover = lazy(() => import("../../common/ErrorPopover"));

const Register = ({ baseUrl, loginUser }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [invalidEmailClass, setInvalidEmailClass] = useState("none");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [invalidMobileClass, setInvalidMobileClass] = useState("none");
  const [isRegistered, setIsRegistered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const setParentAnchorElNull = () => {
    setAnchorEl(null);
  };

  const changeFirstNameHandler = (event) => {
    setFirstName(event.target.value);
  };

  const changeLastNameHandler = (event) => {
    setLastName(event.target.value);
  };

  const changeEmailHandler = (event) => {
    setEmail(event.target.value);
    setInvalidEmailClass("none");
  };

  const changeRegistrationPasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  const changeMobileHandler = (event) => {
    setMobile(event.target.value);
    setInvalidMobileClass("none");
  };

  const registerHandler = async (event) => {
    event.preventDefault();

    if (firstName === "") {
      setAnchorEl(event.currentTarget.children[0]);
      return;
    }

    if (lastName === "") {
      setAnchorEl(event.currentTarget.children[3]);
      return;
    }

    if (email === "") {
      setAnchorEl(event.currentTarget.children[6]);
      return;
    }

    if (password === "") {
      setAnchorEl(event.currentTarget.children[9]);
      return;
    }

    if (mobile === "") {
      setAnchorEl(event.currentTarget.children[12]);
      return;
    }

    const emailPattern =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

    const mobilePattern = /^[6-9]\d{9}$/i;

    if (!email.match(emailPattern)) {
      setInvalidEmailClass("block");
      return;
    } else {
      setInvalidEmailClass("none");
    }

    if (!mobile.match(mobilePattern)) {
      setInvalidMobileClass("block");
      return;
    } else {
      setInvalidMobileClass("none");
    }

    let data = {
      emailId: email,
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      password: password,
    };

    const url = `${baseUrl}users/register`;

    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(data),
      });

      if (rawResponse.ok) {
        setIsRegistered(true);
        loginUser(email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={registerHandler} autoComplete="off" noValidate>
        <FormControl required>
          <InputLabel htmlFor="firstname">First Name</InputLabel>
          <Input
            type="text"
            id="firstname"
            onChange={changeFirstNameHandler}
            value={firstName}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        <FormControl required>
          <InputLabel htmlFor="lastname">Last Name</InputLabel>
          <Input
            type="text"
            id="lastname"
            onChange={changeLastNameHandler}
            value={lastName}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        <FormControl required>
          <InputLabel htmlFor="email">Email Id</InputLabel>
          <Input
            id="email"
            type="email"
            onChange={changeEmailHandler}
            value={email}
          />
          {email.length >= 1 && invalidEmailClass === "block" && (
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
        <br />

        <FormControl required>
          <InputLabel htmlFor="registrationPassword">Password</InputLabel>
          <Input
            type="password"
            id="registrationPassword"
            onChange={changeRegistrationPasswordHandler}
            value={password}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        <FormControl required>
          <InputLabel htmlFor="mobile">Mobile No.</InputLabel>
          <Input id="mobile" onChange={changeMobileHandler} value={mobile} />
          {mobile.length >= 1 && invalidMobileClass === "block" && (
            <FormHelperText className={invalidMobileClass}>
              <span className="red">Enter valid mobile number</span>
            </FormHelperText>
          )}
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        {isRegistered && (
          <FormControl>
            <span>Registration Successful.</span>
          </FormControl>
        )}
        <br />
        <Button variant="contained" color="primary" type="submit">
          REGISTER
        </Button>
      </form>
    </div>
  );
};

export default Register;
