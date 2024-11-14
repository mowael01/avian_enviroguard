import { View, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ReadingRow({
  lable,
  data,
  description,
  targetPage,
  unit,
  max = 100,
}: {
  lable: string;
  data: number;
  description: string;
  targetPage: string;
  max?: number;
  unit?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 20,
        paddingVertical: 30,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height: 200,
        marginBottom: 20,
        borderRadius: 15,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRightColor: "lightgray",
          borderRightWidth: 0.5,
          // backgroundColor: "red",
          paddingRight: 15,
        }}>
        <View
          style={{
            position: "absolute",
            top: -10,
            left: 0,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text
            style={{
              fontSize: 30,
            }}>
            {data}
            {unit ? unit : ""}
          </Text>
        </View>
        <View
          style={{
            transform: [{ rotate: "135deg" }],
          }}>
          <AnimatedCircularProgress
            size={140}
            width={15}
            fill={(+data / max) * 100}
            tintColor="#23c48e"
            onAnimationComplete={() => console.log("onAnimationComplete")}
            backgroundColor="#18171c"
            arcSweepAngle={270}
            lineCap="round"
          />
        </View>
      </View>
      <View
        style={{
          flex: 3,
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
        }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 0,
            textAlign: "left",
            width: "95%",
            marginTop: -15,
          }}>
          {lable}
        </Text>
        <Text
          style={{
            fontSize: 15,
            marginTop: 0,
            textAlign: "left",
            width: "95%",
          }}>
          {description}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          position: "absolute",
          bottom: 10,
          right: 10,
        }}>
        <Link
          // @ts-expect-error
          href={"/(tabs)/" + targetPage}>
          <Text
            style={{
              fontSize: 15,
              marginTop: 0,
              textAlign: "left",
              width: "95%",
              color: "blue",
              textDecorationLine: "underline",
              textDecorationStyle: "solid",
              textDecorationColor: "blue",
            }}>
            See more
          </Text>
        </Link>
        <Ionicons name="arrow-forward-sharp" size={15} color="blue" />
      </View>
    </View>
  );
}
