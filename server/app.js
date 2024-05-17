import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import ytdl from "ytdl-core";

const app = express();

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

app.post("/convert", async (req, res) => {
  const { url } = req.body;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const lessonId = uuidv4();
  const outputPath = path.join(__dirname, "uploads", "courses", lessonId);
  const videoPath = path.join(outputPath, "video.mp4");

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  try {
    const stream = ytdl(url, { quality: 'highest' });

    const downloadProcess = new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(videoPath);
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    await downloadProcess;

    const outputFilePath = path.join(outputPath, "video_144p.mp4");
    const command = `ffmpeg -i ${videoPath} -vf scale=256:144 -codec:v libx264 -codec:a aac ${outputFilePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: 'Video conversion failed', details: error.message });
      }
      const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/video_144p.mp4`;
      res.json({
        message: "Video converted to 144p MP4 format",
        videoUrl: videoUrl,
        lessonId: lessonId
      });
    });

  } catch (error) {
    console.error('Error during video download: ' + error.message);
    res.status(500).json({ error: 'Video download failed', details: error.message });
  }
});

const __dirname = path.resolve();
app.listen(8000, () => {
  console.log("App is listening at port 8000...");
});
