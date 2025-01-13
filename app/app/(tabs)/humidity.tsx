import { Styles } from "@/constants/Styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { type SharedValue, useDerivedValue } from "react-native-reanimated";

import {
  CartesianChart,
  type ChartBounds,
  type PointsArray,
  useAreaPath,
  useChartPressState,
  useLinePath,
} from "victory-native";
import {
  Circle,
  Group,
  Line as SkiaLine,
  LinearGradient,
  Path,
  Text as SkiaText,
  useFont,
  vec,
  AnimatedProp,
} from "@shopify/react-native-skia";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import React from "react";

import { supabase } from ".";

const analyzeHumidity = (humidity: number) => {
  if (humidity < 40) {
    return "Humidity is too low. This can cause respiratory irritation and increase dust levels.";
  } else if (humidity >= 40 && humidity <= 60) {
    return "Humidity is in the ideal range, providing a comfortable environment for poultry.";
  } else if (humidity > 60 && humidity <= 70) {
    return "Humidity is slightly high. Increased ventilation can help prevent litter moisture buildup and ammonia formation.";
  } else {
    return "Humidity is too high. Excess moisture can promote bacterial growth, ammonia production, and respiratory issues.";
  }
};

export default function Humidity() {
  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 15);
  const { state: firstTouch, isActive: isFirstPressActive } =
    useChartPressState({
      x: 0,
      y: { y: 0 },
    });
  const unit = "%";
  const [activeBtn, setActiveBtn] = useState("now");

  // Variables to store the fetched data
  const [nowData, setNowData] = useState(
    Array.from({ length: 10 }, () => ({
      id: 0,
      created_at: "0",
      temperature: 0,
      humidity: 0,
      NH3: 0,
      soundFrequency: 0,
      soundPower: 0,
      light: 0,
    }))
  );
  const [dayData, setDayData] = useState(
    Array.from({ length: 10 }, () => ({
      id: 0,
      created_at: "0",
      temperature: 0,
      humidity: 0,
      NH3: 0,
      soundFrequency: 0,
      soundPower: 0,
      light: 0,
    }))
  );
  const [weekData, setWeekData] = useState(
    Array.from({ length: 10 }, () => ({
      id: 0,
      created_at: "0",
      temperature: 0,
      humidity: 0,
      NH3: 0,
      soundFrequency: 0,
      soundPower: 0,
      light: 0,
    }))
  );
  const [graphData, setGraphData] = useState([
    { x: 0, y: 1 }, //0
    { x: 1, y: 1 }, //1
    { x: 2, y: 1 }, //2
    { x: 3, y: 1 }, //3
    { x: 4, y: 1 }, //4
    { x: 5, y: 1 }, //5
    { x: 6, y: 1 }, //0
    { x: 7, y: 1 }, //1
    { x: 8, y: 1 }, //2
    { x: 9, y: 1 }, //3
  ]);
  const [graphDomain, setGraphDomain] = useState({
    y: [0, 100],
    x: [0, 10],
  });
  const [graphTickCount, setGraphTickCount] = useState({ x: 10, y: 10 });

  // listening for the changes in the supabase database
  useEffect(() => {
    const subscription = supabase
      .channel("nowData") // name your channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "nowData" },
        (payload) => {
          const getData = async () => {
            const { data, error }: any = await supabase
              .from("nowData")
              .select()
              .order("created_at", { ascending: false })
              .limit(10);
            data.reverse();
            // console.log("nowData",data);
            setNowData(await data);
            // console.log("activeBtn", activeBtn == "now");
            if (activeBtn == "now") {
              const newGraphData = data.map((ele, index) => {
                return { x: index, y: ele.humidity };
              });
              // console.log("newGraphData", newGraphData);

              setGraphData(newGraphData);
            }
          };
          getData();
        }
      )
      .subscribe();

    // Clean up the subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  useEffect(() => {
    const subscription = supabase
      .channel("dayData") // name your channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dayData" },
        (payload) => {
          const getData = async () => {
            const { data, error }: any = await supabase
              .from("dayData")
              .select()
              .order("hour", { ascending: false })
              .limit(10);
            data.reverse();

            // console.log("dayData",data);
            setDayData(data);
            if (activeBtn == "day") {
              const newGraphData = dayData.map((ele, index) => {
                return { x: index, y: ele.humidity };
              });
              setGraphData(newGraphData);
            }
          };
          getData();
        }
      )
      .subscribe();

    // Clean up the subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  useEffect(() => {
    const subscription = supabase
      .channel("weekData") // name your channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "weekData" },
        (payload) => {
          const getData = async () => {
            const { data, error }: any = await supabase
              .from("weekData")
              .select()
              .order("day", { ascending: false })
              .limit(10);
            data.reverse();

            // console.log("weekData",data);
            setWeekData(data);
            if (activeBtn == "week") {
              const newGraphData = weekData.map((ele, index) => {
                return { x: index, y: ele.humidity };
              });
              setGraphData(newGraphData);
            }
          };
          getData();
        }
      )
      .subscribe();

    // Clean up the subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("nowData")
        .select()
        .order("created_at", { ascending: false })
        .limit(10);
      // console.log(data);
      setNowData(data);
      setActiveBtn("now");
      const newGraphData = data.map((ele, index) => {
        return { x: index, y: ele.humidity };
      });
      setGraphData(newGraphData);
      setGraphDomain({ y: [0, 100], x: [0, 10] });
      setGraphTickCount({ x: 10, y: 10 });
    };

    getData();
  }, []);
  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("dayData")
        .select()
        .order("hour", { ascending: false })
        .limit(10);
      console.log("dayData", data);
      data.reverse();
      setDayData(data);
    };
    getData();
  }, []);
  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("weekData")
        .select()
        .order("day", { ascending: false })
        .limit(10);
      // console.log(data);
      setWeekData(data);
    };
    getData();
  }, []);

  return (
    <SafeAreaView style={[styles.scrollView]}>
      <Text
        style={{
          color: "white",
          fontSize: 30,
          paddingHorizontal: 10,
        }}>
        Humidity
      </Text>
      <View style={{ flex: 2, maxHeight: 250, marginBottom: 20, padding: 10 }}>
        <CartesianChart
          data={graphData}
          // @ts-ignore
          domain={graphDomain}
          xKey="x"
          yKeys={["y"]}
          chartPressState={[firstTouch]}
          axisOptions={{
            font,
            tickCount: graphTickCount,
            labelColor: "white",
            lineColor: "#d4d4d8",
            formatXLabel(label) {
              // const minutes = ((+label % 1) * 60).toFixed(0);
              // const formattedMinutes = minutes.toString().padStart(2, "0");
              // const formattedHour = Math.floor(+label)
              //   .toString()
              //   .padStart(2, "0");

              // return activeBtn === "day"
              //   ? `${formattedHour}:${formattedMinutes}`
              //   : activeBtn === "now"
              //   ? ""
              //   : label.toString();
              return label.toString();
            },
            formatYLabel(label) {
              return `${label + unit}`;
            },
            // labelColor: "red",
          }}
          renderOutside={({ chartBounds }) => (
            <>
              {isFirstPressActive ? (
                <ActiveValueIndicator
                  xPosition={firstTouch.x.position}
                  yPosition={firstTouch.y.y.position}
                  bottom={chartBounds.bottom}
                  top={chartBounds.top}
                  activeValueY={firstTouch.y.y.value}
                  valueX={firstTouch.x}
                  textColor={"red"}
                  lineColor={"#F0ED00"}
                  // @ts-ignore
                  indicatorColor={"#F0ED00"}
                />
              ) : (
                ""
              )}
            </>
          )}>
          {({ chartBounds, points }) => (
            <>
              <CustomArea
                color="#0005DB"
                points={points.y}
                startX={firstTouch.x.position}
                {...chartBounds}
              />
            </>
          )}
        </CartesianChart>
      </View>
      <Text
        style={{
          color: "white",
          fontSize: 20,
          textAlign: "center",
          marginTop: -30,
          marginBottom: 20,
        }}>
        Latest 10 readings
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => {
            setActiveBtn("now");
            const newGraphData = nowData.map((ele, index) => {
              return { x: index, y: ele.humidity };
            });
            setGraphData(newGraphData);
            setGraphDomain({ y: [0, 100], x: [0, 10] });
            setGraphTickCount({ x: 5, y: 10 });
          }}
          style={[
            styles.buttonElement,
            { backgroundColor: activeBtn === "now" ? "#155694" : "white" },
          ]}>
          <Text style={{ color: activeBtn === "now" ? "white" : "black" }}>
            now
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveBtn("day");
            const newGraphData = dayData.map((ele, index) => {
              return { x: index, y: ele.humidity };
            });
            setGraphData(newGraphData);
            setGraphDomain({ y: [0, 100], x: [0, 10] });
            setGraphTickCount({ x: 10, y: 10 });
          }}
          style={[
            styles.buttonElement,
            { backgroundColor: activeBtn === "day" ? "#155694" : "white" },
          ]}>
          <Text style={{ color: activeBtn === "day" ? "white" : "black" }}>
            day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveBtn("week");
            const newGraphData = weekData.map((ele, index) => {
              return { x: index, y: ele.humidity };
            });
            setGraphData(newGraphData);
            setGraphDomain({
              y: [0, 100],
              x: [0, 10],
            });
            setGraphTickCount({ x: 10, y: 10 });
          }}
          style={[
            styles.buttonElement,
            { backgroundColor: activeBtn === "week" ? "#155694" : "white" },
          ]}>
          <Text style={{ color: activeBtn === "week" ? "white" : "black" }}>
            week
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.textDetail}>
          Avg Now Humidity:{" "}
          {(
            nowData.reduce((accumulator, current, index) => {
              if (index === 0) {
                return current.humidity;
              } else {
                return accumulator + current.humidity;
              }
            }, 0) / nowData.length
          ).toFixed(2) + unit}
          <Text>
            {"\n"}
            {analyzeHumidity(
              nowData.reduce((accumulator, current, index) => {
                if (index === 0) {
                  return current.humidity;
                } else {
                  return accumulator + current.humidity;
                }
              }, 0) / nowData.length
            )}
          </Text>
        </Text>
        <Text style={styles.textDetail}>
          Avg Day Humidity:{" "}
          {(
            dayData.reduce((accumulator, current, index) => {
              if (index === 0) {
                return current.humidity;
              } else {
                return accumulator + current.humidity;
              }
            }, 0) / dayData.length
          ).toFixed(2) + unit}
        </Text>
        <Text style={styles.textDetail}>
          Maximum Day Humidity:{" "}
          {dayData
            .reduce((accumulator, current) => {
              if (current.humidity > accumulator) {
                return current.humidity;
              } else {
                return accumulator;
              }
            }, 0)
            .toFixed(2) + unit}
        </Text>
        <Text style={styles.textDetail}>
          Minimum Day Humidity:{" "}
          {dayData
            .reduce((accumulator, current) => {
              if (current.humidity < accumulator) {
                return current.humidity;
              } else {
                return accumulator;
              }
            }, 100)
            .toFixed(2) + unit}
        </Text>
        <Text style={styles.textDetail}>
          Avg Week Humidity:{" "}
          {(
            weekData.reduce((accumulator, current, index) => {
              if (index === 0) {
                return current.humidity;
              } else {
                return accumulator + current.humidity;
              }
            }, 0) / weekData.length
          ).toFixed(2) + unit}
        </Text>
        <Text style={styles.textDetail}>
          Maximum Week Humidity:{" "}
          {weekData
            .reduce((accumulator, current) => {
              if (current.humidity > accumulator) {
                return current.humidity;
              } else {
                return accumulator;
              }
            }, 0)
            .toFixed(2) + unit}
        </Text>
        <Text style={styles.textDetail}>
          Minimum Week Humidity:{" "}
          {weekData
            .reduce((accumulator, current) => {
              if (current.humidity < accumulator) {
                return current.humidity;
              } else {
                return accumulator;
              }
            }, 100)
            .toFixed(2) + unit}
        </Text>
      </View>
    </SafeAreaView>
  );
}

