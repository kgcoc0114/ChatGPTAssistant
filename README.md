# ChatGPT Assistant
A cross-platform AI assistant app built with React Native. It enables users to interact with ChatGPT via text or voice, and manage chat history with a user-friendly interface.

## Features
- ChatGPT Conversations: Support for GPT-3.5 Turbo and GPT-4 models
- Voice Interaction: Speech recognition and AI voice synthesis
- Chat History: Cloud storage and history management
- Google Authentication: Secure authentication system
- Cross-Platform: Support for iOS and Android

## Tech Stack
### Frontend Framework
- React Native: Cross-platform mobile app development framework
- TypeScript: Type-safe JavaScript superset

### Navigation System
- @react-navigation/native: React Native navigation library
- @react-navigation/bottom-tabs: Bottom tab navigation
- @react-navigation/stack: Stack navigation

### State Management
- React Context API: Global state management (authentication state)
- React Hooks: Local state management

### Backend Services
- Firebase Authentication: User authentication
- Cloud Firestore: Cloud storage for chat history
- OpenAI API: ChatGPT conversations and voice synthesis

### Storage System
- AsyncStorage: Local preference storage

### UI Components
- @react-native-vector-icons: Icon library

### Additional Libraries
- @react-native-google-signin/google-signin: Google Sign-In
- react-native-fs: File system operations
- axios: HTTP request library

## Project Architecture
```
ChatGPTAssistant/
├── src/
│   ├── features/                     # Application screens
│   │   ├── chat
│   │   ├── chatHistory
│   │   ├── login
│   │   ├── main
│   │   ├── settings
│   │   └── voice
│   ├── services/                     # API services
│   │   ├── ChatGPTService.ts         # OpenAI API integration
│   │   ├── FirestoreService.ts       # Firebase configuration
│   │   └── PreferenceService.ts      # AsyncStorage utilities
│   ├── context/                      # React Context providers
│   │   └── AuthContext.tsx
│   ├── navigation/
│   ├── styles/                       # App styles
│   └── constants/                    # App constants
├── ios/                              # iOS native code
├── android/                          # Android native code
├── assets/                           # Images, fonts, etc.
├── App.tsx                           # Main app component
└── package.json                      # Dependencies and scripts
```

## Installation & Setup

1. Clone the Repository
    ```bash
    git clone https://github.com/kgcoc0114/ChatGPTAssistant.git
    cd ChatGPTAssistant
    ```

2. Install Dependencies
    ```bash
    yarn install
    ```

3. iOS Additional Setup
    ```bash
    cd ios
    pod install
    cd ..
    ```

4. Environment Configuration
    ```typescript
    // env.ts (example only, do not commit actual API keys)
    export const ENV = {
      // OpenAI API Configuration
      OPENAI_API_KEY: 'your-openai-api-key',
      OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
      OPENAI_TTS_URL: 'https://api.openai.com/v1/audio/speech',
    
      // Google Sign-In Configuration
      GOOGLE_SIGNIN: {
        webClientId: 'your-google-web-client-id',
        iosClientId: 'your-google-ios-client-id',
      }
    };
    ```

5. Firebase Configuration
- iOS Configuration
  - Create an iOS app in Firebase Console
  - Download `GoogleService-Info.plist`
  - Place the file in the `ios/ChatGPTAssistant` directory

6. Run the Application
    ```bash
    yarn ios
    ```

## Core Features
### Authentication System
- Uses Firebase Authentication with Google Sign-In
- AuthContext provides global authentication state management
- Automatic login state persistence

### Chat Functionality
- Support for multiple OpenAI models (GPT-3.5 Turbo, GPT-4)
- Real-time message synchronization to Firestore
- Cloud storage and retrieval of chat history

### Voice Functionality
- Speech-to-text recognition
- Text-to-speech for ChatGPT responses
- Voice conversation history

### Data Storage
- **Firestore Structure**: User chat history
- **AsyncStorage**: Local app settings

## Requirements
- Node.js 18 or later
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Firebase project with Authentication and Firestore enabled
- OpenAI API key
- Google credentials

## Troubleshooting
- iOS Build Errors
  - Metro bundler issues: Try `yarn start --reset-cache`
  - iOS build failures: Clean build folder in Xcode or run `cd ios && xcodebuild clean`
  - CocoaPods issues: Run `cd ios && pod install --repo-update`
- Firebase Configuration
  - Firebase setup issues: Ensure configuration files are in correct directories
    - iOS: `GoogleService-Info.plist` in `ios/ChatGPTAssistant/`
- React Native Sound Issues

    If you encounter audio-related build issues, particularly with react-native-sound library, refer to this solution:
    - Reference: [react-native-sound build issues fix](https://github.com/zmxv/react-native-sound/issues/857)

## Contact
**Karen Chiu**
- Email: karenchiu0114@gmail.com
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-KarenChiu-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/karen-chiu-kcc/)
