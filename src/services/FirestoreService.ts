import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
type FirestoreTimestamp = FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue;

export interface ChatData {
  chatId: string;
  userId: string;
  title?: string;
  lastText?: string;
  messageCount: number;
  createdAt: FirestoreTimestamp;
  lastActivity: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export interface MessageData {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: FirestoreTimestamp;
  chatId: string;
  userId: string;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export interface UserData {
  userId: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: FirestoreTimestamp;
  lastLoginAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export class FirestoreService {
  private static readonly COLLECTIONS = {
    USERS: 'users',
    CHATS: 'chats',
    MESSAGES: 'messages',
  } as const;

  private static getUserRef(userId: string) {
    return firestore().collection(this.COLLECTIONS.USERS).doc(userId);
  }

  private static getChatRef(userId: string, chatId: string) {
    return this.getUserRef(userId)
      .collection(this.COLLECTIONS.CHATS)
      .doc(chatId);
  }

  private static getMessagesRef(userId: string, chatId: string) {
    return this.getChatRef(userId, chatId)
      .collection(this.COLLECTIONS.MESSAGES);
  }
  
  static safeToDate(timestamp: any): Date {
    return timestamp && typeof timestamp === 'object' && 'toDate' in timestamp
      ? (timestamp as FirebaseFirestoreTypes.Timestamp).toDate()
      : new Date();
  }
  
  static async saveUser(firebaseUser: any): Promise<void> {
    try {
      const userRef = this.getUserRef(firebaseUser.uid);
      const userDoc = await userRef.get();

      const userData: Partial<UserData> = {
        userId: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '使用者',
        photoURL: firebaseUser.photoURL || undefined,
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (!userDoc.exists) {
        // 新用戶
        await userRef.set({
          ...userData,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // 現有用戶
        await userRef.update(userData);
      }
    } catch (error) {
      console.error('儲存用戶資料失敗:', error);
      throw error;
    }
  }
  
  static async getUser(userId: string): Promise<UserData | null> {
    try {
      const userDoc = await this.getUserRef(userId).get();
      return userDoc.exists() ? userDoc.data() as UserData : null;
    } catch (error) {
      console.error('獲取用戶資料失敗:', error);
      throw error;
    }
  }
  
  static async createChat(userId: string, initialData?: Partial<ChatData>): Promise<string> {
    try {
      const chatRef = this.getUserRef(userId)
        .collection(this.COLLECTIONS.CHATS)
        .doc();
      
      const chatId = chatRef.id;
      
      const chatData: Partial<ChatData> = {
        chatId,
        userId,
        title: '',
        lastText: '',
        messageCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastActivity: firestore.FieldValue.serverTimestamp(),
        ...initialData,
      };

      await chatRef.set(chatData);
      console.log('[SUCCESS] Created new chat:', chatId);
      return chatId;
    } catch (error) {
      console.error('[ERROR] Creating chat:', error);
      throw error;
    }
  }
  
  static async checkChatExists(userId: string, chatId: string): Promise<boolean> {
    try {
      const chatDoc = await this.getChatRef(userId, chatId).get();
      return chatDoc.exists();
    } catch (error) {
      console.error('檢查聊天存在性失敗:', error);
      return false;
    }
  }
  
  static async getChat(userId: string, chatId: string): Promise<ChatData | null> {
    try {
      const chatDoc = await this.getChatRef(userId, chatId).get();
      return chatDoc.exists() ? chatDoc.data() as ChatData : null;
    } catch (error) {
      console.error('獲取聊天資料失敗:', error);
      throw error;
    }
  }
  
  static async updateChat(
    userId: string, 
    chatId: string, 
    updates: Partial<ChatData>
  ): Promise<void> {
    try {
      await this.getChatRef(userId, chatId).update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('更新聊天資料失敗:', error);
      throw error;
    }
  }
  
  static async deleteChat(userId: string, chatId: string): Promise<void> {
    try {
      const batch = firestore().batch();
      
      // 1. 刪除所有訊息
      const messagesSnapshot = await this.getMessagesRef(userId, chatId).get();
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // 2. 刪除聊天文檔
      batch.delete(this.getChatRef(userId, chatId));
      
      // 3. 執行批次操作
      await batch.commit();
      console.log(`Successfully deleted chat ${chatId} and all its messages`);
    } catch (error) {
      console.error('刪除聊天失敗:', error);
      throw error;
    }
  }
  
  static subscribeToChatList(
    userId: string,
    onSuccess: (chats: ChatData[]) => void,
    onError: (error: Error) => void
  ): () => void {
    const unsubscribe = this.getUserRef(userId)
      .collection(this.COLLECTIONS.CHATS)
      .orderBy('lastActivity', 'desc')
      .onSnapshot(
        (snapshot) => {
          const chats = snapshot.docs
            .map(doc => doc.data() as ChatData)
            .filter(chat => chat.messageCount > 0);
          onSuccess(chats);
        },
        (error) => {
          console.error('監聽聊天列表失敗:', error);
          onError(error);
        }
      );

    return unsubscribe;
  }
  
  static async addMessage(
    userId: string,
    chatId: string,
    text: string,
    isUser: boolean
  ): Promise<string> {
    try {
      const batch = firestore().batch();
      
      // 1. 新增訊息
      const messageRef = this.getMessagesRef(userId, chatId).doc();
      batch.set(messageRef, {
        text,
        isUser,
        timestamp: firestore.FieldValue.serverTimestamp(),
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId,
        chatId,
      });
      
      // 2. 更新聊天資料
      const chatRef = this.getChatRef(userId, chatId);
      batch.update(chatRef, {
        lastText: text,
        lastActivity: firestore.FieldValue.serverTimestamp(),
        messageCount: firestore.FieldValue.increment(1),
      });
      
      await batch.commit();
      return messageRef.id;
    } catch (error) {
      console.error('新增訊息失敗:', error);
      throw error;
    }
  }
  
  static async updateMessage(
    userId: string,
    chatId: string,
    messageId: string,
    updates: Partial<Pick<MessageData, 'text'>>
  ): Promise<void> {
    try {
      await this.getMessagesRef(userId, chatId)
        .doc(messageId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('更新訊息失敗:', error);
      throw error;
    }
  }
  
  static async clearMessages(userId: string, chatId: string): Promise<void> {
    try {
      const batch = firestore().batch();
      
      // 1. 刪除所有訊息
      const messagesSnapshot = await this.getMessagesRef(userId, chatId).get();
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // 2. 重置聊天計數
      batch.update(this.getChatRef(userId, chatId), {
        messageCount: 0,
        lastActivity: firestore.FieldValue.serverTimestamp(),
      });
      
      await batch.commit();
    } catch (error) {
      console.error('清除訊息失敗:', error);
      throw error;
    }
  }

  static subscribeToMessages(
    userId: string,
    chatId: string,
    onSuccess: (messages: MessageData[]) => void,
    onError: (error: Error) => void
  ): () => void {
    const unsubscribe = this.getMessagesRef(userId, chatId)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (snapshot) => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as MessageData[];
          onSuccess(messages);
        },
        (error) => {
          console.error('監聽訊息失敗:', error);
          onError(error);
        }
      );

    return unsubscribe;
  }

  static async batchDeleteChats(userId: string, chatIds: string[]): Promise<void> {
    try {
      const batch = firestore().batch();
      
      for (const chatId of chatIds) {
        // 刪除訊息
        const messagesSnapshot = await this.getMessagesRef(userId, chatId).get();
        messagesSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        // 刪除聊天
        batch.delete(this.getChatRef(userId, chatId));
      }
      
      await batch.commit();
    } catch (error) {
      console.error('批次刪除聊天失敗:', error);
      throw error;
    }
  }
}
