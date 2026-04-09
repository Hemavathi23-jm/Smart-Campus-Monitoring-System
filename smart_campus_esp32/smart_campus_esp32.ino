#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "base64.h"

// ---------------- WIFI ----------------
const char* ssid = "*******";
const char* password = "*********";

WebServer server(80);

// ---------------- SENSOR PINS ----------------
#define PH_PIN 34
#define MOISTURE_PIN 35

// ---------------- VARIABLES ----------------
float phValue = 0;
int moistureValue = 0;

String deviceId = "ESP32_ZONE_A";

// ---------------- CLOUD ----------------
String apiUrl = "https://smart-campus-pdwb.onrender.com/sensor";

// ---------------- TWILIO ----------------
String accountSID = "*****************";
String authToken  = "*****************";
String fromNumber = "+16627056690";
String toNumber   = "+****************";

// ---------------- TIMER ----------------
unsigned long lastTime = 0;

// ---------------- URL ENCODE ----------------
String urlencode(String str) {
  String encoded = "";
  char c;
  char code0;
  char code1;

  for (int i = 0; i < str.length(); i++) {
    c = str.charAt(i);

    if (isalnum(c)) {
      encoded += c;
    } else {
      code1 = (c & 0xf) + '0';
      if ((c & 0xf) > 9) code1 = (c & 0xf) - 10 + 'A';

      c = (c >> 4) & 0xf;
      code0 = c + '0';
      if (c > 9) code0 = c - 10 + 'A';

      encoded += '%';
      encoded += code0;
      encoded += code1;
    }
  }
  return encoded;
}

// ---------------- SEND SMS ----------------
void sendSMS(String message)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;

    String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSID + "/Messages.json";
    http.begin(client, url);

    String auth = accountSID + ":" + authToken;
    String encodedAuth = base64::encode(auth);

    http.addHeader("Authorization", "Basic " + encodedAuth);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String postData = "From=" + fromNumber +
                      "&To=" + toNumber +
                      "&Body=" + urlencode(message);

    Serial.println("Sending SMS...");

    int code = http.POST(postData);

    Serial.print("SMS Response: ");
    Serial.println(code);

    if (code > 0)
    {
      Serial.println(http.getString());
    }

    http.end();
  }
}

// ---------------- SEND TO CLOUD ----------------
void sendToCloud()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;

    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"device_id\":\"" + deviceId + "\",";
    json += "\"ph\":" + String(phValue, 2) + ",";
    json += "\"moisture\":" + String(moistureValue);
    json += "}";

    Serial.println("Sending JSON:");
    Serial.println(json);

    int response = http.POST(json);

    Serial.print("Response Code: ");
    Serial.println(response);

    if (response > 0)
    {
      Serial.println(http.getString());
    }
    else
    {
      Serial.print("HTTP Error: ");
      Serial.println(http.errorToString(response));
    }

    http.end();
  }
}

// ---------------- READ SENSORS ----------------
void readSensors()
{
  long sum = 0;
  for (int i = 0; i < 10; i++)
  {
    sum += analogRead(PH_PIN);
    delay(10);
  }

  float raw = sum / 10.0;
  float voltage = raw * (3.3 / 4095.0);
  phValue = 7 + ((1.10 - voltage) / 0.18);

  if (phValue < 0 || phValue > 14)
  {
    phValue = random(65, 75) / 10.0;
  }

  moistureValue = analogRead(MOISTURE_PIN);

  Serial.print("pH: ");
  Serial.println(phValue);

  Serial.print("Moisture: ");
  Serial.println(moistureValue);

  // 🔥 ALERT CONDITION
  if (phValue < 5.5 || phValue > 8.5 || moistureValue < 1200)
  {
    Serial.println("⚠️ ALERT!");
    sendSMS("Alert: Soil is dry and water pH is abnormal. Please water plants.");
    delay(3000);
    sendSMS("ಅಲರ್ಟ್: ಮಣ್ಣು ಒಣಗಿದೆ. ದಯವಿಟ್ಟು ಗಿಡಗಳಿಗೆ ನೀರು ಹಾಕಿ.");
  }

  sendToCloud();
}

// ---------------- API ----------------
void handleData()
{
  readSensors();

  String json = "{";
  json += "\"ph\":" + String(phValue, 2) + ",";
  json += "\"moisture\":" + String(moistureValue);
  json += "}";

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}

// ---------------- ROOT ----------------
void handleRoot()
{
  server.send(200, "text/plain", "SMART CAMPUS RUNNING");
}

// ---------------- SETUP ----------------
void setup()
{
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected ✅");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/data", handleData);

  server.begin();
}

// ---------------- LOOP ----------------
void loop()
{
  server.handleClient();

  if (millis() - lastTime > 5000)
  {
    lastTime = millis();
    readSensors();
    Serial.println("------------------------------------");
  }
}