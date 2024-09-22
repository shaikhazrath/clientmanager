import express from 'express'
const app = express()
import { config } from 'dotenv'
config({path:'.env'})
import meetManager from './routes/meetmanager.js'
import mongoose from 'mongoose'
import cors from'cors'

app.use(express.json())
app.use(cors())
app.use('/',meetManager)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})