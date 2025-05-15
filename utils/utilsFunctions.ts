import { ThemeColors } from "@/constants/Colors";

import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";



export const getStatusColor = (theme:ThemeColors,statusValue: string) => {
    switch(statusValue.toLowerCase()) {
      case 'ongoing':
        return theme.YellowIconBackground; // Yellow
      case 'resolved':
        return theme.GreenIconBackground; // Green
      case 'chronic':
        return theme.RedIconBackground; // Red
      default:
        return theme.text;
    }
  };

