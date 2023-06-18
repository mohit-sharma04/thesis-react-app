import React, { useState, useEffect, useCallback, lazy } from "react";
import { Tab, Tabs } from "@material-ui/core";

const Header = lazy(() => import("../../common/header/Header"));
const DoctorList = lazy(() => import("../doctorList/DoctorList"));
const Appointment = lazy(() => import("../appointment/Appointment"));

const Home = ({ baseUrl }) => {
  const emailId = JSON.parse(sessionStorage.getItem("userId"));
  const [value, setValue] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);

  const tabSwitchHandler = useCallback((event, value) => {
    setValue(value);
  }, []);

  const getUserAppointments = useCallback(async () => {
    const url = `${baseUrl}users/${emailId}/appointments`;
    const accessToken = sessionStorage.getItem("accessToken");

    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json;Charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (rawResponse.ok) {
        const response = await rawResponse.json();
        setUserAppointments(response);
      } else {
        throw new Error("Some Error Occurred");
      }
    } catch (e) {
      alert(e.message);
    }
  }, [baseUrl, emailId]);

  useEffect(() => {
    if (isLogin) {
      getUserAppointments();
    }
  }, [isLogin, getUserAppointments]);

  return (
    <div>
      <Header baseUrl={baseUrl} isLogin={isLogin} setIsLogin={setIsLogin} />
      <Tabs
        variant="fullWidth"
        indicatorColor="primary"
        value={value}
        onChange={tabSwitchHandler}
      >
        <Tab label="Doctors" />
        <Tab label="Appointment" />
      </Tabs>
      {value === 0 && (
        <DoctorList
          getUserAppointments={getUserAppointments}
          userAppointments={userAppointments}
          baseUrl={baseUrl}
        />
      )}
      {value === 1 && (
        <Appointment
          userAppointments={userAppointments}
          baseUrl={baseUrl}
          isLogin={isLogin}
        />
      )}
    </div>
  );
};

export default Home;
