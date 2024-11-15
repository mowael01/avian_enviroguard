import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";

import { Styles } from "@/constants/Styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReadingBox from "@/components/ReadingBox";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import PastReading from "@/components/PastReading";
import { useState } from "react";

export default function Index() {
  return (
    <ScrollView>
      <View style={Styles.container}>
        <ImageBackground
          source={require("../../assets/images/index-back.jpg")} // Replace with your s
          resizeMode="cover"
          style={[
            {
              /* @info Make the image fill the containing view */ flex: 1,
              /* @info Scale up the image to fill the container, preserving aspect ratio */
              justifyContent: "center",
            },
          ]}>
          {/* the upper view that contians the icons */}
          <View style={styles.upperView}>
            {/* notification icon */}
            <Link href={"/(tabs)/notifications"}>
              <Ionicons name="notifications" size={30} color="white" />
            </Link>
            {/* user icon */}
            <Ionicons name="person" size={30} color="white" />
          </View>
          {/* the View that contians the readings */}
          <View style={styles.readingsContainer}>
            <View style={styles.readingRow}>
              <ReadingBox
                label="Temperature"
                value={50.5}
                unit="°C"
                icon="thermometer"
                color="#fb6781"
                boxStyle={{ width: "100%" }}
              />
            </View>

            <View style={styles.readingRow}>
              <ReadingBox
                label="Humidity"
                value={23.5}
                unit="%"
                icon="water"
                color="#65bef8"
              />

              <ReadingBox
                label="Gas"
                value={23.5}
                unit="%"
                icon="flame"
                color="#44d586"
              />
            </View>

            <View style={styles.readingRow}>
              <ReadingBox
                label="Noise"
                value={23.5}
                unit="dB"
                icon="mic"
                color="#825af8"
              />
              <ReadingBox
                label="Light"
                value={23.5}
                unit="%"
                icon="sunny"
                color="#f1c40f"
              />
            </View>
          </View>
          <View>
            <Text style={styles.newSectionTitle}>Environmental Records</Text>
            <Link href="/(tabs)/temperature">
              <Text
                style={{
                  color: "white",
                  textDecorationColor: "white",
                  textDecorationLine: "underline",
                  width: "100%",
                  textAlign: "right",
                  fontSize: 15,
                }}>
                See More {">"}
              </Text>
            </Link>
          </View>
          <View style={{ marginBottom: 20 }}>
            <PastReading />
            <PastReading />
            <PastReading />
            <PastReading />
            <PastReading />
            <PastReading />
            <PastReading />
            {/* <TouchableWrapper style={{ marginBottom: 10 }} onPress={() => {}}>
              <PastReading />
            </TouchableWrapper> */}
            <View>
              <TouchableOpacity style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: "white",
                    textDecorationLine: "underline",
                    backgroundColor: "#222d5b",
                    width: 100,
                    height: 30,
                    padding: 5,
                    textAlign: "center",
                    borderRadius: 5,
                  }}>
                  More..
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  readingsContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 8,
    paddingBottom: 30,
  },
  readingRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 8,
  },
  upperView: {
    height: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  newSectionTitle: {
    fontSize: 30,
    color: Colors.text,
  },
});

/*

<ScrollView
      style={{
        padding: 10,
      }}>
      <View>
        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
            fontStyle: "italic",
          }}>
          Welcome Back
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

*/
