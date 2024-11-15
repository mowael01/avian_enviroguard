import React, { useState } from "react";
import { StyleSheet, Pressable, Animated, ViewStyle } from "react-native";

const TouchableWrapper = ({ children, style, onPress, ...props }: any) => {
  const [opacity] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress || (() => {})} // Default to no-op function
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}>
      <Animated.View style={[style || {}, { opacity }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default TouchableWrapper;
