import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import ytdl from 'ytdl-core';
import cookieParser from 'cookie-parser';

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
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
  res.json({ message: "Testing my code" });
});

app.post("/convert", async (req, res) => {
  if (!req.cookies.cookieConsent || req.cookies.cookieConsent !== 'true') {
    return res.status(403).json({ error: 'Cookie consent is required' });
  }

  const { url, format } = req.body;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const lessonId = uuidv4();
  const outputPath = path.join(path.resolve(), "uploads", "courses", lessonId);
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

    let outputFilePath;
    let command;

    switch (format) {
      case 'mp4_1080':
        outputFilePath = path.join(outputPath, "video_1080p.mp4");
        command = `ffmpeg -i ${videoPath} -vf scale=1920:1080 -codec:v libx264 -codec:a aac ${outputFilePath}`;
        break;
      case 'mp4_720':
        outputFilePath = path.join(outputPath, "video_720p.mp4");
        command = `ffmpeg -i ${videoPath} -vf scale=1280:720 -codec:v libx264 -codec:a aac ${outputFilePath}`;
        break;
      case 'mp4_480':
        outputFilePath = path.join(outputPath, "video_480p.mp4");
        command = `ffmpeg -i ${videoPath} -vf scale=854:480 -codec:v libx264 -codec:a aac ${outputFilePath}`;
        break;
      case 'mp4_240':
        outputFilePath = path.join(outputPath, "video_240p.mp4");
        command = `ffmpeg -i ${videoPath} -vf scale=426:240 -codec:v libx264 -codec:a aac ${outputFilePath}`;
        break;
      default:
        outputFilePath = path.join(outputPath, "video_240p.mp4");
        command = `ffmpeg -i ${videoPath} -vf scale=426:240 -codec:v libx264 -codec:a aac ${outputFilePath}`;
        break;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: 'Video conversion failed', details: error.message });
      }
      const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/${path.basename(outputFilePath)}`;
      res.json({
        message: `Video converted to ${format} format`,
        videoUrl: videoUrl,
        lessonId: lessonId
      });
    });

  } catch (error) {
    console.error('Error during video download: ' + error.message);
    res.status(500).json({ error: 'Video download failed', details: error.message });
  }
});

app.post("/accept-cookies",(req,res)=>{
  res.cookie('cookieConsent', 'accepted', { maxAge: 365 * 24 * 60 * 60 * 1000 });
  
  res.send('Cookies accepted');
})

const __dirname = path.resolve();
app.listen(8000, () => {
  console.log("App is listening at port 8000...");
});
