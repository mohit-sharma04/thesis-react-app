import React, { useState, useEffect } from "react";
import {
  Paper,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText,
} from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const BookAppointment = ({
  baseUrl,
  doctor,
  getUserAppointments,
  userAppointments,
  closeModalHandler,
}) => {
  const doctorName = `${doctor.firstName} ${doctor.lastName}`;
  const dateFormatter = (date) => {
    const dateArray = date.toLocaleDateString().split("/");
    const newDate = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
    return newDate;
  };
  const currentUserAppointments = userAppointments;
  const [selectedDate, setSelectedDate] = useState(dateFormatter(new Date()));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState(["None"]);
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [slotRequiredClass, setSlotRequiredClass] = useState("none");
  const [bookedSuccessfully, setBookedSuccessfully] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(dateFormatter(date));
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
    setSlotRequiredClass("none");
  };

  const getAvailableSlots = async () => {
    const url = `${baseUrl}doctors/${doctor.id}/timeSlots?date=${selectedDate}`;

    try {
      const rawResponse = await fetch(url);

      if (rawResponse.ok) {
        const response = await rawResponse.json();
        setAvailableSlots(response.timeSlot);
      } else {
        throw new Error("Some Error Occurred");
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const bookAppointmentHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedSlot) {
      setSlotRequiredClass("block");
      return;
    }
    const emailId = JSON.parse(sessionStorage.getItem("userId"));
    const userDetails = JSON.parse(sessionStorage.getItem("user-details"));
    const accessToken = sessionStorage.getItem("accessToken");
    // Allow only logged in user to Book appointment
    if (!emailId || !userDetails || !accessToken) {
      alert("Please Login to Book an appointment");
      closeModalHandler();
      return;
    }

    // Check if user already has an appointment for the same date-time
    const existingBooking = currentUserAppointments.find(
      (appt) =>
        appt.appointmentDate === selectedDate && appt.timeSlot === selectedSlot
    );

    if (existingBooking) {
      alert("Either the slot is already booked or not available");
      return;
    }

    const data = {
      doctorId: doctor.id,
      doctorName,
      userId: emailId,
      userName: `${userDetails.firstName} ${userDetails.lastName}`,
      timeSlot: selectedSlot,
      createdDate: dateFormatter(new Date()),
      appointmentDate: selectedDate,
      symptoms,
      priorMedicalHistory: medicalHistory,
    };

    const url = baseUrl + "appointments";
    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (rawResponse.ok) {
        setBookedSuccessfully(true);
        getUserAppointments();
        setTimeout(() => {
          closeModalHandler();
        }, 1000);
      } else if (rawResponse.status === 400) {
        alert("Bad Request");
      }
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    getAvailableSlots();
  }, [selectedDate]);

  return (
    <div>
      <Paper className="bookingModal">
        <CardHeader className="cardHeader" title="Book an Appointment" />
        <CardContent key={doctor.id}>
          <form noValidate autoComplete="off" onSubmit={bookAppointmentHandler}>
            <div>
              <TextField
                disabled
                id="standard-disabled"
                label="Doctor Name"
                required
                value={doctorName}
              />
            </div>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div>
              <FormControl>
                <InputLabel id="timeSlotInput">Time Slot</InputLabel>
                <Select
                  labelId="timeSlotInput"
                  id="timeSlotInput"
                  value={selectedSlot}
                  onChange={handleSlotChange}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {availableSlots.map((slot, key) => (
                    <MenuItem key={key} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText className={slotRequiredClass}>
                  <span className="red">Select a time slot</span>
                </FormHelperText>
              </FormControl>
            </div>
            <br />
            <div>
              <FormControl>
                <TextField
                  id="standard-multiline-static"
                  label="Medical History"
                  multiline
                  rows={4}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </FormControl>
            </div>
            <br />
            <div>
              <FormControl>
                <TextField
                  id="standard-multiline-static"
                  label="Symptoms"
                  multiline
                  rows={4}
                  value={symptoms}
                  placeholder="ex. Cold, Swelling, etc."
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </FormControl>
            </div>
            <br />
            {bookedSuccessfully && (
              <FormControl>
                <span>Appointment booked successfully.</span>
              </FormControl>
            )}
            <br />
            <br />
            <Button
              id="bookappointment"
              type="submit"
              variant="contained"
              color="primary"
            >
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Paper>
    </div>
  );
};

export default BookAppointment;
