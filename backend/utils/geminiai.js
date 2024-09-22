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

async function main(userQuery, responseType, namespaceid) {
  const queryEmbedding = await generateEmbeddings(userQuery);

  const searchResults = await pc.index('cm').namespace(namespaceid).query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true
  });

  const relevantContext = searchResults.matches.map(match => match.metadata.text).join(' ');

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  let promptTemplate;

  if (responseType === "Key Point") {
    promptTemplate = `
    Analyze the following transcript from a client video call and provide key points in response to this question: "${userQuery}"
    
    Context: ${relevantContext}
    
    Instructions:
    1. Identify 5-7 key points that highlight crucial aspects of the conversation.
    2. For each key point, provide:
       a. **Timestamp**: Indicate when this point was discussed.
       b. **Statement**: A concise summary of the key point.
       c. **Explanation**: A brief elaboration (2-3 sentences) on why this point is significant, including any client concerns, requests, or decisions made.
    3. Ensure each point is distinct, informative, and relevant to the client's needs and objectives.
    
    Return the response in this format:
    
    Key Points:
    1. [Timestamp] - Statement: Explanation
    2. [Timestamp] - Statement: Explanation
    ...
    `;
    } else if (responseType === "notes") {
      promptTemplate = `
      Create a comprehensive and detailed summary based on the following transcript from a client video call, addressing this question: "${userQuery}"
      
      Context: ${relevantContext}
      
      Instructions:
      1. **Length**: Aim for a structured summary of 400-500 words.
      2. **Sections**: Organize the summary into 4-6 main sections with clear headings.
      3. **Content**:
         - **Introduction**: Briefly introduce the purpose of the call and key participants.
         - **Main Discussion Points**: Highlight critical topics discussed, including client needs, feedback, and suggestions.
         - **Action Items**: Clearly outline any tasks or follow-ups assigned during the call, specifying responsible parties and deadlines.
         - **Decisions Made**: Document any agreements or decisions reached during the discussion.
         - **Next Steps**: Summarize what comes next based on the conversation.
      4. **Flow**: Ensure the summary flows logically, connecting ideas and maintaining coherence throughout.
      5. **Conclusion**: Conclude with a brief paragraph summarizing the overall significance of the discussion and any critical insights gained.
      
      Return the response in this format:
      
      Summary:
      - **Introduction**: [Introduction content]
      - **Main Discussion Points**: [Content for main discussion]
      - **Action Items**: [List of action items]
      - **Decisions Made**: [Content for decisions]
      - **Next Steps**: [Summary of next steps]
      - **Conclusion**: [Final takeaway or significance of the discussion]
      `;
      }
  

  const result = await model.generateContent(promptTemplate);
  return result.response.text()
}

export const rungemini = async (id) => {
  const queries = [
      { query: "What are the main topics discussed in the transcript?", type: "Key Point" },
      { query: "Provide a detailed summary of the content in the transcript.", type: "notes" }
  ];

  const results = {
      'Key Point': null,
      'notes': null
  };

  for (const { query, type } of queries) {
      console.log(`\nQuery: ${query}`);
      try {
          const response = await main(query, type, id);
          results[type] = response;
      } catch (error) {
          console.error(`Error processing query "${query}":`, error);
      }
  }

  console.log('Final Results:', results);  // Log final results
  return results;  // Ensure to return the results
};
