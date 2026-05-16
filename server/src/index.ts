import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/', (req, res) => {
  res.send('CodeMorph AI API is running');
});

// Code Conversion Route
app.post('/api/convert', async (req, res) => {
  try {
    const { sourceCode, sourceLang, targetLang } = req.body;

    if (!sourceCode || !sourceLang || !targetLang) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are an expert AI code converter. Convert the following ${sourceLang} code to ${targetLang}.
RULES:
1. Maintain the exact functionality and logic.
2. Maintain the same time and space complexity.
3. Preserve comments if possible.
4. Return ONLY the converted code snippet without markdown formatting or extra text.

Source Code:
${sourceCode}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    let convertedCode = response.text;
    
    // Clean up markdown code blocks if any
    if (convertedCode) {
      convertedCode = convertedCode.replace(/^```[a-z]*\n/, '').replace(/```$/, '').trim();
    }

    res.json({ convertedCode });
  } catch (error) {
    console.error('Error in conversion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Debugger Route
app.post('/api/debug', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are an expert AI debugging assistant. Analyze the following ${language} code for errors.
Look for: syntax errors, logical errors, runtime errors, infinite loops, memory leaks, and bad practices.

Return your analysis strictly as a JSON object matching this structure (do not include markdown code block backticks around the JSON):
{
  "hasError": boolean,
  "errors": [
    {
      "line": "string or number",
      "type": "string (e.g. Syntax Error, Logical Error, Memory Leak)",
      "message": "string (short description)",
      "explanation": "string (simple beginner-friendly English explanation)"
    }
  ],
  "fixedCode": "string (the complete corrected code)",
  "suggestions": ["string", "string"] (list of optimization or clean code suggestions)
}

Code to analyze:
${code}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    let resultText = response.text || "{}";
    
    // Clean up markdown code blocks if any
    if (resultText) {
      resultText = resultText.replace(/^```json\n/, '').replace(/^```\n/, '').replace(/```$/, '').trim();
    }

    const parsedResult = JSON.parse(resultText);
    res.json(parsedResult);

  } catch (error) {
    console.error('Error in debugging:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Compiler Execution Route (Proxy to Piston API)
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Map common language names to Piston's expected language names/versions
    const languageMap: Record<string, { language: string; version: string }> = {
      'javascript': { language: 'javascript', version: '18.15.0' },
      'python': { language: 'python', version: '3.10.0' },
      'java': { language: 'java', version: '15.0.2' },
      'c': { language: 'c', version: '10.2.0' },
      'cpp': { language: 'c++', version: '10.2.0' },
    };

    const mappedLang = languageMap[language.toLowerCase()];
    if (!mappedLang) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: mappedLang.language,
        version: mappedLang.version,
        files: [
          {
            content: code,
          },
        ],
        stdin: input || "",
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

// AI Tutor Route
app.post('/api/tutor', async (req, res) => {
  try {
    const { messages, mode } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    const modePromptMap: Record<string, string> = {
      'Beginner': 'You are a friendly, encouraging programming tutor. The student is a complete beginner. Explain things extremely simply, use real-life analogies, and break down code step-by-step. Avoid complex jargon.',
      'Intermediate': 'You are a knowledgeable programming tutor. The student knows the basics. Focus on best practices, efficiency, and standard library usage. Explain the "why" behind concepts.',
      'Advanced': 'You are an expert software engineer mentoring another developer. Discuss system design, time/space complexity, deep language internals, and advanced architectural patterns.',
    };

    const systemInstruction = modePromptMap[mode] || modePromptMap['Beginner'];

    // Format history for Gemini (roles: 'user' and 'model')
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Prepend system instruction as the first user message (workaround if systemInstruction isn't explicitly supported in this genai version)
    contents.unshift({
      role: 'user',
      parts: [{ text: `SYSTEM INSTRUCTION: ${systemInstruction}. Please respond to the following messages accordingly.` }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: contents,
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('Error in AI Tutor:', error);
    res.status(500).json({ error: 'Failed to get tutor response' });
  }
});

app.listen(port, () => {

  console.log(`Server is running on port ${port}`);
});
