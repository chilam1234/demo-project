import { signOut } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadUserThunk } from "../../redux/actions/userAsyncThunkActions";
import { RootState } from "../../redux/store";

const Header = () => {
  const dispatch = useDispatch();

  const { user: data, loading } = useSelector(
    (state: RootState) => state.loadedUser
  );

  useEffect(() => {
    if (!data) {
      dispatch(loadUserThunk());
    }
  }, [dispatch, data]);

  const logoutHandler = () => {
    signOut();
  };

  return (
    <nav className="navbar row justify-content-center sticky-top">
      <div className="container">
        <div className="col-3 p-0">
          <div className="navbar-brand">
            <Link href="/" passHref>
              Demo System
            </Link>
          </div>
        </div>

        <div className="col-3 mt-3 mt-md-0 text-center">
          {data ? (
            <div className="ml-4 dropdown d-line">
              <a
                className="btn dropdown-toggle mr-4"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <Image
                    src={
                      (data.user?.avatar && data.user?.avatar.url) ??
                      "/images/default_avatar.jpg"
                    }
                    alt={data.user && data.user.name}
                    className="rounded-circle"
                    height={50}
                    width={50}
                    layout="responsive"
                  />
                </figure>
                <span>{data.user && data.user.name}</span>
              </a>

              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                {data.user.role === "admin" && (
                  <>
                    <Link href="/admin/rooms">
                      <a className="dropdown-item">Rooms</a>
                    </Link>

                    <Link href="/admin/bookings">
                      <a className="dropdown-item">Bookings</a>
                    </Link>

                    <Link href="/admin/users">
                      <a className="dropdown-item">Users</a>
                    </Link>

                    <hr />
                  </>
                )}

                <Link href="/bookings/me">
                  <a className="dropdown-item">My Bookings</a>
                </Link>

                <Link href="/me/update">
                  <a className="dropdown-item">Profile</a>
                </Link>

                <Link href="/">
                  <a
                    className="dropdown-item text-danger"
                    onClick={logoutHandler}
                  >
                    Logout
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link href="/login">
                <a className="btn btn-danger px-4 text-white login-header-btn float-right">
                  Login
                </a>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
