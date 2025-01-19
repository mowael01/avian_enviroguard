/**
 * Helper function to add disease information.
 */
export interface Disease {
  disease: string;
  symptoms: string;
  causes: string;
  diagnosticMethods: string;
  treatment: string;
  articleLink: string;
}

function addDisease(
  potentialDiseases: Disease[],
  disease: string,
  symptoms: string,
  causes: string,
  diagnosticMethods: string,
  treatment: string,
  articleLink: string
): void {
  potentialDiseases.push({
    disease,
    symptoms,
    causes,
    diagnosticMethods,
    treatment,
    articleLink,
  });
}

/**
 * Analyzes temperature and provides recommendations.
 */

interface Recommendation {
  message: string;
}

export function analyzeTemperature(
  temperature: number,
  potentialDiseases: Disease[],
  recommendations: string[]
): void {
  if (temperature < 25 || temperature > 30) {
    recommendations.push(
      `Temperature is outside the ideal range (25-30°C). Current temperature: ${temperature}°C.`
    );
    if (temperature < 25) {
      recommendations.push(
        "Low temperatures can lead to hypothermia. Provide a heat source."
      );
      addDisease(
        potentialDiseases,
        "Hypothermia",
        "Shivering, lethargy, fluffed feathers, cold feet",
        "Exposure to cold temperatures, inadequate heating.",
        "Physical examination, checking body temperature.",
        "Provide a heat source immediately. Consult a veterinarian if the bird doesn't improve.",
        "https://www.petmd.com/bird/conditions/cardiovascular/c_bd_hypothermia"
      );
    } else {
      recommendations.push(
        "High temperatures can cause heat stress. Ensure adequate ventilation and fresh water."
      );
      addDisease(
        potentialDiseases,
        "Heat Stress",
        "Panting, wing drooping, lethargy, open-mouth breathing",
        "High environmental temperatures, lack of shade or ventilation.",
        "Physical examination, observing symptoms.",
        "Move the bird to a cooler area, provide fresh water, and mist with cool water. Consult a veterinarian if severe.",
        "https://vcahospitals.com/know-your-pet/birds-heat-stress"
      );
    }
    addDisease(
      potentialDiseases,
      "Respiratory infections",
      "Difficulty breathing, sneezing, nasal discharge",
      "Bacterial, viral, or fungal infections, poor ventilation, stress.",
      "Physical examination, blood tests, cultures, X-rays.",
      "Consult a veterinarian.",
      "https://www.avianwelfare.org/avian-medicine/respiratory-disease-in-birds/"
    );
  }
}

/**
 * Analyzes humidity and provides recommendations.
 */

export function analyzeHumidity(
  humidity: number,
  potentialDiseases: Disease[],
  recommendations: string[]
): void {
  if (humidity < 40 || humidity > 70) {
    recommendations.push(
      `Humidity is outside the ideal range (40-70%). Current humidity: ${humidity}%.`
    );
    if (humidity < 40) {
      recommendations.push(
        "Low humidity can cause dry skin and respiratory irritation. Use a humidifier."
      );
      addDisease(
        potentialDiseases,
        "Dry Skin/Feather Problems",
        "Dry, flaky skin, itchy skin, feather plucking",
        "Low humidity, nutritional deficiencies.",
        "Physical examination, feather and skin analysis.",
        "Increase humidity, provide bathing opportunities, consult a veterinarian if severe.",
        "https://www.beautyofbirds.com/featherplucking.html"
      );
    } else {
      recommendations.push(
        "High humidity can promote bacterial and fungal growth. Ensure good ventilation and clean the cage regularly."
      );
      addDisease(
        potentialDiseases,
        "Bacterial Infections",
        "Lethargy, ruffled feathers, changes in droppings",
        "Bacterial infections, poor hygiene, high humidity.",
        "Physical examination, cultures, blood tests.",
        "Antibiotics prescribed by a veterinarian.",
        "https://www.msdvetmanual.com/exotic-and-laboratory-animals/birds/bacterial-diseases-of-birds"
      );
    }
    addDisease(
      potentialDiseases,
      "Aspergillosis (fungal infection)",
      "Lethargy, difficulty breathing, loss of appetite",
      "Fungal spores in the environment, weakened immune system, high humidity.",
      "Physical examination, X-rays, cultures.",
      "Antifungal medication (veterinarian prescribed).",
      "https://www.vin.com/doc/?id=4952549"
    );
  }
}

