import { Dirs, FileSystem } from 'react-native-file-access';
import { ENV } from '../../config/env';

class ChatGPTService {
  private static async makeRequest(messages: Array<{role: string, content: string}>, selectedModel: string) {
    try {
      const response = await fetch(ENV.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      throw error;
    }
  }

  static async sendMessage(messages: Array<{role: string, content: string}>, selectedModel: string): Promise<string> {
    return await this.makeRequest(messages, selectedModel);
  }

  // OpenAI TTS API
  static async textToSpeech(text: string, voice: string = 'nova'): Promise<string> {
    try {
      const fileName = `speech_${Date.now()}.mp3`;
      const filePath = `${Dirs.CacheDir}/${fileName}`;

      await FileSystem.fetch(ENV.OPENAI_TTS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice,
          response_format: 'mp3',
        }),
        path: filePath,
      });

      return filePath;

    } catch (error) {
      console.error('TTS Error:', error);
      throw error;
    }
  }
}
export default ChatGPTService;
