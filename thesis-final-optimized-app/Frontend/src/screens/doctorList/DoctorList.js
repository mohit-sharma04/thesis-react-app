import React, { useState, useEffect, useCallback, lazy } from "react";
import "./Doctor.css";
import {
  Paper,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import Modal from "react-modal";

const DoctorDetails = lazy(() => import("./DoctorDetails"));
const BookAppointment = lazy(() => import("./BookAppointment"));

Modal.setAppElement(document.getElementById("root"));

const detailsModalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
  },
};

const bookingsModalStyle = {
  content: {
    width: "40%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
  },
};

const DoctorList = ({ baseUrl, getUserAppointments, userAppointments }) => {
  const [speciality, setSpeciality] = useState("");
  const [specialityList, setSpecialityList] = useState([]);
  const [doctorsList, setDoctorList] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const getSpeciality = useCallback(async () => {
    const url = `${baseUrl}doctors/speciality`;

    try {
      const rawResponse = await fetch(url);

      if (rawResponse.ok) {
        const response = await rawResponse.json();
        setSpecialityList(response);
      } else {
        throw new Error("Some Error Occurred");
      }
    } catch (e) {
      alert(e.message);
    }
  }, [baseUrl]);

  const getDoctorsList = useCallback(async () => {
    const url = `${baseUrl}doctors`;

    try {
      const rawResponse = await fetch(url);

      if (rawResponse.ok) {
        const response = await rawResponse.json();
        setDoctorList(response);
      } else {
        throw new Error("Some Error Occurred");
      }
    } catch (e) {
      alert(e.message);
    }
  }, [baseUrl]);

  const getFilteredDoctors = useCallback(
    async (query) => {
      const url = `${baseUrl}doctors?speciality=${encodeURI(query)}`;

      try {
        const rawResponse = await fetch(url);

        if (rawResponse.ok) {
          const response = await rawResponse.json();
          setDoctorList(response);
        } else {
          throw new Error("Some Error Occurred");
        }
      } catch (e) {
        alert(e.message);
      }
    },
    [baseUrl]
  );

  const changeSpecialityHandler = useCallback(
    (event) => {
      const selectedSpeciality = event.target.value;
      setSpeciality(selectedSpeciality);
      getFilteredDoctors(selectedSpeciality);
    },
    [getFilteredDoctors]
  );

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    getDoctorsList();
    getSpeciality();
  }, [getDoctorsList, getSpeciality]);

  return (
    <div>
      <Grid item xs={12} sm container alignItems="center" direction="column">
        <Typography component="div" id="selectHeading">
          Select Speciality:
        </Typography>
        <Select
          variant="filled"
          labelId="speciality"
          id="speciality"
          value={speciality}
          style={{ minWidth: "200px" }}
          onChange={changeSpecialityHandler}
        >
          <MenuItem key={"spec none"} value={""}>
            NONE
          </MenuItem>
          {specialityList.map((item) => (
            <MenuItem key={"spec" + item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        {doctorsList.map((doctorItem) => (
          <Paper
            key={doctorItem.id}
            variant="elevation"
            className="doctorListContainer"
            elevation={3}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Doctor Name: {doctorItem.firstName} {doctorItem.lastName}
            </Typography>
            <br />
            <Typography component="h4" variant="body1">
              Speciality: {doctorItem.speciality}
            </Typography>
            <Typography component="h4" variant="body1">
              Rating:{" "}
              <Rating name="read-only" value={doctorItem.rating} readOnly />
            </Typography>
            <Button
              style={{ width: "40%", margin: "10px" }}
              variant="contained"
              color="primary"
              onClick={() => {
                setDoctor(doctorItem);
                setModalType("bookings");
                setIsModalOpen(true);
              }}
            >
              Book Appointment
            </Button>
            <Button
              style={{ width: "40%", margin: "10px", backgroundColor: "green" }}
              variant="contained"
              color="secondary"
              onClick={() => {
                setDoctor(doctorItem);
                setModalType("details");
                setIsModalOpen(true);
              }}
            >
              View Details
            </Button>
          </Paper>
        ))}

        <Modal
          ariaHideApp={false}
          isOpen={isModalOpen}
          onRequestClose={closeModalHandler}
          style={
            modalType === "details" ? detailsModalStyle : bookingsModalStyle
          }
        >
          {modalType === "details" && <DoctorDetails doctor={doctor} />}
          {modalType === "bookings" && (
            <BookAppointment
              baseUrl={baseUrl}
              doctor={doctor}
              getUserAppointments={getUserAppointments}
              userAppointments={userAppointments}
              closeModalHandler={closeModalHandler}
            />
          )}
        </Modal>
      </Grid>
    </div>
  );
};

export default DoctorList;
