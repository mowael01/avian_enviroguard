import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function ReadingCircle(props: { label: string; value: string }) {
  return (
    <View>
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <Text style={{ fontWeight: "300", fontSize: 20 }}>{props.label}</Text>
          <Text style={{ fontWeight: "bold", fontSize: 40, color: "#0a7ea4" }}>
            {props.value}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerCircle: {
    width: 75 * 3,
    height: 75 * 3,
    backgroundColor: "white",
    borderRadius: 37.5 * 3,
    justifyContent: "center",
    alignItems: "center",
    // these shadow styles are not working for Android
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 20,
  },
  outerCircle: {
    width: 87.5 * 3,
    height: 87.5 * 3,
    backgroundColor: "#C0CCE4",
    borderRadius: 43.75 * 3,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "black",
    // borderWidth: 1,
  },
});
