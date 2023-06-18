import React, { useState, useEffect, lazy } from "react";
import "./Header.css";
import logo from "../../assets/logo.jpeg";
import Modal from "react-modal";
import {
  Button,
  Tabs,
  Tab,
  CardHeader,
  CardContent,
  Card,
} from "@material-ui/core";

const TabContainer = lazy(() => import("../tabContainer/TabContainer"));
const Login = lazy(() => import("../../screens/login/Login"));
const Register = lazy(() => import("../../screens/register/Register"));

Modal.setAppElement(document.getElementById("root"));

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "0px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Header = ({ baseUrl, isLogin, setIsLogin }) => {
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(0);

  const toggleModalHandler = () => {
    setOpenModal(!openModal);
  };

  const tabSwitchHandler = (_, newValue) => {
    setValue(newValue);
  };

  const logoutHandler = async () => {
    const url = baseUrl + "auth/logout";
    const params = sessionStorage.getItem("accessToken");

    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${params}`,
        },
      });

      if (rawResponse.ok) {
        sessionStorage.clear();
        setIsLogin(false);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const loginUser = async (email, password) => {
    const url = baseUrl + "auth/login";
    const params = window.btoa(`${email}:${password}`);

    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Basic ${params}`,
        },
      });

      if (rawResponse.ok) {
        const response = await rawResponse.json();
        window.sessionStorage.setItem("user-details", JSON.stringify(response));
        window.sessionStorage.setItem("userId", JSON.stringify(response.id));
        window.sessionStorage.setItem("accessToken", response.accessToken);
        setIsLogin(true);
        setTimeout(toggleModalHandler, 2000);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      alert(`${error.message} Please enter correct details.`);
    }
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("accessToken") !== null;
    setIsLogin(isLoggedIn);
  }, [setIsLogin]);

  return (
    <div>
      <header className="header">
        <span>
          <img src={logo} className="logo" alt="logo" />
          <span className="brandTitle">Doctor Finder</span>
        </span>

        <div className="login-button">
          {isLogin ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={toggleModalHandler}
            >
              Login
            </Button>
          )}
        </div>
      </header>
      <Modal
        ariaHideApp={false}
        isOpen={openModal}
        onRequestClose={toggleModalHandler}
        style={customStyles}
      >
        <Card>
          <CardHeader className="cardHeader" title="Authentication" />
          <CardContent>
            <Tabs value={value} onChange={tabSwitchHandler}>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            <TabContainer>
              {value === 0 && <Login loginUser={loginUser} isLogin={isLogin} />}
              {value === 1 && (
                <Register
                  baseUrl={baseUrl}
                  toggleModalHandler={toggleModalHandler}
                  loginUser={loginUser}
                />
              )}
            </TabContainer>
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
};

export default Header;