/**
 * Analyzes ammonia levels and provides recommendations.
 */

export function analyzeAmmonia(
  ammonia: number,
  potentialDiseases: Disease[],
  recommendations: string[]
): void {
  if (ammonia > 15) {
    recommendations.push(
      `Ammonia levels are high (${ammonia} ppm). This is extremely harmful. Improve ventilation and clean the cage.`
    );
    addDisease(
      potentialDiseases,
      "Ammonia burn",
      "Redness and irritation of eyes and respiratory tract",
      "High ammonia concentrations in the environment due to poor cage hygiene.",
      "Physical examination.",
      "Immediate ventilation and removal of ammonia source. Consult a veterinarian.",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7121669/"
    );
    addDisease(
      potentialDiseases,
      "Conjunctivitis",
      "Red, swollen, or watery eyes",
      "Bacterial or viral infections, irritants like ammonia.",
      "Physical examination, cultures.",
      "Veterinary-prescribed eye drops.",
      "https://www.petcoach.co/condition/conjunctivitis-in-birds/"
    );
    addDisease(
      potentialDiseases,
      "Tracheitis",
      "Inflammation of the trachea, causing coughing and difficulty breathing",
      "Bacterial or viral infections, irritants like ammonia.",
      "Physical examination, tracheal swab.",
      "Veterinary care, possibly antibiotics.",
      "https://www.msdvetmanual.com/exotic-and-laboratory-animals/birds/respiratory-system-of-birds"
    );
    addDisease(
      potentialDiseases,
      "Pneumonia",
      "Inflammation of the lungs, causing severe respiratory distress",
      "Bacterial, viral, or fungal infections, often secondary to other respiratory problems or weakened immune system due to ammonia.",
      "Physical examination, X-rays, blood tests.",
      "Requires immediate veterinary attention, often involving antibiotics.",
      "https://www.avianwelfare.org/avian-medicine/respiratory-disease-in-birds/"
    );
    addDisease(
      potentialDiseases,
      "Reduced immune function",
      "Increased susceptibility to other infections",
      "Chronic exposure to ammonia, stress, poor nutrition.",
      "Blood tests, physical examination.",
      "Improve environmental conditions and provide proper nutrition. Consult a veterinarian.",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4311195/"
    );
  }
}

/**
 * Analyzes light conditions and provides recommendations.
 */

function analyzeLight(
  light: string,
  isNight: boolean,
  potentialDiseases: Disease[],
  recommendations: string[]
): void {
  if (light === "on" && isNight) {
    recommendations.push(
      "It is nighttime, and the light is on. Birds need a regular day/night cycle. Turn off the lights."
    );
    addDisease(
      potentialDiseases,
      "Sleep Deprivation/Stress",
      "Behavioral changes, weakened immune system",
      "Artificial light at night disrupts natural sleep patterns.",
      "Observing behavior, physical examination.",
      "Establish a consistent day/night cycle.",
      "https://lafeber.com/pet-birds/stress-in-pet-birds/"
    );
  } else if (light === "off" && !isNight) {
    recommendations.push(
      "It is daytime, and the light is off. Birds need a regular day/night cycle. Turn on the lights."
    );
    addDisease(
      potentialDiseases,
      "Vitamin D Deficiency",
      "Lethargy, weakness, bone problems",
      "Insufficient exposure to UVB light, inadequate diet.",
      "Blood tests, X-rays.",
      "Provide full-spectrum lighting and appropriate diet.",
      "https://vcahospitals.com/know-your-pet/birds-vitamin-d-deficiency"
    );
  }
}

/**
 * Analyzes bird vocalizations (sound power and frequency).
 */

