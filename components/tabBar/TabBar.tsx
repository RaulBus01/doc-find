import { View, StyleSheet } from 'react-native'
import React from 'react'
import TabBarButton from './TabBarButton';
import { Colors } from '@/constants/Colors';

type AllowedRoute = {
    name: string;
    path: string;
    iconDefault: string;
    iconFocused: string;
};

type TabBarProps = {
    state: any;
    descriptors: any;
    navigation: any;
};

const allowedRoutes: AllowedRoute[] = [
    { name: 'Home', path: 'index', iconFocused: 'home' , iconDefault: 'home-outline' },
    { name: 'Map', path: 'map', iconFocused: 'map' , iconDefault: 'map-outline' },
    { name: 'Account', path: 'account', iconFocused: 'person' , iconDefault: 'person-outline' },
    { name: 'Chat', path: 'chat', iconFocused: 'chatbubbles' , iconDefault: 'chatbubbles-outline' },
];

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
    const currentRoute = state.routes[state.index];
    
    if (currentRoute.name === 'map') return null;

    return (
        <View style={styles.container}>
            {state.routes
                .filter((route: { name: string; }) => {
                    const routeName = route.name;
                    return allowedRoutes.find(allowed => allowed.path === routeName);
                })
                .map((route: { key: string | number; name: string; }, index: any) => {
                    const { options } = descriptors[route.key];
                    const matchingRoute = allowedRoutes.find(allowed => allowed.path === route.name);

                    if (!matchingRoute) return null;

                    const label = options.tabBarLabel ?? 
                                options.title ?? 
                                matchingRoute.name;

                    const isFocused = state.index === index;

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        bottom: 10,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '95%',
        height: '8%',
        borderRadius: 25,
        backgroundColor: 'white',
        marginHorizontal: 10,
        paddingVertical: 10,
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
});

export default TabBar;