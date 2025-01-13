// ESP32 Code for capstone 2024 G12
// Made by group 21316 Mohammed W., Ziad E., Mostafa A. in Obour STEM School
// --------------- < Start Definitions > --------------- //

#include <Arduino.h>
#include <SPI.h>
#include <WiFi.h>

// AM2320 sensor
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_AM2320.h>

// Supabase Client
#include <ESPSupabase.h>

// MiCS Variables
#define MiCS 35

// setting PINs
#define LDR_PIN 32
#define Sound_PIN 34
#define buzzer 19
#define LED 18
#define ESP_LED 2

// the LDR max value
#define LDR_Light 200

// setting up the AM2320 sensor
Adafruit_AM2320 am2320 = Adafruit_AM2320();

// supabase Credentials

Supabase db; // Supabase client
String supabase_url = "https://plrcyvdofiqbtdezzdnl.supabase.co";
String anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscmN5dmRvZmlxYnRkZXp6ZG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NzM0MDUsImV4cCI6MjA0NzI0OTQwNX0.X2Fs_Q4EzPj-b5PTm0_DtrTtxTupJMottl-o85IeVc8";
String DataTable = "nowData";      // the table where the data will be stored
String SettingsTable = "settings"; // the table where the settings will be fetched
String JSON = "";                  // JSON String

// Wifi-Credentials
#define WIFI_SSID "hi"           //  WiFi SSID
#define WIFI_PASSWORD "cave1234" //  WiFi password

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

// threshold Variables
int temperatureMaxThreshold = 40;
int temperatureMinThreshold = 20;
int humidityMaxThreshold = 80;
int humidityMinThreshold = 30;
int soundIntensityThreshold = 0.1;
int NH3Threshold = 10;
int soundFrequencyThreshold = 500;

// global variables to store the readings
float temperature = 0.0,
      humidity = 0.0,
      NH3 = 0.0,
      soundIntensity = 0.0,
      soundFrequency = 0.0;
bool light = false;

// Variable for non-blocking code
unsigned long previousLoopMillis = 0, previousBuzzerMillis = 0;

// Readings Interval
#define ReadingsInterval 25000 // 5000

// --------------- < End Definitions > --------------- //
// --------------- < Start Functions > --------------- //

float measureSoundIntensity()
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
  return intensity;
}

float measureSoundFrequency()
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
  return frequency;
}

bool readLight()
{
  float light = analogRead(LDR_PIN);

  Serial.print("Light: ");
  Serial.println(light);
  if (light > 500)
  {
    light = true;
  }
  else
  {
    light = false;
  }
  return light;
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
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" *C");
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

// buzzer function that turns the buzzer on and off to create a tone that looks like the fire alarm
void CheckBuzzer()
{
  if (temperature > temperatureMaxThreshold ||
      temperature < temperatureMinThreshold ||
      humidity > humidityMaxThreshold ||
      humidity < humidityMinThreshold ||
      NH3 > NH3Threshold || soundFrequency > soundFrequencyThreshold) //  soundIntensity > soundIntensityThreshold
  {
    digitalWrite(buzzer, HIGH);
    digitalWrite(LED, HIGH);
    delay(100);
    digitalWrite(buzzer, LOW);
    digitalWrite(LED, LOW);
    delay(100);
  }
}

float readNH3()
{
  int rawADC = analogRead(MiCS);
  // Constants for the MiCS sensor and ESP32 ADC
  const int adcMaxValue = 4095;       // 12-bit ADC resolution
  const float sensorMaxVoltage = 3.3; // ADC reference voltage (ESP32 default)

  // Calculate ammonia concentration in ppm using the linear relationship
  float ppm = 0.1067 * rawADC - 72;

  // Ensure ppm is non-negative (safety check)
  if (ppm < 0)
    ppm = 0;

  Serial.print("Ammonia");
  Serial.print(ppm);
  Serial.println("ppm");

  return ppm;
}

// --------------- < End Functions > --------------- //
// -------------- < Start Main Code > -------------- //
void setup()
{
  Serial.begin(9600);

  // LDR sensor
  pinMode(LDR_PIN, INPUT);

  // Buzzer
  pinMode(buzzer, OUTPUT);
  pinMode(LED, OUTPUT);
  pinMode(ESP_LED, OUTPUT);

  // MiCS
  pinMode(MiCS, INPUT);

  // Sound sensor
  pinMode(Sound_PIN, INPUT); // Set the signal pin as input

  // Connect to wifi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");

  // AM2320 sensor
  am2320.begin();

  // Connect to Supabase
  db.begin(supabase_url, anon_key);

  // get the thresholds from the database
  // temperatureMaxThreshold = db.from(SettingsTable).select("temperature_max_threshold").limit(1).doSelect().toInt();
  // db.urlQuery_reset();
  // temperatureMinThreshold = db.from(SettingsTable).select("temperature_threshold").eq("id", "1").doSelect().toInt();
  // db.urlQuery_reset();
  // humidityMaxThreshold = db.from(SettingsTable).select("humidity_threshold").eq("id", "1").doSelect().toInt();
  // db.urlQuery_reset();
  // humidityMinThreshold = db.from(SettingsTable).select("humidity_threshold").eq("id", "1").doSelect().toInt();
  // db.urlQuery_reset();
  // NH3Threshold = db.from(SettingsTable).select("NH3_threshold").eq("id", "1::real").doSelect().toInt();
  // db.urlQuery_reset();

  // // print all thresholds
  // Serial.print("Temperature Max Threshold: ");
  // Serial.println(temperatureMaxThreshold);
  // Serial.print("Temperature Min Threshold: ");
  // Serial.println(temperatureMinThreshold);
  // Serial.print("Humidity Max Threshold: ");
  // Serial.println(humidityMaxThreshold);
  // Serial.print("Humidity Min Threshold: ");
  // Serial.println(humidityMinThreshold);
  // Serial.print("NH3 Threshold: ");
  // Serial.println(NH3Threshold);
  // Serial.print("Sound Power Threshold: ");
  // Serial.println(soundIntensityThreshold);
  // Serial.print("sound frequency threshold: ");
  // Serial.println(soundFrequencyThreshold);

  digitalWrite(ESP_LED, HIGH);
  delay(100);
}
void loop()
{

  if (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED)
    {
      delay(500);
      Serial.print(".");
    }
    Serial.println("Connected to WiFi");
    db.begin(supabase_url, anon_key);
  }
  if (millis() - previousBuzzerMillis >= 1000)
  {
    CheckBuzzer();
  }

  if (millis() - previousLoopMillis >= ReadingsInterval || soundIntensity > 0.5)
  {
    previousLoopMillis = millis();

    delay(20);
    temperature = readTemperature();
    delay(20);
    humidity = readHumidity();
    NH3 = readNH3();
    light = readLight();
    soundIntensity = measureSoundIntensity();
    soundFrequency = measureSoundFrequency();

    // Prepare Data as JSON
    JSON = "{\"temperature\":";
    JSON += temperature;
    JSON += ",\"humidity\":";
    JSON += humidity;
    JSON += ",\"NH3\":";
    JSON += NH3;
    JSON += ",\"light\":";
    JSON += light;
    JSON += ",\"soundPower\":";
    JSON += soundIntensity;
    JSON += ",\"soundFrequency\":";
    JSON += soundFrequency;
    JSON += "}";

    // Send Data to Supabase
    int code = db.insert(DataTable, JSON, false);
    Serial.println(code);
    db.urlQuery_reset();
    JSON = "";
  }
  // Delay between measurements
  delay(500);
}
// --------------- < End Main Code > --------------- //
// ------------------------------------------------- //