/**
 * Show the line/area chart for the stock price, taking into account press state.
 */
const CustomArea = ({
  points,
  top,
  bottom,
  color,
}: {
  color: AnimatedProp<String>;
  points: PointsArray;
  startX: SharedValue<number>;
} & ChartBounds) => {
  const { path: areaPath } = useAreaPath(points, bottom, {
    curveType: "natural",
  });
  const { path: linePath } = useLinePath(points, { curveType: "natural" });

  return (
    <>
      {/* Base */}
      <Group>
        <Path path={areaPath} style="fill">
          <LinearGradient
            start={vec(0, 0)}
            end={vec(top, bottom)}
            // @ts-ignore
            colors={[color, color + "33"]}
          />
        </Path>
        <Path
          path={linePath}
          style="stroke"
          strokeWidth={2}
          // @ts-ignore
          color={color}
        />
      </Group>
    </>
  );
};

const ActiveValueIndicator = ({
  xPosition,
  yPosition,
  zPosition,
  top,
  bottom,
  valueX,
  activeValueY,
  activeValueZ,
  textColor,
  lineColor,
  indicatorColor,
  topOffset = 0,
}: {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  zPosition: SharedValue<number>;
  valueX: any;
  activeValueY: SharedValue<number>;
  activeValueZ: SharedValue<number>;
  bottom: number;
  top: number;
  textColor: string;
  lineColor: string;
  indicatorColor: SharedValue<string>;
  topOffset?: number;
}) => {
  const FONT_SIZE = 16;
  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 12);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + 1.5 * FONT_SIZE + topOffset)
  );

  // Text label
  const activeValueDisplay = useDerivedValue(
    () => `${activeValueY.value.toFixed(2)}C`
  );
  const activeValueWidth = useDerivedValue(
    () => font?.getTextWidth(activeValueDisplay.value) || 0
  );

  const activeValueX = useDerivedValue(
    () => xPosition.value - activeValueWidth.value / 2
  );

  return (
    <>
      <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1} />
      <Circle cx={xPosition} cy={yPosition} r={6} color={indicatorColor} />
      <Circle
        cx={xPosition}
        cy={yPosition}
        r={4}
        color="hsla(0, 0, 100%, 0.25)"
      />
      <Circle cx={xPosition} cy={zPosition} r={6} color={indicatorColor} />
      <Circle
        cx={xPosition}
        cy={zPosition}
        r={4}
        color="hsla(0, 0, 100%, 0.25)"
      />
      <SkiaText
        color={textColor}
        font={font}
        text={activeValueDisplay}
        x={65}
        y={top + FONT_SIZE + topOffset}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  buttons: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  buttonElement: {
    width: 100,
    height: 30,
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#312BE0",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonElementText: {
    color: "white",
  },
  textDetail: {
    color: "white",
    fontSize: 15,
    padding: 10,
    borderBottomColor: "white",
    borderBottomWidth: 0.25,
  },
});
