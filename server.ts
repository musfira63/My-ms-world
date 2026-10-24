import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse port: dev server must bind to port 3000 (never 8080 which is reserved by Cloud Run Nginx)
const args = process.argv.slice(2);
const portFlagIndex = args.indexOf('--port');
const cliPort = portFlagIndex !== -1 ? parseInt(args[portFlagIndex + 1], 10) : undefined;
const isProd = process.env.NODE_ENV === 'production';
const port = cliPort || (isProd ? Number(process.env.PORT || 3000) : 3000);

app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI if GEMINI_API_KEY is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Smart Assistance Endpoint for Document Editing & Writing
app.post('/api/ai/assist', async (req, res) => {
  try {
    const { action, text, context, customPrompt } = req.body;

    if (!text && !customPrompt) {
      return res.status(400).json({ error: 'Text or prompt is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'AI assistance is initializing or API key is not configured in environment secrets.',
      });
    }

    let instruction = 'You are an elite document editor and writing assistant inside a professional document suite.';
    let prompt = '';

    switch (action) {
      case 'fix_grammar':
        instruction = 'Fix spelling, punctuation, typos, and grammatical errors in the following text while preserving original meaning, tone, and formatting.';
        prompt = `Correct the following text:\n\n${text}`;
        break;
      case 'professional':
        instruction = 'Rewrite the following text into clear, elegant, polished professional executive business language.';
        prompt = `Rewrite professionally:\n\n${text}`;
        break;
      case 'summarize':
        instruction = 'Provide a crisp, clear executive summary of the following document excerpt, highlighting key takeaways.';
        prompt = `Summarize the following text:\n\n${text}`;
        break;
      case 'expand':
        instruction = 'Thoughtfully expand upon the following points with insightful details, vivid elaboration, and cohesive transitions.';
        prompt = `Expand on this text:\n\n${text}`;
        break;
      case 'concise':
        instruction = 'Make the following text more concise, direct, and impactful by trimming fluff while retaining core information.';
        prompt = `Make concise:\n\n${text}`;
        break;
      case 'continue_novel':
        instruction = 'You are a bestselling fiction novelist and co-author. Continue the narrative seamlessly from the provided excerpt. Maintain voice, narrative tension, sensory details, and vivid character agency without repeating what happened.';
        prompt = `Selected manuscript text to continue from:\n\n${text}\n\nAuthor guidance or scene notes:\n${customPrompt || 'Advance the scene naturally with dialogue and evocative description.'}`;
        break;
      case 'dialogue_enhancer':
        instruction = 'You are a master fiction editor specializing in dialogue. Rewrite and sharpen the dialogue in this excerpt: make each line distinctive, authentic to character, eliminate stiff exposition, add subtext, meaningful beats, and body language.';
        prompt = `Sharpen and polish this dialogue:\n\n${text}`;
        break;
      case 'plot_twist':
        instruction = 'You are a master story consultant. Provide 3 inventive, high-stakes plot twists or turning points that could escalate tension and surprise readers in an earned, satisfying way.';
        prompt = `Current story context / excerpt:\n\n${text}\n\nStory premise or notes:\n${customPrompt || 'Suggest 3 exciting plot twists.'}`;
        break;
      case 'sensory_details':
        instruction = 'You are a literary writing coach specializing in "Show, Don\'t Tell". Enrich the scene with evocative sensory layers: lighting, textures, sounds, ambient scents, and visceral internal reactions while keeping the pace lively.';
        prompt = `Deepen the sensory atmosphere and show-don't-tell of this passage:\n\n${text}`;
        break;
      case 'character_generator':
        instruction = 'You are a character designer for novels. Create a complete, compelling character profile with: Full Name, Archetype, Core Internal Motivation, Fatal Flaw, Distinctive Appearance, Unique Voice/Mannerism, and Narrative Secret.';
        prompt = `Character concept or role:\n${customPrompt || text || 'A complex protagonist or antagonist'}`;
        break;
      case 'chapter_outline':
        instruction = 'You are a story architect. Generate a compelling chapter outline broken down into Opening Hook, Inciting Event, Rising Complication, Pivotal Choice, and Chapter Cliffhanger / Resonating End Note.';
        prompt = `Chapter theme or current progress:\n${customPrompt || text || 'Next chapter outline'}`;
        break;
      case 'tone_shift':
        instruction = `You are a versatile prose stylist. Rewrite the following text with the specified literary tone: ${customPrompt || 'atmospheric, suspenseful noir'}.`;
        prompt = `Rewrite with tone (${customPrompt || 'suspenseful'}):\n\n${text}`;
        break;
      case 'proofread':
        instruction = 'You are an eagle-eyed senior copy editor. Proofread the text for spelling, punctuation, grammar, repetitive word choice, and awkward cadence. Return the polished version followed by a brief summary of key fixes.';
        prompt = `Proofread the following manuscript excerpt:\n\n${text}`;
        break;
      case 'translate':
        instruction = `You are a professional literary translator. Translate the text accurately into ${customPrompt || 'Spanish'} while preserving idioms, voice, and nuance.`;
        prompt = `Translate to ${customPrompt || 'Spanish'}:\n\n${text}`;
        break;
      case 'custom':
      default:
        instruction = 'Assist the user with their document or novel request accurately, thoughtfully, and concisely.';
        prompt = `${customPrompt || 'Improve this text'}\n\nSelected text:\n${text || ''}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: instruction,
        temperature: 0.7,
      },
    });

    return res.json({ result: response.text || '' });
  } catch (error: any) {
    console.error('Error in AI assistance:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process AI document request.',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        if (vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`DocuCraft Pro server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
