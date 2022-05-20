# SpeedTest

Simple speedtest application which measures both download speed and upload speed.
Under the hood it uses websockets to upload and download chunks of data. Response times are measured to than calculate total bandwidth.
Speedtest is automatically run when visiting website.

## 🔧 Technologies

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Screenshots

### Desktop

Download Test
![](readme-resources/Desktop_Download.png)

Upload test
![](readme-resources/Desktop_Upload.png)

Results screen
![](readme-resources/Desktop_Results.png)

### Mobile

Download Test
![](readme-resources/Mobile_Download.png)

Upload test
![](readme-resources/Mobile_Upload.png)

Results screen
![](readme-resources/Mobile_Results.png)

## Setup

1. Clone this repository
2. In app directory create .env-local with NEXT_PUBLIC_BACKEND_URL variable that points to backend server
3. Install packages with preferentially yarn
4. In server directory create .env file with PORT and FRONTEND_URL variables
5. Install server packages
6. For both server and app directories run first build script and then start script
