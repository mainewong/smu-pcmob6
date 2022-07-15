import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BlogStack from '../components/BlogStack';
import AccountStack from '../components/AccountStack';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function LoggedInStack() {
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Reviews') {
            iconName = "comments"
          } else if (route.name === 'Profile') {
            iconName = "user"
          }
          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#3F5362',
        inactiveTintColor: '#C7B6A6',
        // tabStyle: {
        //   backgroundColor: isDark ? "#181818" : "white",
        // }
      }}
      >
        <Tab.Screen name="Reviews" component={BlogStack} />
        <Tab.Screen name="Profile" component={AccountStack} />
    </Tab.Navigator>
  )
}