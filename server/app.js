import express from "express";
import multer from "multer";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs"
import  {exec} from "child_process" //necessary to watch out

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // serving static files from this folder

// header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uuidv4()}${ext}`);
    }
});

const upload = multer({ storage: storage });

// Define an upload route
app.post('/upload', upload.single('file'), (req, res) => {
    try {
      const lessonId=uuidv4()
      const videoPath=req.file.path
      const outputPath=`./uploads/courses/${lessonId}`
    const hlsPath=`${outputPath}/index.m3u8` //under the hood it is indexing UTF-8 encoded

   if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true})
   }

   //ffmpeg configuration
   const ffmpegCommand=`ffmpeg -i ${videoPath} -codec:v
   libx264 -codec:a aac -hls_time 10 -hls_playlist_type
   vod -hls_segment_filename "${outputPath}/segment%03d.ts" 
   -start_number 0 ${hlsPath}
   `

   exec(ffmpegCommand,(error,stdout,stderr)=>{
    if(error){
        console.log(`exec error: ${error}`);
    }
    console.log(`stdout:${stdout}`);
    console.log(`stdout:${stderr}`);

    const videoUrl=`http://localhost:4000/uploads/courses/${lessonId}/index.m3u8`

  res.json({
    message:"Video is converted to hls",
    videoUrl:videoUrl,
    lessonId:lessonId
  })

   })

  

    
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(4000, () => {
    console.log("Server live at 4000");
});
