import { View, Text, Image } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";

export default function PastReading({
  temperature,
  humidity,
  safe,
  NH3,
  sound,
  light,
  date,
}: {
  temperature: number;
  humidity: number;
  safe: boolean;
  NH3: number;
  sound: string;
  light: string;
  date: string;
}) {
  // console.log(temperature);

  return (
    <View
      style={{
        borderBottomColor: Colors.separators,
        borderBottomWidth: 1,
        width: "100%",
        flexDirection: "row",
        padding: 10,
        marginVertical: 10,
        backgroundColor: "#222d5b",
        borderRadius: 10,
      }}>
      <View>
        <Text style={[Styles.normalText, { fontWeight: "bold" }]}>
          Temperature: {temperature}°C, Humidity: {humidity}%, NH3 Gas: {NH3}
          ppm, light: {light}
        </Text>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 20,
            justifyContent: "space-between",
          }}>
          <Text style={{ color: "white" }}>{date}</Text>
          <Text
            style={{
              color: safe ? Colors.farmGreen : Colors.warning,
              fontSize: 15,
            }}>
            {safe ? "Safe" : "Not Safe"}
          </Text>
        </View>
      </View>
    </View>
  );
}
