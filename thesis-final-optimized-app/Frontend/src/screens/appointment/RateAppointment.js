import React, { useState } from "react";
import {
  Paper,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  Button,
  FormHelperText,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";

const RateAppointment = ({ appointment, baseUrl, toggleModalHandler }) => {
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingRequiredClass, setRatingRequiredClass] = useState("none");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const ratingChangeHandler = (event, newValue) => {
    setRating(newValue);
    setRatingRequiredClass("none");
  };

  const submitRatingHandler = async () => {
    if (rating === 0 || rating === null || ratingRequiredClass === "block") {
      setRatingRequiredClass("block");
      return;
    }

    const accessToken = sessionStorage.getItem("accessToken");

    let data = {
      appointmentId: appointment.appointmentId,
      doctorId: appointment.doctorId,
      rating: rating,
      comments: comments,
    };
    const url = baseUrl + "ratings";

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
        setRatingSubmitted(true);
        setTimeout(toggleModalHandler, 1000);
      } else if (rawResponse.status === 400) {
        alert("Bad Post Request");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Paper>
      <CardHeader className="cardHeader" title="Rate an Appointment" />
      <CardContent key={appointment.appointmentId}>
        <div>
          <FormControl>
            <TextField
              id="standard-multiline-static"
              label="Comments"
              multiline
              rows={4}
              defaultValue=""
              onChange={(e) => setComments(e.target.value)}
            />
          </FormControl>
        </div>
        <br />
        <div>
          <FormControl>
            <div>
              <Typography
                variant="body1"
                component="span"
                className="hasTextBlack"
              >
                Rating:
              </Typography>

              <Rating
                name={appointment.appointmentId}
                value={rating}
                onChange={ratingChangeHandler}
              />
            </div>
            {ratingRequiredClass === "block" && (
              <FormHelperText className={ratingRequiredClass}>
                <span className="red">Select a rating</span>
              </FormHelperText>
            )}
          </FormControl>
        </div>
        <br />
        {ratingSubmitted && (
          <FormControl>
            <span>Rating submitted successfully.</span>
          </FormControl>
        )}
        <br />
        <br />
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={submitRatingHandler}
          >
            Rate Appointment
          </Button>
        </div>
      </CardContent>
    </Paper>
  );
};

export default RateAppointment;
