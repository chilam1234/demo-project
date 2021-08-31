import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { clearErrors } from "../redux/actions/roomActions";
import RoomItem from "./room/RoomItem";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { rooms, pageSize, roomsCount, filteredRoomsCount, error } =
    useSelector((state) => state.allRooms);

  let { page = 1 } = router.query;
  page = Number(page);

  useEffect(() => {
    toast.error(error);
    dispatch(clearErrors());
  }, [dispatch, error]);

  const handlePagination = (pageNumber) => {
    router.push(`/?page=${pageNumber}`);
  };

  let count = roomsCount;

  return (
    <>
      <section id="rooms" className="container mt-5">
        <h2 className="mb-3 ml-2 stays-heading">Rooms</h2>

        <Link href="/search">
          <a className="ml-2 back-to-search">
            <i className="fa fa-arrow-left"></i> Back to Search
          </a>
        </Link>

        <div className="row">
          {rooms && rooms.length === 0 ? (
            <div className="alert alert-danger mt-5 w-100">
              <b>No Rooms.</b>
            </div>
          ) : (
            rooms &&
            rooms.map((room) => <RoomItem key={room._id} room={room} />)
          )}
        </div>
      </section>

      {pageSize < count && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={page}
            itemsCountPerPage={pageSize}
            totalItemsCount={roomsCount}
            onChange={handlePagination}
            nextPageText={"Next"}
            prevPageText={"Prev"}
            firstPageText={"First"}
            lastPageText={"Last"}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </>
  );
};

export default Home;
