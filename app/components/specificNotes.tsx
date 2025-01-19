import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnalysisResult } from "@/functions/environmentAnalyzation";
import Collapsible from "./collabsible";
import OpenURLButton from "./openUrl";

const SpecificNotes = ({ results }: { results: AnalysisResult }) => {
  const conditions = results;

  return (
    <View style={styles.container}>
      {conditions.recommendations.length > 0 ? (
        <View>
          <Text style={styles.title}>Environmental Conditions</Text>
          <Text style={{ color: "white" }}>
            {conditions.recommendations.join(", ")}
          </Text>
          <Text style={styles.title}>Expected Diseases</Text>

          {conditions.potentialDiseases.map((disease, i) => (
            <Collapsible
              key={i}
              title={<Text>{disease.disease}</Text>}
              content={
                <View>
                  <Text>Symptoms: {disease.symptoms}</Text>
                  <Text>Causes: {disease.causes}</Text>
                  <Text>Dianosis: {disease.diagnosticMethods}</Text>
                  <Text>Treatment: {disease.treatment}</Text>
                  <OpenURLButton
                    url={disease.articleLink}
                    children={<Text>Read more</Text>}
                  />
                </View>
              }
            />
          ))}
        </View>
      ) : (
        <Text>All is ok!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#222d5b",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    // fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
});

export default SpecificNotes;
