import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  checkBooking,
  createBooking,
  getBookedDates,
} from "../../redux/actions/bookingActions";
import { clearErrors } from "../../redux/actions/roomActions";
import { CHECK_BOOKING_RESET } from "../../redux/constants/bookingConstants";
import { RootState } from "../../redux/store";
import BookingCalendar from "../booking/BookingCalendar";
import RoomFeatures from "./RoomFeatures";

const RoomDetails = () => {
  const [startDateTime, setStartDateTime] = useState<Date>();

  const dispatch = useDispatch();
  const router = useRouter();

  const { dates: bookedDates } = useSelector<RootState>(
    (state) => state.bookedDates
  );
  const { user } = useSelector<RootState>((state) => state.loadedUser);
  const { room, error } = useSelector<RootState>((state) => state.roomDetails);
  const { error: createBookingError } = useSelector<RootState>(
    (state) => state.booking
  );
  const {
    available,
    loading: bookingLoading,
    error: checkBookingError,
  } = useSelector<RootState>((state) => state.checkBooking);

  const excludedDates = [];
  const bookedDateEvents = [];
  bookedDates.forEach((date) => {
    excludedDates.push(date);
    bookedDateEvents.push({
      title: "booked",
      start: new Date(date.start),
      end: new Date(date.end),
    });
  });

  const onChange = (date: Date) => {
    const startDateTime = moment(date);
    setStartDateTime(startDateTime.toDate());
    if (startDateTime.toDate()) {
      dispatch(
        checkBooking(
          id,
          startDateTime.toISOString(),
          startDateTime.add(1, "hour").toISOString()
        )
      );
    }
  };

  const { id } = router.query;

  const bookRoom = async (id) => {
    const bookingData = {
      room: id,
      startDateTime,
      endDateTime: moment(startDateTime).add(1, "hour").toDate(),
    };

    dispatch(createBooking(bookingData));
    if (createBookingError) {
      toast.error(createBookingError);
      dispatch(clearErrors());
    }
    toast.info("successfully booked");
    router.push("../bookings/me");
  };

  useEffect(() => {
    dispatch(getBookedDates(id));

    toast.error(error);
    dispatch(clearErrors());

    return () => {
      dispatch({ type: CHECK_BOOKING_RESET });
    };
  }, [dispatch, error, id]);

  useEffect(() => {
    toast.error(checkBookingError);
    return () => {
      dispatch({ type: CHECK_BOOKING_RESET });
    };
  }, [checkBookingError, dispatch]);

  return (
    <>
      <Head>
        <title>{room.name}</title>
      </Head>

      <div className="container container-fluid">
        <h2 className="mt-5">{room.name}</h2>
        <p>{room.address}</p>

        <Carousel pause="hover">
          {room.images &&
            room.images.map((image) => (
              <Carousel.Item key={image.public_id}>
                <div style={{ width: "100%", height: "440px" }}>
                  <Image
                    className="d-block m-auto"
                    src={image.url}
                    alt={room.name}
                    width={300}
                    height={200}
                    layout="responsive"
                  />
                </div>
                <Carousel.Caption>
                  <h5>Room Picture</h5>
                  <p>This is a room picture</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
        </Carousel>
        <div className="row my-5">
          <div className="col-12 col-md-8 col-lg-8">
            <h3>Availability</h3>
            <BookingCalendar events={bookedDateEvents} />
            <h3 className="mt-5">Description</h3>
            <p>{room.description}</p>

            <RoomFeatures room={room} />
          </div>

          <div className="col-12 col-md-4 col-lg-4">
            <h3 className="mb-3">Select the time slot</h3>
            <div className="booking-card shadow-lg p-4">
              <DatePicker
                className="w-100"
                selected={startDateTime}
                onChange={onChange}
                startDate={startDateTime}
                minDate={new Date()}
                showTimeSelect
                timeIntervals={60}
              />

              {available === true && (
                <div className="alert alert-success my-3 font-weight-bold">
                  Room is available. Book now.
                </div>
              )}

              {available === false && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Room is not available. Try a different time slot or other
                  bookable rooms.
                </div>
              )}

              {available && !user && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Login to book room.
                </div>
              )}

              {available && user && (
                <button
                  className="btn btn-block py-3 booking-btn"
                  onClick={() => bookRoom(room._id)}
                  disabled={bookingLoading ? true : false}
                >
                  Book it now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
