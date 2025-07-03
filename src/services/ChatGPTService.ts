import RNFS from 'react-native-fs';
import axios from 'axios';
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
      const response = await axios.post(
        ENV.OPENAI_TTS_URL,
        {
          model: 'tts-1',
          input: text,
          voice,
          response_format: 'mp3',
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const base64Audio = Buffer.from(response.data).toString('base64');
      const fileName = `speech.mp3`;
      const dirPath = RNFS.DocumentDirectoryPath;
      const filePath = `${dirPath}/${fileName}`;

      const dirExists = await RNFS.exists(dirPath);
      if (!dirExists) {
        await RNFS.mkdir(dirPath);
      } else {
        console.log('沒目錄:', dirPath);
      }

      await RNFS.writeFile(filePath, base64Audio, 'base64');

      const uri = `file://${filePath}`;
      console.log('[SUCCESS] 成功寫入音訊檔案:', uri);
      return uri;
    } catch (err) {
      console.error('[Error] 寫入音訊失敗:', err);
      throw err;
    }
  }
}
export default ChatGPTService;
