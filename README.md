# Smart-Campus-Monitoring-System
The Smart Campus Monitoring System is an IoT-based solution that monitors soil moisture and pH levels in real time using ESP32 and sensors. Data is sent to AWS cloud services for processing and storage. A web dashboard displays insights and alerts for efficient monitoring.
Smart Campus Monitoring System
Overview
The Smart Campus Monitoring System is an IoT-based solution designed to monitor environmental conditions such as soil moisture and pH levels in real time. The system uses sensors connected to an ESP32 microcontroller to collect data and transmit it to cloud services for processing, storage, and visualization. A web-based dashboard provides users with real-time insights and alerts for efficient decision-making.

Features
Real-time monitoring of soil moisture and pH levels

Cloud-based data storage using AWS DynamoDB

REST APIs for data transmission and retrieval

Interactive web dashboard for visualization

Alert system for abnormal conditions (SMS/notifications)

Historical data analysis and reporting

Technologies Used
Hardware
ESP32 Microcontroller

Soil Moisture Sensor

pH Sensor

Software & Tools
Arduino IDE (Embedded C)

AWS Lambda (Python)

AWS API Gateway

AWS DynamoDB

React.js (Frontend)

Tailwind CSS

Recharts (Data Visualization)

Postman (API Testing)

System Architecture
The system follows a layered architecture:

Sensor Layer – Collects environmental data

Device Layer (ESP32) – Processes and sends data

Cloud Layer (AWS) – Stores and processes data

Application Layer – Displays data on dashboard

Working
Sensors collect soil moisture and pH data

ESP32 processes and sends data to API Gateway

API Gateway triggers AWS Lambda

Lambda processes data and stores it in DynamoDB

Frontend fetches data using APIs

Dashboard displays real-time data and alerts

API Endpoints
/sensor → Send sensor data

/latest → Get latest sensor data

/report → Get summary report

/weekly → Get last 7 days data

Installation & Setup
Hardware Setup
Connect soil moisture and pH sensors to ESP32

Power the ESP32 using a stable power supply

Ensure Wi-Fi connectivity

Software Setup
Install Arduino IDE

Upload ESP32 code

Configure AWS services:

Create Lambda functions

Setup API Gateway

Create DynamoDB table

Run frontend using:

npm install
npm run dev
Testing
Unit Testing (individual modules)

Integration Testing (ESP32 + AWS + Frontend)

System Testing (complete workflow)

API Testing using Postman

Results
Accurate real-time data collection

Reliable cloud storage and processing

Responsive dashboard visualization

Successful alert generation

Limitations
Requires stable internet connection

Limited to soil moisture and pH parameters

Sensor accuracy may vary

Cloud services may incur cost

Future Scope
Add more sensors (temperature, humidity, air quality)

Develop mobile application

Implement AI-based prediction

Integrate automated irrigation system

Expand to smart agriculture and smart city applications

Contributors
Project developed as part of academic work

License
This project is for educational purposes.

Acknowledgement
We would like to thank our faculty and institution for their support and guidance in completing this project
