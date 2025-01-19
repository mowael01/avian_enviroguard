import { Colors } from "@/constants/Colors";
import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { supabase } from ".";
import { useEffect, useState } from "react";
import PastReading from "@/components/PastReading";
import {
  getLight,
  getSoundCategory,
  formatDate,
  getDateRangeFromUserInput,
} from "@/functions/utils";

export default function History() {
  const [counter, setCounter] = useState(10);
  const [startDate, setStartDate] = useState(new Date("2000-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [dayData, setDayData] = useState(
    Array.from({ length: 10 }, () => ({
      id: 0,
      hour: "0",
      temperature: 0,
      humidity: 0,
      NH3: 0,
      soundFrequency: 0,
      soundPower: 0,
      light: 0,
    }))
  );

  // getting the data from the database
  useEffect(() => {
    const getData = async () => {
      const { data, error }: any = await supabase
        .from("dayData")
        .select()
        .gte("hour", startDate.toISOString())
        .lt("hour", endDate.toISOString())
        .order("hour", { ascending: false })
        .limit(counter);
      // console.log(data);
      setDayData(data);
    };

    getData();
  }, [counter]);

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitleText}>History</Text>
      <View style={styles.searchContainer}>
        <TextInput
          onChangeText={(text) => {
            console.log(text);
            if (text.length == 0) {
              setStartDate(new Date("2000-01-01"));
              setEndDate(new Date());
            }
            const range = getDateRangeFromUserInput(text);
            if (range) {
              console.log("Start Date: ", range.startDate);
              console.log("End Date: ", range.endDate);

              setStartDate(range.startDate);
              setEndDate(range.endDate);
            }
          }}
          style={{ flex: 1 }}
          placeholder="Search"
        />
        <TouchableOpacity
          onPress={() => {
            const getData = async () => {
              const { data, error }: any = await supabase
                .from("dayData")
                .select()
                .gte("hour", startDate.toISOString())
                .lt("hour", endDate.toISOString())
                .order("hour", { ascending: false })
                .limit(counter);
              // console.log(data);
              setDayData(data);
            };

            getData();
          }}>
          <Text style={styles.searchButton}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.dataViewContianer}>
        <View style={{ marginBottom: 20 }}>
          {dayData.map((value, index) => (
            <PastReading
              key={index}
              temperature={value.temperature}
              humidity={value.humidity}
              NH3={value.NH3}
              sound={getSoundCategory(value.soundPower, value.soundFrequency)}
              light={getLight(value.light)}
              safe={true}
              date={formatDate(new Date(value.hour || 0))}
            />
          ))}
          <View>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                setCounter(counter + 10);
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainTitleText: {
    color: "white",
    fontSize: 30,
    paddingHorizontal: 10,
    // marginHorizontal: 10,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  searchContainer: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    paddingLeft: 10,
    flexDirection: "row",
    marginHorizontal: 10,
  },
  searchButton: {
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    color: "white",
  },
  dataViewContianer: {},
});
