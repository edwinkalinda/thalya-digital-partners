
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false
  }
};

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY! 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Upload failed' });
    }

    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const audioStream = fs.createReadStream(file.filepath);

    try {
      const transcript = await openai.audio.transcriptions.create({
        file: audioStream,
        model: 'whisper-1',
        response_format: 'json',
        language: 'fr'
      });

      return res.status(200).json({ text: transcript.text });
    } catch (error: any) {
      console.error('Transcription error:', error);
      return res.status(500).json({ 
        error: 'Transcription failed', 
        detail: error.message 
      });
    } finally {
      // Clean up uploaded file
      fs.unlinkSync(file.filepath);
    }
  });
}
