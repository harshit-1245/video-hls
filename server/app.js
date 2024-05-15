import express from "express"
import multer from "multer"
import cors from "cors"

const app=express()

app.use(cors())

//multer configuration
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,res,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})


app.listen(4000,()=>{
    console.log("Server live at 4000")
})