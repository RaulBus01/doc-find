import 'dotenv/config';

export default {
    "expo": {
      "name": "doc-find",
      "slug": "doc-find",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/images/icon.png",
      "scheme": "myapp",
      "userInterfaceStyle": "automatic",
      "newArchEnabled": true,
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.laurbalaur.docfind"
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/images/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        },
        "package": "com.laurbalaur.docfind",
        "config":{
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      }
      },
      "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/favicon.png"
      },
      "plugins": [
        "expo-sqlite",
        "expo-router",
        [
          "expo-splash-screen",
          {
            "image": "./assets/images/splash-icon.png",
            "imageWidth": 200,
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
          }
        ],
        "expo-font",                                  
        [
          "react-native-auth0",
          {
            "domain": process.env.AUTH0_DOMAIN,
          }
        ],
        [
        "expo-google-places",
        {
          "androidApiKey": process.env.GOOGLE_MAPS_API_KEY,
          "iosApiKey": process.env.GOOGLE_MAPS_API_KEY,
        }
      ],
        "expo-asset",
        
      ],
      "experiments": {
        "typedRoutes": true
      },
      "extra": {
        "router": {
        "origin": false
        },
        "eas": {
        "projectId": "e5c7b9cb-3742-4d5c-b673-6a59e017ad82"
        },
        "auth0": {
        "domain": process.env.AUTH0_DOMAIN,
        "clientId": process.env.AUTH0_CLIENT_ID,
        "audience": process.env.AUTH0_AUDIENCE
        },
        "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
      }
    }
  }
  