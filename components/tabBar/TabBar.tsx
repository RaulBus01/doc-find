import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import TabBarButton from './TabBarButton';
import { Colors } from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

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
  IsTabBarVisible: boolean;
};

const allowedRoutes: AllowedRoute[] = [
  { name: 'Home', path: 'index', iconFocused: 'home', iconDefault: 'home-outline', order: 1 },
  { name: 'Map', path: 'map', iconFocused: 'map', iconDefault: 'map-outline', order: 2 },
  { name: 'Chat', path: '(chat)', iconFocused: 'chatbubbles', iconDefault: 'chatbubbles-outline', order: 3 },
  { name: 'Account', path: 'account', iconFocused: 'person', iconDefault: 'person-outline', order: 4 },
];

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation, IsTabBarVisible }) => {
  // Shared value to control vertical translation
  const translateY = useSharedValue(50); 

  useEffect(() => {
    translateY.value = withTiming(IsTabBarVisible ? 0 : 50, { duration: 300 });
  }, [IsTabBarVisible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const filteredRoutes = state.routes.filter((route: { name: string }) =>
    allowedRoutes.some(allowed => allowed.path === route.name)
  );

  const orderedRoutes = filteredRoutes.sort((a: { name: string }, b: { name: string }) => {
    const aIndex = allowedRoutes.find(allowed => allowed.path === a.name)?.order;
    const bIndex = allowedRoutes.find(allowed => allowed.path === b.name)?.order;
    return aIndex! - bIndex!;
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents={IsTabBarVisible ? 'auto' : 'none'}>
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
              color={Colors.light.tabIconDefault}
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

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: Colors.light.lightgreen,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
});

export default TabBar;