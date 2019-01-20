/**
   BasicHTTPClient.ino

    Created on: 24.05.2015

*/

#include "DFRobot_BME680_I2C.h"
#include "Wire.h"
#include <Arduino.h>
#include <Adafruit_SSD1306.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ArduinoJson.h>
#include <Time.h>

#include <ESP8266HTTPClient.h>

#include <WiFiClient.h>

const char* ssid     = "Hackatown2019";
const char* password = "PolyHx19";

const char* host = "http://d784ab75.ngrok.io/data/update";

Adafruit_SSD1306 display = Adafruit_SSD1306(128, 32, &Wire);

ESP8266WiFiMulti WiFiMulti;

DFRobot_BME680_I2C bme(0x77);  //0x77 I2C address

void setup() {

  uint8_t rslt = 1;
  Serial.begin(115200);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C); // Address 0x3C for 128x32

  // Clear the buffer.
  display.clearDisplay();
  display.display();

  while(!Serial);
  delay(1000);
  Serial.println();
  while(rslt != 0) {
    rslt = bme.begin();
    if(rslt != 0) {
      Serial.println("bme begin failure");
      delay(2000);
    }
  }
  Serial.println("bme begin successful");

  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);

      // text display tests
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
    display.println("Waiting for connection");
  }
  display.setCursor(0,0);
  display.display(); // actually display all of the above

}

void loop() {

  bme.startConvert();
delay(1000);
bme.update();
  double temperature = bme.readTemperature();
  double humidity = bme.readHumidity();
  double gasResistance = bme.readGasResistance();
  double pressure = bme.readPressure();
  double latitude = 45.504944;
  double longitude = -73.613924;
  time_t now;
  time(&now);
  
  display.clearDisplay();
 display.setCursor(0,0);
  display.print("temperature(C): ");
  display.println(temperature / 100, 2);
  display.print("humidity(%rh): ");
  display.println(humidity / 1000, 2);
  display.print("gas resistance(ohm): ");
  display.println(gasResistance);
 display.setCursor(0,0);
  display.display();
  
  // wait for WiFi connection
  if ((WiFiMulti.run() == WL_CONNECTED)) {

    WiFiClient client;

    HTTPClient http;

  char JSONmessageBuffer[300];
  StaticJsonBuffer<300> JSONbuffer;
  JsonObject& JSONencoder = JSONbuffer.createObject();

  JSONencoder["temperature"] = temperature;
  JSONencoder["pressure"] = pressure;
  JSONencoder["humidity"] = humidity;
  JSONencoder["longitude"] = longitude;
  JSONencoder["latitude"] = latitude;
  JSONencoder["timestamp"] = now;
  JSONencoder["gas_resistance"] = gasResistance;

  JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, host)) {  // HTTP


      Serial.print("[HTTP] POST...\n");
      // start connection and send HTTP header
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST(JSONmessageBuffer);

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] POST... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    } else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
  }
}
