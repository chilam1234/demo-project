import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  updateUserThunk,
  loadUserThunk,
} from "../../redux/actions/userAsyncThunkActions";
import { userSlice } from "../../redux/slices/userSlices";
import { RootState } from "../../redux/store";
import ButtonLoader from "../layout/ButtonLoader";
import Loader from "../layout/Loader";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );

  const { user: loadedUser, loading } = useSelector(
    (state: RootState) => state.loadedUser
  );
  const {
    error,
    isUpdated,
    loading: updateLoading,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (loadedUser) {
      setUser({
        name: loadedUser.name,
        email: loadedUser.email,
      });
      setAvatarPreview(loadedUser.avatar?.url ?? undefined);
    } else {
      dispatch(loadUserThunk());
    }

    if (error) {
      toast.error(error);
      dispatch(userSlice.actions.clearErrors());
    }

    if (isUpdated) {
      dispatch(userSlice.actions.resetMyUpdatedUser());
      router.push("/");
    }
  }, [dispatch, isUpdated, error, loadedUser, router]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      avatar,
    };

    dispatch(updateUserThunk(userData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result.toString());
          setAvatarPreview(reader.result.toString());
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">Update Profile</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure className="avatar mr-3 item-rtl">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            className="rounded-circle"
                            alt="image"
                            width={300}
                            height={200}
                            layout="responsive"
                          />
                        ) : (
                          <Image
                            src="/images/default_avatar.jpg"
                            className="rounded-circle"
                            alt="image"
                            width={300}
                            height={200}
                            layout="responsive"
                          />
                        )}
                      </figure>
                    </div>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="avatar"
                        className="custom-file-input"
                        id="customFile"
                        accept="images/*"
                        onChange={onChange}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Avatar
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={updateLoading ? true : false}
                >
                  {updateLoading ? <ButtonLoader /> : "UPDATE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
