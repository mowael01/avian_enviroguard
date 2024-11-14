// ESP32 Code for capstone 2024 G12
// Made by group 21316 Mohammed W., Ziad E., Mostafa A. in Obour STEM School
// --------------- < Start Definitions > --------------- //

#include <Arduino.h>

// AM2320 sensor
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_AM2320.h>

// ZeroFFT to analyze sound
// #include <Adafruit_ZeroFFT.h>

// Wifi
#include <WiFi.h>

// MiCS Variables
#define MiCS 35

// setting PINs
#define LDR_PIN 15
#define Sound_PIN 34

// the LDR max value
#define LDR_Light 200

// setting up the AM2320 sensor
Adafruit_AM2320 am2320 = Adafruit_AM2320();

// Firebase Credentials

// Wifi-Credentials
#define WIFI_SSID "Etisalat 4G Router-2629" //  WiFi SSID
#define WIFI_PASSWORD "2vh2nr68"            //  WiFi password

// millis variable used for asynchronous code
unsigned long startMillis = millis(); // Start of sample window

// variables for the sound sensor
// Sound analysis parameters
const int sampleTime = 100;           // Time for measuring intensity (milliseconds)
const int frequencySampleTime = 1000; // Time for measuring frequency (milliseconds)

// Variables for measuring sound intensity
int peakToPeak = 0; // Peak-to-peak amplitude
// unsigned long startMillis; // Start time for sample window

// Variables for measuring frequency
unsigned long lastCrossingTime = 0; // Last zero-crossing time
int zeroCrossings = 0;              // Zero-crossing count within the sample window
float frequency = 0.0;              // Calculated frequency

// --------------- < End Definitions > --------------- //
// --------------- < Start Functions > --------------- //

void measureSoundIntensity()
{
  // Reset measurement variables
  int signalMax = 0;
  int signalMin = 4095; // 12-bit ADC max value

  startMillis = millis();
  while (millis() - startMillis < sampleTime)
  {
    int reading = analogRead(Sound_PIN);

    // Update peak-to-peak values
    if (reading > signalMax)
    {
      signalMax = reading;
    }
    if (reading < signalMin)
    {
      signalMin = reading;
    }
  }

  peakToPeak = signalMax - signalMin;            // Calculate peak-to-peak amplitude
  float intensity = peakToPeak * (3.3 / 4095.0); // Convert to volts
  Serial.print("Sound Intensity: ");
  Serial.print(intensity, 2);
  Serial.println(" V");
}

void measureSoundFrequency()
{
  int lastReading = analogRead(Sound_PIN);
  zeroCrossings = 0;
  startMillis = millis();

  while (millis() - startMillis < frequencySampleTime)
  {
    int reading = analogRead(Sound_PIN);

    // Check for zero-crossing (change from positive to negative or vice versa)
    if ((lastReading < 2048 && reading >= 2048) || (lastReading > 2048 && reading <= 2048))
    {
      zeroCrossings++;
    }
    lastReading = reading;
  }

  // Estimate frequency based on zero crossings
  frequency = (zeroCrossings / 2.0) * (1000.0 / frequencySampleTime); // in Hz
  Serial.print("Approximate Frequency: ");
  Serial.print(frequency);
  Serial.println(" Hz");
}

float readLight()
{
  float light = analogRead(LDR_PIN);

  Serial.print("Light: ");
  Serial.println(light);
  return light;
}

float readSound()
{
  return 0;
}

/**
 * Reads the temperature from the AM2320 sensor.
 *
 * This function retrieves the current temperature value from the AM2320 sensor,
 * prints it to the serial monitor, and returns the temperature as a float.
 *
 * @return float The temperature value read from the sensor.
 */
float readTemperature()
{
  // Read temperature and humidity
  float temperature = am2320.readTemperature();

  // Check if the readings are valid
  if (isnan(temperature))
  {
    Serial.println("Failed to read from AM2320 sensor!");
    return 0;
  }
  else
  {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" *C");
    return temperature;
  }
}

/**
 * Reads the humidity from the AM2320 sensor.
 *
 * This function retrieves the current humidity value from the AM2320 sensor,
 * prints it to the serial monitor, and returns the humidity as a float.
 *
 * @return float The humidity value read from the sensor.
 */
float readHumidity()
{
  // Read temperature and humidity
  float humidity = am2320.readHumidity();

  // Check if the readings are valid
  if (isnan(humidity))
  {
    Serial.println("Failed to read from AM2320 sensor");
    return 0;
  }
  else
  {
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    return humidity;
  }
}

// --------------- < End Functions > --------------- //
// -------------- < Start Main Code > -------------- //
void setup()
{
  Serial.begin(9600);

  // AM2320 sensor
  am2320.begin();

  // LDR sensor
  pinMode(LDR_PIN, INPUT);

  // MiCS
  pinMode(MiCS, INPUT);

  // R0 = calibrateR0();
  // Serial.print("Calibration complete. R0 = ");
  // Serial.println(R0);

  // Sound sensor
  pinMode(Sound_PIN, INPUT); // Set the signal pin as input
}
void loop()
{
  // readTemperature();

  // readHumidity();

  // // readGases();

  // readLight();

  // readSound();

  // delay(2000);

  // Serial.print("MiCS: ");
  // Serial.println(readNH3());
  // delay(1000);

  // Measure sound intensity
  measureSoundIntensity();

  // Measure sound frequency
  measureSoundFrequency();

  // Delay between measurements
  delay(500);
}
// --------------- < End Main Code > --------------- //
// ------------------------------------------------- //