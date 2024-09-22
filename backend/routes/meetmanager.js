import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { transcripter } from '../utils/transcripter.js';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';
import { managepinecone } from '../utils/pineconemanage.js';
import { rungemini } from '../utils/geminiai.js';
import Upload from '../models/meetManagerModel.js';
import { geminichat } from '../utils/chatwithgemini.js';
const router = express.Router();

cloudinary.config({
  cloud_name: 'dzhbqwghe',
  api_key:'978513459175788',
  api_secret:'cjNR0oqXGZjdx0C-rQmd-0mozaU'
});

const storage = multer.diskStorage({
  destination: './public/data/uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(mp4|avi|mov|flv|wmv|mkv)$/)) {
    return cb(new Error('Only video files are allowed!'), false);
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});



router.post('/uploadvideo', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No video file uploaded.');
  }
  try {
    const transcription = await transcripter(req.file.path);
    console.log(transcription)
    const namespaceid = await managepinecone(transcription.withTimestamps)
    console.log(namespaceid)
    const geminiaioutput = await rungemini(namespaceid)
    console.log(geminiaioutput)
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      public_id: `videos/${path.parse(req.file.originalname).name}`
    });
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting audio file:', err);
      else console.log(`Temporary video file deleted.`);
    });
    const newUpload = new Upload({
      url: uploadResult.secure_url,
      transcription: transcription.withoutTimestamps,
      namespaceid: namespaceid,
      keypoints: geminiaioutput['Key Point'],
      notes: geminiaioutput['notes']
    });
    const savedUpload = await newUpload.save();
    console.log(savedUpload)
    res.status(200).json({
      message: 'Video uploaded successfully to Cloudinary',
      savedUpload
    });
  } catch (error) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting audio file:', err);
      else console.log(`Temporary video file deleted.`);
    });
    console.error(error);
    res.status(500).json({ error: 'Error uploading video or processing transcription' });
  }
});


router.post('/chat',async(req,res)=>{
  try {
    const {querie, namespace} = req.body
    const response = await geminichat(querie, namespace)
    res.json(response)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error in chating please chat again' });
  }
})


router.get('/meeting/:id', async (req, res) => {
  try {
    const meet = await Upload.findById(req.params.id);
    res.json(meet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error in fetching meeting, please try again' });
  }
});

export default router;
