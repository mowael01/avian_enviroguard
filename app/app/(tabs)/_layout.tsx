import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.separators,
            borderTopWidth: 1,
            height: 60,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="gas"
          options={{
            title: "Gas",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "flame" : "flame-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="light"
          options={{
            title: "Light",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "bulb" : "bulb-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sound"
          options={{
            title: "Sound",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "mic" : "mic-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="humidity"
          options={{
            title: "Humidity",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "water" : "water-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="temperature"
          options={{
            title: "Temperature",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "thermometer" : "thermometer-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarItemStyle: {
              display: "none",
            },
          }}
        />
      </Tabs>
      <StatusBar barStyle="light-content" />
    </>
  );
}
