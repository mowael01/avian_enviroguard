import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

import { Styles } from "@/constants/Styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReadingBox from "@/components/ReadingBox";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import PastReading from "@/components/PastReading";
import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";
import { analyzeEnvironmentalConditions } from "@/functions/environmentAnalyzation";
import Notes from "@/components/notes";
import { getLight, getSoundCategory, formatDate } from "@/functions/utils";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const supabase = createClient(
  "https://plrcyvdofiqbtdezzdnl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscmN5dmRvZmlxYnRkZXp6ZG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NzM0MDUsImV4cCI6MjA0NzI0OTQwNX0.X2Fs_Q4EzPj-b5PTm0_DtrTtxTupJMottl-o85IeVc8"
);

export default function Index() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    // @ts-expect-error
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    // @ts-expect-error
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // variable to manage the number of records to get from the database
  const [dataCounter, setDataCounter] = useState<number>(10);

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
      light: false,
    }))
  );
  const [dayData, setDayData] = useState(
    Array.from({ length: 10 }, () => ({
      id: 0,
      hour: "0",
      temperature: 0,
      humidity: 0,
      NH3: 0,
      soundFrequency: 0,
      soundPower: 0,
      light: false,
    }))
  );
  const [weekData, setWeekData] = useState(
    Array.from({ length: 10 }, () => ({
      id: 0,
      day: "0",
      temperature: 0,
      humidity: 0,
      NH3: 0,
      soundFrequency: 0,
      soundPower: 0,
      light: 0,
    }))
  );
  const [settings, setSettings] = useState({
    maxNH3: 0,
    maxTemperature: 0,
    maxHumidity: 0,
    maxSoundPower: 0,
    maxSoundFrequency: 0,
    minTemperature: 0,
    minHumidity: 0,
  });

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
              .limit(dataCounter);
            console.log(data);
            setNowData(data);

            if (settings.maxTemperature == 0) return;

            if (data.at(0)?.temperature >= settings.maxTemperature) {
              schedulePushNotification(
                "High Temperature Alert",
                `The temperature is ${nowData.at(0)?.temperature} °C`
              );
            }
            if (data.at(0)?.humidity >= settings.maxHumidity) {
              schedulePushNotification(
                "High Humidity Alert",
                `The humidity is ${data.at(0)?.humidity} %`
              );
            }
            if (data.at(0)?.NH3 >= settings.maxNH3) {
              schedulePushNotification(
                "High Ammonia Gas Alert",
                `The NH3 is ${data.at(0)?.NH3} ppm`
              );
            }
            if (data.at(0)?.soundPower >= settings.maxSoundPower) {
              schedulePushNotification("Noise Alert", `Noise Detected`);
            }
            if (data.at(0)?.soundFrequency >= settings.maxSoundFrequency) {
              schedulePushNotification("Noise Alert", `Noise Detected`);
            }
            if (data.at(0)?.temperature <= settings.minTemperature) {
              schedulePushNotification(
                "Low Temperature Alert",
                `The temperature is ${data.at(0)?.temperature} °C`
              );
            }
            if (data.at(0)?.humidity <= settings.minHumidity) {
              schedulePushNotification(
                "Low Humidity Alert",
                `The humidity is ${data.at(0)?.humidity} %`
              );
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
  }, [settings]);
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
              .order("created_at", { ascending: false })
              .limit(dataCounter);
            console.log(data);
            setDayData(data);
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
      .channel("weekData")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "weekData" },
        (payload) => {
          const getData = async () => {
            const { data, error }: any = await supabase
              .from("weekData")
              .select()
              .order("created_at", { ascending: false })
              .limit(dataCounter);
            console.log(data);
            setWeekData(data);
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

  // getting the readings for the first time of the app
  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("nowData")
        .select()
        .order("created_at", { ascending: false })
        .limit(dataCounter);
      console.log("now Data:" + JSON.stringify(data));
      setNowData(data);
      if (data.at(0)?.temperature >= settings.maxTemperature) {
        schedulePushNotification(
          "High Temperature Alert",
          `The temperature is ${nowData.at(0)?.temperature} °C`
        );
      }
      if (data.at(0)?.humidity >= settings.maxHumidity) {
        schedulePushNotification(
          "High Humidity Alert",
          `The humidity is ${nowData.at(0)?.humidity} %`
        );
      }
      if (data.at(0)?.NH3 >= settings.maxNH3) {
        schedulePushNotification(
          "High Ammonia Gas Alert",
          `The NH3 is ${nowData.at(0)?.NH3} ppm`
        );
      }
      if (data.at(0)?.soundPower >= settings.maxSoundPower) {
        schedulePushNotification("Noise Alert", `Noise Detected`);
      }
      if (data.at(0)?.soundFrequency >= settings.maxSoundFrequency) {
        schedulePushNotification("Noise Alert", `Noise Detected`);
      }
      if (data.at(0)?.temperature <= settings.minTemperature) {
        schedulePushNotification(
          "Low Temperature Alert",
          `The temperature is ${nowData.at(0)?.temperature} °C`
        );
      }
      if (data.at(0)?.humidity <= settings.minHumidity) {
        schedulePushNotification(
          "Low Humidity Alert",
          `The humidity is ${nowData.at(0)?.humidity} %`
        );
      }
      console.log(
        "Analyzation results",
        analyzeEnvironmentalConditions(20, 50, 10, "on", 1, 100)
      );
    };
    getData();
  }, []);
  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("dayData")
        .select()
        .order("hour", { ascending: false })
        .limit(dataCounter);
      console.log("Day Data:" + JSON.stringify(data));
      // setDayData(
      //   Array.from({ length: dataCounter }, () => ({
      //     id: 0,
      //     created_at: "0",
      //     temperature: 0,
      //     humidity: 0,
      //     NH3: 0,
      //     soundFrequency: 0,
      //     soundPower: 0,
      //     light: 0,
      //   }))
      // );
      setDayData(data);
    };
    getData();
  }, [dataCounter]);
  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("weekData")
        .select()
        .order("day", { ascending: false })
        .limit(dataCounter);
      console.log("week data:" + data);
      setWeekData(data);
    };
    getData();
  }, []);

  // getting the settings from the database
  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("settings")
        .select()
        .limit(1);
      console.log("settings", data);
      setSettings({
        maxNH3: await data.at(0).NH3_threshold,
        maxTemperature: await data.at(0).temperature_max_threshold,
        maxHumidity: await data.at(0).humidity_max_threshold,
        maxSoundPower: await data.at(0).soundPower_threshold,
        maxSoundFrequency: await data.at(0).NH3_threshold,
        minTemperature: await data.at(0).temperature_min_threshold,
        minHumidity: await data.at(0).humidity_min_threshold,
      });
    };
    +getData();
  }, []);

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
          {/* the upper view that contains the icons */}
          <View style={styles.upperView}>
            {/* notification icon */}
            <Link href={"/(tabs)/notifications"}>
              <Ionicons name="notifications" size={30} color="white" />
            </Link>
            {/* user icon */}
            <Ionicons name="person" size={30} color="white" />
          </View>
          {/* the View that contains the readings */}
          <View style={styles.readingsContainer}>
            <View style={styles.readingRow}>
              <ReadingBox
                label="Temperature"
                value={nowData.at(0)?.temperature || 0}
                unit="°C"
                icon="thermometer"
                color="#fb6781"
                // boxStyle={{ width: "100%" }}
                destination="/(tabs)/temperature"
              />
              <ReadingBox
                label="Light"
                value={getLight(nowData.at(0)?.light ?? false)}
                unit=""
                icon="sunny"
                destination="/(tabs)/gas"
                color="#f1c40f"
              />
            </View>

            <View style={styles.readingRow}>
              <ReadingBox
                label="Humidity"
                value={nowData.at(0)?.humidity || 0}
                unit="%"
                icon="water"
                color="#65bef8"
                destination="/(tabs)/humidity"
              />

              <ReadingBox
                label="Ammonia"
                value={nowData.at(0)?.NH3 || 0}
                unit="ppm"
                icon="flame"
                color="#44d586"
                destination="/(tabs)/gas"
              />
            </View>

            <View style={styles.readingRow}>
              <ReadingBox
                label="Noise"
                value={getSoundCategory(
                  nowData.at(0)?.soundPower ?? 0,
                  nowData.at(0)?.soundFrequency ?? 0
                )}
                unit=""
                icon="mic"
                color="#825af8"
                destination="/(tabs)"
              />
              <ReadingBox
                label="Sound Tone"
                value={nowData.at(0)?.soundFrequency || 0}
                unit="Hz"
                icon="mic"
                destination="/"
                color="#f1c40f"
              />
            </View>
          </View>
          <View>
            <Text style={styles.newSectionTitle}>Notes:</Text>
            <Notes
              data={{
                temperature: dayData.at(0)?.temperature || 0,
                humidity: dayData.at(0)?.humidity || 0,
                ammonia: dayData.at(0)?.NH3 || 0,
                light: getLight(dayData.at(0)?.light || false),
                soundPower: dayData.at(0)?.soundPower || 0,
                soundFrequency: dayData.at(0)?.soundFrequency || 0,
              }}
            />
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
            {dayData.map((value, index) => (
              <PastReading
                key={index}
                temperature={value.temperature}
                humidity={value.humidity}
                NH3={value.NH3}
                sound={getSoundCategory(value.soundPower, value.soundFrequency)}
                light={value.light == true ? "on" : "off"}
                safe={true}
                date={formatDate(new Date(value.hour || 0))}
              />
            ))}
            <View>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => {
                  setDataCounter(dataCounter + 10);
                }}>
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

async function schedulePushNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (true) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
