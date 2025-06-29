import { useState, useCallback, useMemo } from 'react';

export interface UseChatInputReturn {
  // State
  inputText: string;
  canSend: boolean;
  charCount: number;
  
  // Actions
  setInputText: (text: string) => void;
  clearInput: () => void;
  appendText: (text: string) => void;
}

const MAX_CHAR_LIMIT = 1000;

export const useChatInput = (): UseChatInputReturn => {
  const [inputText, setInputText] = useState<string>('');

  const canSend = useMemo(() => {
    return inputText.trim().length > 0 && inputText.length <= MAX_CHAR_LIMIT;
  }, [inputText]);

  const charCount = useMemo(() => {
    return inputText.length;
  }, [inputText]);

  const clearInput = useCallback(() => {
    setInputText('');
  }, []);

  const appendText = useCallback((text: string) => {
    setInputText(prev => {
      const newText = prev + text;
      return newText.length <= MAX_CHAR_LIMIT ? newText : prev;
    });
  }, []);

  const handleSetInputText = useCallback((text: string) => {
    // 限制字元數量
    if (text.length <= MAX_CHAR_LIMIT) {
      setInputText(text);
    }
  }, []);

  return {
    // State
    inputText,
    canSend,
    charCount,
    
    // Actions
    setInputText: handleSetInputText,
    clearInput,
    appendText,
  };
};