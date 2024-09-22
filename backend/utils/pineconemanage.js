import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';


const pc = new Pinecone({
  apiKey: '7de18ffb-6a70-4108-ae77-a0496b8a1341'
});

const genAI = new GoogleGenerativeAI('AIzaSyA594S9gDTZTJZBzeN6Y8mbjblvFCFZhUI');



function chunkTranscript(transcript, chunkSize = 1000) {
  const chunks = [];
  for (let i = 0; i < transcript.length; i += chunkSize) {
    chunks.push(transcript.slice(i, i + chunkSize));
  }
  return chunks;
}

async function generateEmbeddings(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding;
}

async function storeTranscriptInPinecone(transcript) {
  const transcriptId = uuidv4();
  const chunks = chunkTranscript(transcript);
  const index = pc.index('cm');

  const batchSize = 100; 
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = await Promise.all(
      chunks.slice(i, i + batchSize).map(async (chunk, j) => {
        const embedding = await generateEmbeddings(chunk);
        const vectorValues = Array.isArray(embedding) ? embedding : Object.values(embedding);
        return {
          id: `${transcriptId}-${i + j}`,
          values: vectorValues,
          metadata: {
            transcriptId,
            chunkIndex: i + j,
            text: chunk,
          },
        };
      })
    );

    await index.namespace(transcriptId).upsert(batch);
    console.log(`Stored batch ${i / batchSize + 1} of ${Math.ceil(chunks.length / batchSize)}`);
  }

  console.log(`Stored transcript with ID: ${transcriptId}`);
  return transcriptId;
}

export const managepinecone= async(tr)=> {
  try {
    console.log(tr)
    const transcriptId = await storeTranscriptInPinecone(tr);
    console.log(transcriptId)
    return transcriptId
  } catch (error) {
    console.error('Error:', error);
  }
}

