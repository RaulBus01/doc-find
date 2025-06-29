interface ThemeColors {
  text: string;
  textDark?: string;
  textLight?: string;
  background: string;
  backgroundDark: string;
  progressColor: string;
  tabbarBackground: string;
  lightGreen: string;
  blue: string;
  yellow: string;
  red: string; 
  cardBackground: string;
  pressedBackground: string;
  separator: string;
  avatarBackground: string;
  profileActionBackground: string;
  BlueIconBackground: string;
  VioletIconBackground: string;
  GreenIconBackground: string;
  RedIconBackground: string;
  YellowIconBackground: string;
  LightBlueIconBackground: string;
  LightVioletIconBackground: string;
}

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    text: '#222B24',
    textLight: '#F6F6F6',
    background:"#F6F6F6",
    backgroundDark:"#e2e2e2",
    tabbarBackground:"#F2F2F2",
    lightGreen:"#84cc15",
    progressColor:"#4CAF50",
    blue:"#3c82f6",
    red:"#FF5722",
    yellow: '#FFEB3B',

    cardBackground: 'rgba(141, 141, 141, 0.18)',
    pressedBackground: 'rgba(36, 29, 29, 0.05)',
    separator: 'rgba(34, 29, 29, 0.49)', 
    avatarBackground: 'rgba(255, 255, 255, 0.55)',
    profileActionBackground: 'rgba(255, 255, 255, 0.53)',
  
    BlueIconBackground: 'rgba(59, 130, 246, 0.25)',
    VioletIconBackground: 'rgba(138, 92, 246, 0.15)',
    GreenIconBackground: 'rgba(176, 223, 107, 0.25)',
    RedIconBackground: 'rgba(239, 68, 68, 0.5)',
    YellowIconBackground: 'rgba(251, 191, 36, 0.25)',
    LightBlueIconBackground: 'rgba(59, 130, 246, 0.25)',
    LightVioletIconBackground: 'rgba(124, 58, 237, 0.25)',
  },
  dark: {
    text: '#e4e4e4',
    textDark: '#222B24',
    background:"#111b14",
    backgroundDark:"#1c2a1b",
    tabbarBackground:"#2f3c33",
    lightGreen:"#84cc16",
    progressColor:"#3b893d",
    blue:"#1f3354",
    red: '#db3908', 
    yellow: '#f2b600',

    cardBackground: 'rgba(255, 255, 255, 0.1)',
    pressedBackground: 'rgba(92, 92, 92, 0.25)',
    separator: 'rgba(255, 255, 255, 0.56)',
    avatarBackground: 'rgba(255, 255, 255, 0.2)',
    profileActionBackground: 'rgba(255, 255, 255, 0.15)',
 
    BlueIconBackground: 'rgba(59, 130, 246, 0.25)',
    VioletIconBackground: 'rgba(138, 92, 246, 0.25)',
    GreenIconBackground: 'rgba(52, 211, 153, 0.25)',
    RedIconBackground: 'rgba(239, 68, 68, 0.25)', 
    YellowIconBackground: 'rgba(251, 191, 36, 0.25)',
    LightBlueIconBackground: 'rgba(59, 130, 246, 0.25)',
    LightVioletIconBackground: 'rgba(124, 58, 237, 0.25)',
  },
};

export type { ThemeColors };