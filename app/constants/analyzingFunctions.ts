// Analyze temperature
export const analyzeTemperature = (temperature: number) => {
  if (temperature < 20) {
    return "Temperature is too low. This can increase feed consumption, slow growth rates, and may cause stress to poultry.";
  } else if (temperature >= 20 && temperature <= 25) {
    return "Temperature is ideal for poultry. Optimal growth rates and feed efficiency are expected.";
  } else if (temperature > 25 && temperature <= 30) {
    return "Temperature is slightly high. Ensure proper ventilation to prevent mild heat stress.";
  } else {
    return "Temperature is dangerously high. Heat stress can reduce feed intake, growth, and egg production. Immediate cooling measures are essential.";
  }
};

// Analyze humidity
export const analyzeHumidity = (humidity: number) => {
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

// Analyze ammonia levels
export const analyzeAmmonia = (ammonia: number) => {
  if (ammonia < 10) {
    return "Ammonia levels are safe. Poultry health and performance are optimal.";
  } else if (ammonia >= 10 && ammonia <= 25) {
    return "Ammonia levels are moderately high. Prolonged exposure can reduce feed intake and growth performance. Increase ventilation.";
  } else if (ammonia > 25 && ammonia <= 50) {
    return "Ammonia levels are high. Growth rates, immune responses, and respiratory health are negatively affected.";
  } else {
    return "Ammonia levels are dangerously high. Immediate intervention is required to avoid severe health and performance issues.";
  }
};
