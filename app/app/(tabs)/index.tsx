import { ScrollView, Text, View, StyleSheet } from "react-native";

import ReadingRow from "@/components/ReadingRow";

export default function Index() {
  return (
    <ScrollView
      style={{
        padding: 10,
      }}>
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            fontSize: 50,
            fontWeight: "bold",
            fontStyle: "italic",
          }}>
          Welcome
        </Text>
      </View>
      <View>
        <ReadingRow
          description={"hello there from inside our application"}
          lable="Temperature"
          data={50.5}
          targetPage="temperature"
          unit="°C"
          max={60}
        />
        <ReadingRow
          description={"hello there from inside our application"}
          lable="Humidity"
          data={23.5}
          targetPage="humidity"
          unit="%"
          max={100}
        />
        <ReadingRow
          description={"hello there from inside our application"}
          lable="Light"
          data={23.5}
          targetPage="light"
          max={1000}
        />
        <ReadingRow
          description={"hello there from inside our application"}
          lable="Gas"
          data={23.5}
          targetPage="gas"
          unit="%"
          max={100}
        />
        <ReadingRow
          description={"hello there from inside our application"}
          lable="Sound"
          data={23.5}
          targetPage="sound"
          unit="hz"
          max={100}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentLeft: {
    flexDirection: "row-reverse",
  },
  general: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
});
