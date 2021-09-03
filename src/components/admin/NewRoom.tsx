import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { newRoom, clearErrors } from "../../redux/actions/roomActions";
import { NEW_ROOM_RESET } from "../../redux/constants/roomConstants";
import ButtonLoader from "../layout/ButtonLoader";

const NewRoom = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Cola");
  const [guestCapacity, setGuestCapacity] = useState(1);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, success } = useSelector((state) => state.newRoom);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      router.push("/admin/rooms");
      dispatch({ type: NEW_ROOM_RESET });
    }
  }, [dispatch, error, router, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      description,
      address,
      category,
      guestCapacity: Number(guestCapacity),
      images,
    };

    if (images.length === 0) return toast.error("Please upload images.");

    dispatch(newRoom(roomData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [...oldArray, reader.result]);
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="container container-fluid">
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-4">New Room</h1>
            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description_field">Description</label>
              <textarea
                className="form-control"
                id="description_field"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_field">Category</label>
              <select
                className="form-control"
                id="room_type_field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {["Cola", "Pepsi"].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category_field">Guest Capacity</label>
              <select
                className="form-control"
                id="guest_field"
                value={guestCapacity}
                onChange={(e) => setGuestCapacity(e.target.value)}
              >
                {[5, 10, 20, 30, 40, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mt-4">
              <label>Images</label>
              <div className="custom-file">
                <input
                  type="file"
                  name="room_images"
                  className="custom-file-input"
                  id="customFile"
                  onChange={onChange}
                  multiple
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose Images
                </label>
              </div>

              {imagesPreview.map((img) =>
                img ? (
                  <Image
                    src={img}
                    key={img}
                    alt="Images Preview"
                    className="mt-3 mr-2"
                    width="55"
                    height="52"
                  />
                ) : (
                  ""
                )
              )}
            </div>
            <button
              type="submit"
              className="btn btn-block new-room-btn py-3"
              disabled={loading ? true : false}
            >
              {loading ? <ButtonLoader /> : "CREATE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
