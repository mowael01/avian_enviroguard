
// ESP32 Code for capstone 2024 G12
// Made by group 21316 Mohammed W., Ziad E., Mostafa A. in Obour STEM School
// --------------- < Start Definitions > --------------- //

#include <Arduino.h>

// AM2320 sensor
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_AM2320.h>

// ZeroFFT to analyze sound
#include <Adafruit_ZeroFFT.h>

// Wifi
#include <WiFi.h>

// setting PINs
#define LDR_PIN 15
#define Sound_PIN 34

// the LDR max value
#define LDR_Light 200

// setting up the AM2320 sensor
Adafruit_AM2320 am2320 = Adafruit_AM2320();

// Firebase Credentials

// Wifi-Credentials
#define WIFI_SSID "Wael"         //  WiFi SSID
#define WIFI_PASSWORD "12345678" //  WiFi password

// millis variable used for asynchronous code
unsigned long startMillis = millis(); // Start of sample window

// variables for the sound sensor
#define SAMPLES 256              // Must be a power of 2 for FFT
#define SAMPLING_FREQUENCY 10000 // Hz, adjust for your needs
#define SOUND_SPEED 343.0        // Speed of sound in m/s (adjust for environment)

unsigned int sampling_period_us;
unsigned long microseconds;

int16_t vReal[SAMPLES]; // Array to store audio samples

// --------------- < End Definitions > --------------- //
// --------------- < Start Functions > --------------- //

float readLight()
{
  float light = analogRead(LDR_PIN);

  Serial.print("Light: ");
  Serial.println(light);
  return light;
}

float readSound()
{
  float sound = analogRead(Sound_PIN);

  // Sample audio data from analog pin
  for (int i = 0; i < SAMPLES; i++)
  {
    microseconds = micros();
    vReal[i] = analogRead(Sound_PIN) - 512; // Center data around 0 (adjust analog pin if needed)
    while (micros() - microseconds < sampling_period_us)
    {
      // Wait for the next sample
    }
  }

  // Perform FFT on the sampled data
  ZeroFFT(vReal, SAMPLES);

  // Find the dominant frequency index
  int peakIndex = 0;
  int maxMagnitude = 0;
  for (int i = 1; i < SAMPLES / 2; i++)
  { // Only check the first half of the FFT output
    int magnitude = abs(vReal[i]);
    if (magnitude > maxMagnitude)
    {
      maxMagnitude = magnitude;
      peakIndex = i;
    }
  }

  // Calculate the frequency from the peak index
  float frequency = (peakIndex * SAMPLING_FREQUENCY) / SAMPLES;
  Serial.print("Dominant Frequency: ");
  Serial.print(frequency);
  Serial.println(" Hz");

  // Calculate wavelength
  float wavelength = SOUND_SPEED / frequency;
  Serial.print("Wavelength: ");
  Serial.print(wavelength);
  Serial.println(" meters");

  // Calculate RMS for sound power estimation
  double sumSquares = 0;
  for (int i = 0; i < SAMPLES; i++)
  {
    sumSquares += (vReal[i] * vReal[i]);
  }
  double rms = sqrt(sumSquares / SAMPLES);
  Serial.print("Sound Intensity (RMS): ");
  Serial.println(rms);

  return sound;
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

// float readGases()
// {
//   float co = MiCS.measureCO();
//   float nh3 = MiCS.measureNH3();
//   Serial.print("CO: ");
//   Serial.println(co);
//   Serial.print("NH3: ");
//   Serial.println(nh3);
//   return co, nh3;
// }
// --------------- < End Functions > --------------- //
// -------------- < Start Main Code > -------------- //
void setup()
{
  Serial.begin(9600);

  // AM2320 sensor
  am2320.begin();

  sampling_period_us = round(1000000 * (1.0 / SAMPLING_FREQUENCY));

  // LDR sensor
  pinMode(LDR_PIN, INPUT);

  // Sound sensor
  pinMode(Sound_PIN, INPUT); // Set the signal pin as input
}
void loop()
{
  readTemperature();

  readHumidity();

  // readGases();

  readLight();

  readSound();

  delay(2000);
}
// --------------- < End Main Code > --------------- //
// ------------------------------------------------- //