import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CollapsibleProps {
  title: React.ReactNode;
  content: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, content }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCollapse}>
        <View style={styles.titleContainer}>{title}</View>
      </TouchableOpacity>
      {!isCollapsed && <View style={styles.contentContainer}>{content}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  titleContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  contentContainer: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 5,
  },
});

export default Collapsible;
