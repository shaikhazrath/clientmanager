import { Schema, model } from 'mongoose';

const uploadSchema = new Schema({
  url: {
    type: String,
    // required: true
  },
  transcription: {
    type: String,
    required: true
  },
  namespaceid: {
    type: String,
    required: true
  },
  keypoints: {
    type: String,
    required: true
  },
  notes:{
    type:String
  }
}, {
  timestamps: true 
});

const Upload = model('Upload', uploadSchema);

export default Upload;
