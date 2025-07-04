import { useState, useCallback, useMemo, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import Voice, { SpeechResultsEvent } from '@react-native-community/voice';

export interface UseVoiceRecognitionReturn {
  // State
  isRecording: boolean;
  recognizedText: string;
  permissionGranted: boolean;
  isListening: boolean;
  
  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  toggleRecording: () => Promise<void>;
  requestPermission: () => Promise<void>;
  clearRecognizedText: () => void;
}

export const useVoiceRecognition = (
  onSpeechResults?: (text: string) => void
): UseVoiceRecognitionReturn => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isListening, setIsListening] = useState(false);

  const requestPermission = useCallback(async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '麥克風權限',
            message: '此應用需要麥克風權限以使用語音輸入功能',
            buttonNeutral: '稍後詢問',
            buttonNegative: '拒絕',
            buttonPositive: '同意',
          },
        );
        setPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        setPermissionGranted(false);
      }
    } else {
      setPermissionGranted(true);
    }
  }, []);

  const clearRecognizedText = useCallback((): void => {
    setRecognizedText('');
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    if (!permissionGranted) {
      Alert.alert('權限不足', '請授予麥克風權限以使用語音功能');
      await requestPermission();
      return;
    }

    try {
      setRecognizedText('正在聆聽...');
      setIsRecording(true);
      await Voice.start('zh-TW');
    } catch (error) {
      console.error('開始錄音錯誤:', error);
      Alert.alert('錯誤', '開始錄音時發生錯誤');
      setIsRecording(false);
      setRecognizedText('');
    }
  }, [permissionGranted, requestPermission]);

  const stopRecording = useCallback(async (): Promise<void> => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('停止錄音錯誤:', error);
      Alert.alert('錯誤', '停止錄音時發生錯誤');
    }
  }, []);

  const toggleRecording = useCallback(async (): Promise<void> => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Voice 事件處理
  const onSpeechStart = useCallback(() => {
    console.log('語音識別開始');
    setRecognizedText('');
    setIsListening(true);
  }, []);

  const onSpeechRecognized = useCallback(() => {
    console.log('語音被識別');
  }, []);

  const onSpeechEnd = useCallback(() => {
    console.log('語音識別結束');
    setIsRecording(false);
    setIsListening(false);
  }, []);

  const onSpeechError = useCallback((e: any) => {
    console.error('語音識別錯誤:', e.error);
    setIsRecording(false);
    setIsListening(false);
    Alert.alert('語音識別錯誤', e.error?.message || '語音識別失敗，請重試');
  }, []);

  const onVoiceSpeechResults = useCallback((e: SpeechResultsEvent) => {
    console.log('語音結果:', e.value);
    if (e.value && e.value.length > 0) {
      const text = e.value[0];
      setRecognizedText(text);
      onSpeechResults?.(text);
      setIsListening(false);
    }
  }, [onSpeechResults]);

  const onSpeechPartialResults = useCallback((e: SpeechResultsEvent) => {
    console.log('部分結果:', e.value);
    if (e.value && e.value.length > 0) {
      setRecognizedText(e.value[0]);
    }
  }, []);

  useEffect(() => {
    requestPermission();

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onVoiceSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [
    requestPermission,
    onSpeechStart,
    onSpeechRecognized,
    onSpeechEnd,
    onSpeechError,
    onVoiceSpeechResults,
    onSpeechPartialResults,
  ]);

  return {
    // State
    isRecording,
    recognizedText,
    permissionGranted,
    isListening,
    
    // Actions
    startRecording,
    stopRecording,
    toggleRecording,
    requestPermission,
    clearRecognizedText,
  };
};
