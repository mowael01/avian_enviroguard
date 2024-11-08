import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
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
              name={focused ? "code-slash" : "code-slash-outline"}
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
              name={focused ? "code-slash" : "code-slash-outline"}
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
              name={focused ? "cog" : "code-slash-outline"}
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
              name={focused ? "flame" : "flame-outline"}
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
    </Tabs>
  );
}
