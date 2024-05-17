import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

const app = express();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
  res.json({ message: "Testing my code" });
});

app.post("/upload", upload.single('file'), (req, res) => {
  const lessonId = uuidv4();
  const videoPath = req.file.path;
  const outputPath = path.join(__dirname, "uploads", "courses", lessonId);
  const hlsPath = path.join(outputPath, "index.m3u8");

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const command = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename ${path.join(outputPath, 'segment%03d.ts')} ${hlsPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: 'Video conversion failed', details: error.message });
    }
    const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`;
    res.json({
      message: "Video converted to HLS format",
      videoUrl: videoUrl,
      lessonId: lessonId
    });
  });
});

const __dirname = path.resolve();
app.listen(8000, () => {
  console.log("App is listening at port 8000...");
});
