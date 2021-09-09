import { MDBDataTable } from "mdbreact";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { clearErrors, deleteBooking } from "../../redux/actions/bookingActions";
import { DELETE_BOOKING_RESET } from "../../redux/constants/bookingConstants";
import { RootState } from "../../redux/store";

const MyBookings = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { bookings, error } = useSelector((state: RootState) => state.bookings);
  const { isDeleted, error: deleteError } = useSelector(
    (state: RootState) => state.booking
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      router.push("/bookings/me");
      toast.info("Successfully Deleted");
      dispatch({ type: DELETE_BOOKING_RESET });
    }
  }, [dispatch, deleteError, isDeleted, error, router]);

  const deleteBookingHandler = (id) => {
    dispatch(deleteBooking(id));
  };

  const setBookings = () => {
    const data = {
      columns: [
        {
          label: "Booking ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Room",
          field: "name",
          sort: "asc",
        },
        {
          label: "Start",
          field: "startDateTime",
          sort: "asc",
        },
        {
          label: "End",
          field: "endDateTime",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    bookings &&
      bookings.forEach((booking) => {
        data.rows.push({
          id: booking._id,
          name: booking.room.name,
          startDateTime: new Date(booking.startDateTime).toLocaleString(
            "en-US"
          ),
          endDateTime: new Date(booking.endDateTime).toLocaleString("en-US"),
          actions: (
            <>
              <Link href={`/bookings/${booking._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-eye"></i>
                </a>
              </Link>
              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteBookingHandler(booking._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <div className="container container-fluid">
      <h1 className="my-5">My Bookings</h1>

      <MDBDataTable
        data={setBookings()}
        className="px-3"
        bordered
        striped
        hover
      />
    </div>
  );
};

export default MyBookings;
