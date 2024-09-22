import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

const pc = new Pinecone({
    apiKey: '7de18ffb-6a70-4108-ae77-a0496b8a1341'
});

const genAI = new GoogleGenerativeAI('AIzaSyA594S9gDTZTJZBzeN6Y8mbjblvFCFZhUI');

async function generateEmbeddings(text) {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);

    const embedding = Array.isArray(result.embedding) ? result.embedding : Object.values(result.embedding);

    return embedding;
}

async function main(userQuery, namespaceid) {
    const queryEmbedding = await generateEmbeddings(userQuery);

    const searchResults = await pc.index('cm').namespace(namespaceid).query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true
    });

    const relevantContext = searchResults.matches.map(match => match.metadata.text).join(' ');

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });


    let promptTemplate = `Based on the following context from a transcript, give me answer for: "${userQuery}" Context: ${relevantContext}`

    const result = await model.generateContent(promptTemplate);

    return result.response.text();
}

export const geminichat = async (querie, namespace) => {
    const response = main(querie, namespace)
    return response
};
