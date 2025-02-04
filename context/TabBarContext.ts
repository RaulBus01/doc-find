import React, { createContext } from 'react';

type ContextType = {
  isTabBarVisible: boolean;
  setIsTabBarVisible: (visible: boolean) => void;
};

export const TabBarVisibilityContext = createContext<ContextType>({
  isTabBarVisible: true,
  setIsTabBarVisible: () => {},
});