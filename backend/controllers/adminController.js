import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVal = Math.random() < 0.2;

    const dir = isVal
      ? "dataset/images/val/"
      : "dataset/images/train/";

    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".jpg");
  }
});

const upload = multer({ storage }).array("images", 1000);

export const uploadImages = (req, res) => {
  upload(req, res, () => {
    const { label } = req.body;

    const labelMap = {
      unripe: 0,
      ripe: 1,
      overripe: 2
    };

    req.files.forEach(file => {
      const labelPath = file.path
        .replace("images", "labels")
        .replace(".jpg", ".txt");

      fs.mkdirSync(path.dirname(labelPath), { recursive: true });

      fs.writeFileSync(labelPath, `${labelMap[label]} 0.5 0.5 1.0 1.0`);
    });

    res.json({ message: "Upload success" });
  });
};