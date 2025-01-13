import React from "react";
import { Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

interface OpenURLButtonProps {
  url: string;
  children: React.ReactNode;
}

const OpenURLButton: React.FC<OpenURLButtonProps> = ({ url, children }) => {
  const handlePress = () => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred: ", err)
    );
  };
  return (
    <TouchableOpacity onPress={handlePress} style={styles.link}>
      <Text style={styles.linkText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    padding: 5,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default OpenURLButton;
