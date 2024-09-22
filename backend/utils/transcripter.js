import { AssemblyAI } from 'assemblyai';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { extname, join, dirname } from 'path';

const client = new AssemblyAI({
  apiKey: '7362999c5b7e4d4f9b0fc2963f0a0138',
});

function convertVideoToAudio(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .toFormat('mp3')
      .on('error', (err) => reject(err))
      .on('end', () => resolve(outputPath))
      .save(outputPath);
  });
}

async function transcribeMedia(filePath) {
  let audioPath = filePath;

  if (extname(filePath).match(/\.(mp4|avi|mov|flv|mkv|wmv)$/i)) {
    console.log('Converting video to audio...');
    const outputPath = join(dirname(filePath), 'output.mp3');
    audioPath = await convertVideoToAudio(filePath, outputPath);
    console.log('Conversion complete.');
  }

  console.log('Transcribing...');
  const data = {
    audio: audioPath,
    word_boost: ["Upwork", "zoom"],
    language_detection: true
  };
  const transcript = await client.transcripts.transcribe(data);
  console.log('Transcription complete.');

  return { transcript, audioPath };
}

function formatTranscriptWithTimestamps(transcript) {
  let formattedTranscript = '';
  let currentTimestamp = '';

  transcript.words.forEach((word, index) => {
    const wordTimestamp = formatTimestamp(word.start);

    if (wordTimestamp !== currentTimestamp) {
      if (index > 0) formattedTranscript += '\n';
      formattedTranscript += `[${wordTimestamp}] `;
      currentTimestamp = wordTimestamp;
    }

    formattedTranscript += word.text + ' ';
  });

  return formattedTranscript.trim();
}

function formatTranscriptWithoutTimestamps(transcript) {
  return transcript.text;
}

function formatTimestamp(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const transcripter = async (path) => {
  const FILE_PATH = path;

  try {
    const { transcript, audioPath } = await transcribeMedia(FILE_PATH);
    console.log('Transcription complete.');

    const transcriptWithTimestamps = formatTranscriptWithTimestamps(transcript);
    const transcriptWithoutTimestamps = formatTranscriptWithoutTimestamps(transcript);

    console.log('Transcriptions formatted.');

    // Delete the audio file after transcription
    if (audioPath !== FILE_PATH) { // Only delete if a conversion happened
      fs.unlink(audioPath, (err) => {
        if (err) console.error('Error deleting audio file:', err);
        else console.log(`Temporary audio file ${audioPath} deleted.`);
      });
    }

    // Return the transcriptions directly
    return {
      withTimestamps: transcriptWithTimestamps,
      withoutTimestamps: transcriptWithoutTimestamps
    };

  } catch (error) {
    console.error('Error:', error.message);
    throw new Error('Transcription failed.');
  }
}
