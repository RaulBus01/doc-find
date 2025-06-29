import { View, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useMemo } from 'react';
import TabBarButton from './TabBarButton';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/Colors';
import { TabBarVisibilityContext } from '@/context/TabBarContext';
import { useTranslation } from 'react-i18next';

type AllowedRoute = {
  name: string;
  path: string;
  iconDefault: string;
  iconFocused: string;
  order: number;
};

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;

};


const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {

  const { isTabBarVisible } = useContext(TabBarVisibilityContext);
  const translateY = useSharedValue(50); 
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const {t} = useTranslation();
  const allowedRoutes: AllowedRoute[] = [
  { name: t('tabbar.home'), path: 'index', iconFocused: 'home', iconDefault: 'home-outline', order: 1 },
  { name: t('tabbar.map'), path: 'map', iconFocused: 'map', iconDefault: 'map-outline', order: 2 },
  { name: t('tabbar.chat'), path: '(chat)', iconFocused: 'chatbubbles', iconDefault: 'chatbubbles-outline', order: 3 },
  { name: t('tabbar.account'), path: 'account', iconFocused: 'person', iconDefault: 'person-outline', order: 4 },
];


  useEffect(() => {
    translateY.value = withTiming(isTabBarVisible ? 0 : 50, { duration: 300 });
  }, [isTabBarVisible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const filteredRoutes = useMemo(() => 
    state.routes.filter((route: { name: string }) =>
      allowedRoutes.some(allowed => allowed.path === route.name)
    ), 
  [state.routes]);

  const orderedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      const aIndex = allowedRoutes.find(allowed => allowed.path === a.name)?.order;
      const bIndex = allowedRoutes.find(allowed => allowed.path === b.name)?.order;
      return aIndex! - bIndex!;
    });
  }, [filteredRoutes]);

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents={isTabBarVisible ? 'auto' : 'none'}>
      {orderedRoutes?.map((route: { key: string | number; name: string }, index: any) => {
          const { options } = descriptors[route.key];
          const matchingRoute = allowedRoutes.find(allowed => allowed.path === route.name);
          if (!matchingRoute) return null;
          const label =
            options.tabBarLabel ?? options.title ?? matchingRoute.name;
          const isFocused = state.routes[state.index].name === route.name;
          const onPress = () => {
          
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            
            <TabBarButton
              key={route.key}
              color={theme.text}
              isFocused={isFocused}
              label={label}
              iconDefault={matchingRoute.iconDefault}
              iconFocused={matchingRoute.iconFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
    </Animated.View>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: '6%',
    backgroundColor: theme.tabbarBackground,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 0.5,
  }
});

export default TabBar;