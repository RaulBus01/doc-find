import { ThemeColors } from "@/constants/Colors";



export const getStatusColor = (theme:ThemeColors,statusValue: string) => {
    switch(statusValue.toLowerCase()) {
      case 'ongoing':
        return theme.YellowIconBackground;
      case 'resolved':
        return theme.GreenIconBackground; 
      case 'chronic':
        return theme.RedIconBackground; 
      default:
        return theme.text;
    }
  };

