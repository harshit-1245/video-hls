import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const app = express();

// Set the path to ffmpeg if not globally available
const ffmpegPath = "C:/Users/ASUS/Documents/ffmpeg/ffmpeg-2024-05-13-git-37db0454e4-full_build/ffmpeg-2024-05-13-git-37db0454e4-full_build/bin/ffmpeg.exe"; // Update this path as per your installation
const ffprobePath = "C:/Users/ASUS/Documents/ffmpeg/ffmpeg-2024-05-13-git-37db0454e4-full_build/ffmpeg-2024-05-13-git-37db0454e4-full_build/bin/ffprobe.exe"; // Update this path as per your installation

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

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
  res.json({ message: "Hello chai aur code" });
});

app.post("/upload", upload.single('file'), (req, res) => {
  const lessonId = uuidv4();
  const videoPath = req.file.path;
  const outputPath = path.join(__dirname, "uploads", "courses", lessonId);
  const hlsPath = path.join(outputPath, "index.m3u8");

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Using fluent-ffmpeg
  ffmpeg(videoPath)
    .outputOptions([
      '-codec:v libx264',
      '-codec:a aac',
      '-hls_time 10',
      '-hls_playlist_type vod',
      `-hls_segment_filename ${path.join(outputPath, 'segment%03d.ts')}`
    ])
    .output(hlsPath)
    .on('end', () => {
      const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`;
      res.json({
        message: "Video converted to HLS format",
        videoUrl: videoUrl,
        lessonId: lessonId
      });
    })
    .on('error', (err) => {
      console.error('Error: ' + err.message);
      res.status(500).json({ error: 'Video conversion failed', details: err.message });
    })
    .run();
});

const __dirname = path.resolve();
app.listen(8000, () => {
  console.log("App is listening at port 8000...");
});
