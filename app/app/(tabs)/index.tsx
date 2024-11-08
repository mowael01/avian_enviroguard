import { ScrollView, Text, View, StyleSheet } from "react-native";
import ReadingCircle from "@/components/ReadingCircle";
export default function Index() {
  return (
    <ScrollView
      contentContainerStyle={{
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <View>
        <View style={styles.general}>
          <ReadingCircle value="10C" label="Humidity" />
          <View>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              est tempora cupiditate magnam quaerat, beatae recusandae ipsam a?
            </Text>
          </View>
        </View>
        <View style={[styles.general, styles.contentLeft]}>
          <ReadingCircle value="10C" label="Humidity" />
          <View>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              est tempora cupiditate magnam quaerat, beatae recusandae ipsam a?
            </Text>
          </View>
        </View>
        <View style={styles.general}>
          <ReadingCircle value="10C" label="Humidity" />
          <View>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              est tempora cupiditate magnam quaerat, beatae recusandae ipsam a?
            </Text>
          </View>
        </View>
        <View style={[styles.general, styles.contentLeft]}>
          <ReadingCircle value="10C" label="Humidity" />
          <View>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              est tempora cupiditate magnam quaerat, beatae recusandae ipsam a?
            </Text>
          </View>
        </View>
        <View style={styles.general}>
          <ReadingCircle value="10C" label="Humidity" />
          <View>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              est tempora cupiditate magnam quaerat, beatae recusandae ipsam a?
            </Text>
          </View>
        </View>
        <View style={[styles.general, styles.contentLeft]}>
          <ReadingCircle value="10C" label="Humidity" />
          <View>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              est tempora cupiditate magnam quaerat, beatae recusandae ipsam a?
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentLeft: {
    flexDirection: "row-reverse",
  },
  contentRight: {},
  general: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
});