function analyzeSound(
  soundPower: number,
  soundFrequency: number,
  isNight: boolean,
  temperature: number,
  humidity: number,
  ammonia: number,
  potentialDiseases: Disease[],
  recommendations: string[]
) {
  const soundThreshold = isNight ? 1.5 : 2;
  const quietThreshold = isNight ? 0.5 : 1;

  if (soundPower > 0) {
    // recommendations.push("Detected unusual vocalizations.");

    if (soundPower > soundThreshold) {
      recommendations.push(
        `Vocalizations are unusually loud (Sound Power: ${soundPower}). This could indicate distress, fear, or excitement. Observe the bird's other behaviors.`
      );
      if (temperature > 30) {
        recommendations.push(
          "The combination of high temperature and loud vocalizations strongly suggests heat stress. Take immediate steps to cool the bird down."
        );
      }
      addDisease(
        potentialDiseases,
        "Distress/Fear",
        "Loud, repetitive calls, frantic movements, attempts to escape",
        "Fear, stress, pain, environmental changes.",
        "Observing behavior, physical examination.",
        "Identify and remove the source of distress. Provide a calm and safe environment.",
        "https://lafeber.com/pet-birds/stress-in-pet-birds/"
      );
    } else if (soundPower < quietThreshold && !isNight) {
      recommendations.push(
        `Vocalizations are unusually quiet (Sound Power: ${soundPower}). This could indicate illness or lethargy. Observe the bird's other behaviors.`
      );
      if (temperature < 18 || humidity > 70 || ammonia > 20) {
        recommendations.push(
          "The combination of quiet vocalizations with suboptimal temperature, humidity, or ammonia levels suggests a potential health issue. Consult a veterinarian."
        );
      }
      addDisease(
        potentialDiseases,
        "Lethargy/Illness",
        "Decreased activity, fluffed feathers, loss of appetite",
        "Illness, pain, depression.",
        "Physical examination, blood tests, other diagnostic tests as needed.",
        "Monitor closely and consult a veterinarian if other symptoms are present.",
        "https://www.petmd.com/bird/symptoms/general/signs-your-bird-sick"
      );
    }

    if (soundFrequency > 5000) {
      recommendations.push(
        "Detected high-frequency vocalizations. These can sometimes be associated with distress calls."
      );
    }
  } else if (!isNight) {
    // Check for silence only during the day
    recommendations.push(
      "Bird is unusually quiet. This could indicate illness or lethargy. Observe the bird's other behaviors."
    );
    if (temperature < 18 || humidity > 70 || ammonia > 20) {
      recommendations.push(
        "The combination of quiet vocalizations with suboptimal temperature, humidity, or ammonia levels suggests a potential health issue. Consult a veterinarian."
      );
    }
    addDisease(
      potentialDiseases,
      "Lethargy/Illness",
      "Decreased activity, fluffed feathers, loss of appetite",
      "Illness, pain, depression.",
      "Physical examination, blood tests, other diagnostic tests as needed.",
      "Monitor closely and consult a veterinarian if other symptoms are present.",
      "https://www.petmd.com/bird/symptoms/general/signs-your-bird-sick"
    );
  }
}

/**
 * Main function to analyze all environmental conditions.
 */

export interface AnalysisResult {
  recommendations: string[];
  potentialDiseases: Disease[];
}

export function analyzeEnvironmentalConditions(
  temperature: number,
  humidity: number,
  ammonia: number,
  light: string,
  soundPower: number,
  soundFrequency: number
): AnalysisResult {
  let recommendations: string[] = [];
  let potentialDiseases: Disease[] = [];
  let conditionsAreAcceptable = true;

  const now = new Date();
  const currentHour = now.getHours();
  const isNight = currentHour < 6 || currentHour > 19;

  analyzeTemperature(temperature, potentialDiseases, recommendations);

  analyzeHumidity(humidity, potentialDiseases, recommendations);
  analyzeAmmonia(ammonia, potentialDiseases, recommendations);
  analyzeLight(light, isNight, potentialDiseases, recommendations);
  analyzeSound(
    soundPower,
    soundFrequency,
    isNight,
    temperature,
    humidity,
    ammonia,
    potentialDiseases,
    recommendations
  );

  if (recommendations.length > 0) {
    conditionsAreAcceptable = false;
  }

  if (conditionsAreAcceptable) {
    recommendations.push(
      "Environmental conditions appear to be within acceptable ranges."
    );
  }

  return { recommendations, potentialDiseases };
}
