import multer from "multer";

// file will save on disc, can save on memory storage but it can be bigger than RAM and volatile

// DISKSTORAGE method
const storage = multer.diskStorage({
  // req -> user request, json data that has be passed
  // file -> if user is sending file too (multer is made to handle it)
  // cb -> callback
  destination: function (req, file, cb) {
    // first param -> null or error
    // second -> destination, where we want to store the data
    cb(null, "./public/temp"); // we are saving all the files in public so as they will be access easily
  },
  // filename  -> what we want to name the file, usually give unique names, ids
  filename: function (req, file, cb) {
    cb(null, file.originalname); // for now we are give files the original name user has given
  },
});

export const upload = multer({
    storage
})
