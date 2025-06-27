# DocFind - AI-Powered Medical Assistant 🏥

A comprehensive mobile health application built with React Native and Expo that provides AI-powered medical assistance, profile management, and location-based medical services.

## 🌟 Features

### 🤖 AI Medical Assistant
- **Intelligent Chatbot**: AI-powered assistant that analyzes symptoms and provides potential diagnoses
- **Context-Aware Responses**: Uses personal medical profiles to provide tailored health advice
- **Multi-language Support**: Available in Romanian and other languages
- **Real-time Streaming**: Live AI responses for immediate assistance

### 👤 Medical Profile Management
- **Comprehensive Profiles**: Create and manage detailed medical profiles for family members
- **Health Indicators**: Track smoking status, hypertension, diabetes, and other health metrics
- **Medical History**: Maintain detailed records of past medical conditions and treatments
- **Medication Tracking**: Monitor current medications with dosage information
- **Allergy Management**: Record and track allergies with severity levels

### 📍 Location Services
- **Medical Facility Finder**: Locate nearby hospitals, clinics, and pharmacies
- **Interactive Maps**: View medical facilities on an integrated map interface
- **Place Details**: Get comprehensive information about medical facilities including contact details, hours, and reviews

### 🔐 Security & Authentication
- **Auth0 Integration**: Secure authentication and user management
- **Offline Support**: Continue using the app even without internet connection
- **Data Synchronization**: PowerSync integration for real-time data sync across devices

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library

### Backend & Database
- **SQLite** - Local database storage
- **Drizzle ORM** - TypeScript ORM for database operations
- **PowerSync** - Real-time data synchronization

### UI & Styling
- **React Native Reanimated** - Smooth animations
- **Bottom Sheet** - Modern modal interfaces
- **Custom Components** - Tailored UI components

### Additional Libraries
- **React Native Maps** - Map integration
- **i18next** - Internationalization
- **Expo Location** - GPS and location services
- **React Native Markdown** - Rich text display
- **Toastify** - User notifications

## 📱 Installation

### Prerequisites
- Node.js (v18 or higher)
- Npm package manager
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaulBus01/doc-find.git
   cd doc-find
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with your configuration:
   ```env
   AUTH0_DOMAIN=your-auth0-domain
   AUTH0_CLIENT_ID=your-auth0-client-id
   POWERSYNC_URL=your-powersync-url
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - **Android**: `npm run:android`
   - **iOS**: `npm run:ios`

## 🏗️ Project Structure

```
doc-find/
├── app/                          # Main application screens
│   ├── (auth)/                   # Authentication screens
│   ├── (profiles)/               # Profile management
│   │   ├── (allergies)/          # Allergy management
│   │   ├── (edit)/               # Profile editing
│   │   ├── (medications)/        # Medication tracking
│   │   └── (medicalhistory)/     # Medical history
│   └── (tabs)/                   # Main tab navigation
├── components/                   # Reusable UI components
├── constants/                    # App constants and themes
├── context/                      # React context providers
├── database/                     # Database schema and migrations
├── hooks/                        # Custom React hooks
├── i18n/                         # Internationalization
├── interface/                    # TypeScript interfaces
├── powersync/                    # PowerSync configuration
├── screens/                      # Screen components
└── utils/                        # Utility functions
```

## 🎯 Key Features Overview

### Medical Profiles
- Create multiple family member profiles
- Track personal health indicators
- Maintain comprehensive medical histories
- Manage current medications and allergies

### AI Chat Assistant
- Symptom analysis and potential diagnosis suggestions
- Personalized responses based on medical profiles
- Multi-language support (Romanian, English)
- Chat history management

### Location Services
- Find nearby medical facilities
- View facility details (hours, contact, reviews)
- Get directions to medical locations
- Filter by facility type (hospitals, clinics, pharmacies)

### Data Management
- Offline-first architecture
- Real-time synchronization
- Secure data storage
- Export/import capabilities

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm android` - Run on Android device/emulator

## 🌍 Internationalization

The app supports multiple languages with full localization:
- Romanian -
- English -
- French -
- Spanish -
- Portuguese -
- Italian -
- German -

Language files are located in `i18n/locales/` with comprehensive translations for all UI elements.

## 📊 Database Schema

The app uses SQLite with Drizzle ORM for data management:
- **profiles** - User medical profiles
- **healthIndicators** - Health status tracking
- **medications** - Medication database and user associations
- **allergies** - Allergy information and user associations
- **medicalHistory** - Medical history entries
- **chats** - AI chat conversations

## 🔒 Authentication

Secure authentication is handled through Auth0, providing:
- Social login options
- Secure token management
- User profile synchronization
- Multi-device support

## 🚀 Deployment

### Building for Production

1. **Configure app.config.js** with production settings
2. **Build the app**:
   - `eas build`
3. **Deploy to app stores** using EAS Build
4.   APK build for Android available:
 ```bash
   https://expo.dev/artifacts/eas/oFXBYDmqeKxZLfVtTYU9VE.apk
   ```



