import { useState, useCallback, useRef, useMemo } from 'react';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

export const useAudioPlayer = () => {
  const audioRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

  const playAudio = useCallback(async (audioUrl: string, audioId: string = 'default') => {
    try {

      const fileExists = await RNFS.exists(audioUrl);
      if (!fileExists) {
        console.warn(`找不到音訊檔案：${audioUrl}`);
        return;
      }
      // reset
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current.release();
      }

      setIsPlaying(true);
      setCurrentAudioId(audioId);

      const sound = new Sound(audioUrl, '', (error) => {
        if (error) {
          console.error('音訊載入失敗:', error);
          setIsPlaying(false);
          setCurrentAudioId(null);
          return;
        }

        sound.play((success) => {
          if (!success) {
            console.error('播放失敗');
          }
          sound.release();
          audioRef.current = null;
          setIsPlaying(false);
          setCurrentAudioId(null);
        });
      });

      audioRef.current = sound;

    } catch (error) {
      console.error('播放音訊錯誤:', error);
      setIsPlaying(false);
      setCurrentAudioId(null);
    }
  }, []);
  
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.stop(() => {
        audioRef.current?.release();
        audioRef.current = null;
        setIsPlaying(false);
        setCurrentAudioId(null);
      });
    }
  }, []);

  return {
    isPlaying,
    currentAudioId,
    playAudio,
    stopAudio,
  };
};