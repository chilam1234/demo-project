import Room from "../models/room";
import FileService from "../services/file.service";
import QueryManager from "../utils/Query";
import ErrorHandler from "../utils/errorHandler";

const allRooms = async (req, res) => {
  const pageSize = 8;

  const roomsCount = await Room.countDocuments();

  const queryManager = new QueryManager<typeof Room>(
    Room.find(),
    req.query
  ).filter();

  let rooms = await queryManager.query;
  let filteredRoomsCount = rooms.length;

  queryManager.pagination(pageSize);
  rooms = await queryManager.query;

  res.status(200).json({
    success: true,
    roomsCount,
    pageSize,
    filteredRoomsCount,
    rooms,
  });
};

const newRoom = async (req, res) => {
  const images = req.body.images;

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await FileService.uploadImage(images[i], {
      folder: "myDemo/rooms",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id;

  const room = await Room.create(req.body);

  res.status(200).json({
    success: true,
    room,
  });
};

const getSingleRoom = async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    room,
  });
};

const updateRoom = async (req, res, next) => {
  let room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found with this ID", 404));
  }

  if (req.body.images) {
    // Delete images associated with the room
    for (let i = 0; i < room.images.length; i++) {
      await FileService.removeImage(room.images[i].public_id);
    }

    let imagesLinks = [];
    const images = req.body.images;

    for (let i = 0; i < images.length; i++) {
      const result = await FileService.uploadImage(images[i], {
        folder: "myDemo/rooms",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  room = await Room.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    room,
  });
};

const deleteRoom = async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found with this ID", 404));
  }

  // Delete images associated with the room
  for (let i = 0; i < room.images.length; i++) {
    await FileService.removeImage(room.images[i].public_id);
  }

  await room.remove();

  res.status(200).json({
    success: true,
    message: "Room is deleted.",
  });
};

const allAdminRooms = async (req, res) => {
  const rooms = await Room.find();

  res.status(200).json({
    success: true,
    rooms,
  });
};

export {
  allRooms,
  newRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  allAdminRooms,
};
