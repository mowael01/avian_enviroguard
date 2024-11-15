import { View, Text, Image } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";

export default function PastReading() {
  const [safe, setSafe] = React.useState(true);
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
          24°C 47% 55 NH3 light
        </Text>
        <Text style={{ color: "white" }}>May 4th, 2024</Text>
      </View>
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 20,
          justifyContent: "space-between",
        }}>
        <Text style={Styles.normalText}>00 min ago</Text>
        <Text
          style={{
            color: safe ? Colors.farmGreen : Colors.warning,
            fontSize: 15,
          }}>
          safe
        </Text>
      </View>
    </View>
  );
}
