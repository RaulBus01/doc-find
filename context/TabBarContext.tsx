import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

export const TabBarVisibilityContext = createContext({
  isTabBarVisible: true,
  setIsTabBarVisible: (visible: boolean) => {},
});

export const TabBarVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(isVisible);
  
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  return (
    <TabBarVisibilityContext.Provider 
      value={{
        isTabBarVisible: isVisible,
        setIsTabBarVisible: setIsVisible,
      }}
    >
      {children}
    </TabBarVisibilityContext.Provider>
  );
};