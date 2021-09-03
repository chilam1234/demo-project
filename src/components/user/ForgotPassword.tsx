import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { forgotPasswordThunk } from "../../redux/actions/userAsyncThunkActions";
import { forgotPasswordSlice } from "../../redux/slices/userSlices";
import { RootState } from "../../redux/store";
import ButtonLoader from "../layout/ButtonLoader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { error, loading, message, success } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(forgotPasswordSlice.actions.clearErrors());
    }
    console.log(success);
    if (success) {
      toast.success(message);
    }
  }, [dispatch, message, error, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      email,
    };

    dispatch(forgotPasswordThunk(userData.email));
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler}>
          <h1 className="mb-3">Forgot Password</h1>
          <div className="form-group">
            <label htmlFor="email_field">Enter Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            className="btn btn-block py-3"
            disabled={loading ? true : false}
          >
            {loading ? <ButtonLoader /> : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
