import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ExternalPathString,
  Href,
  Link,
  RelativePathString,
} from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ReadingBox({
  label,
  value,
  unit,
  icon,
  color,
  boxStyle,
  destination,
}: {
  label: string;
  value: number | string;
  unit: string;
  icon: string;
  color: string;
  destination: Href;
  boxStyle?: object;
}) {
  return (
    <View style={[styles.readingBox, boxStyle]}>
      <Ionicons
        // @ts-expect-error
        name={icon}
        size={40}
        color="white"
        style={[
          {
            backgroundColor: color,
          },
          styles.readingIcon,
        ]}
      />
      <View style={styles.readingTextContianer}>
        <Link href={destination}>
          <Text style={styles.readingLabel}>{label}</Text>
        </Link>

        <Link href={destination}>
          <Text
            style={[
              styles.readingValue,
              { color: color, fontSize: value.toString().length > 5 ? 20 : 30 },
            ]}>
            {value}
            {unit}
          </Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  readingBox: {
    backgroundColor: "#222d5b",
    borderRadius: 15,
    width: "48%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
  },

  readingTextContianer: {
    marginLeft: 10,
  },
  readingValue: {
    fontSize: 30,
    fontWeight: "600",
  },
  readingIcon: {
    // backgroundColor: "#fb6781",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 10
    textAlign: "center",
    textAlignVertical: "center",
  },
  readingLabel: {
    color: "#c0c0c0",
    fontSize: 16,
  },
});
