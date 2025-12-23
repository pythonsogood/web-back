# Assignment 2: API

Full-stack TypeScript web application built with [express](https://github.com/expressjs/express), [ejs](https://github.com/mde/ejs), and [Sass](https://github.com/sass/sass).

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit/)

## Features

* [IP-based geolocation](https://ip-api.com/) with fallback for localhost
* Weather data from [OpenWeather API](https://openweathermap.org/)
* Facts from [Useless Facts API](https://uselessfacts.jsph.pl/)
* Random fox images from [randomfox.ca](https://randomfox.ca/)
* Embedded [OpenStreetMap](https://www.openstreetmap.org/) iframe centered on detected coordinates
* Type-safe controllers using [TypeScript](https://github.com/microsoft/TypeScript)
* Modular routing with [express routers](https://expressjs.com/en/guide/routing.html)

## Key Design Decisions

* Each external API call:
	- Checks `response.ok`
	- Returns appropriate HTTP status codes
	- Uses safe fallbacks (`??`, `?.` optional chaining)

This prevents server crashes due to malformed or unavailable API responses.

* No Client-Side API Calls

All third-party API requests are handled server-side to protect API keys

## Installation

install [node.js](https://nodejs.org/en/download/)

install [pnpm](https://pnpm.io/installation)

install dependencies

```sh
pnpm install
```

grab [OpenWeather API key](https://home.openweathermap.org/api_keys)

create a `.env` file

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

## Usage

build

```sh
pnpm build
```

run `dist/index.js`

```sh
pnpm start
```
or
```sh
node dist/index.js
```

the application will be available at: http://localhost:3000

## API Documentation

### Weather API

Endpoint

```
GET /api/weather?city={cityName}
```

Response Model

```json
{
	"temperature": number,
	"description": string,
	"icon": string,
	"latitude": number,
	"longitude": number,
	"feels_like": number,
	"humidity": number,
	"pressure": number,
	"wind_speed": number,
	"county_code": string,
	"rain_volume": number
}
```

![postman](/assignment-2/assets/api_weather_postman.png)

### Facts API

#### Random Fact

Endpoint

```
GET /api/fact/random
```

Response Model:

```json
{"text": string}
```

![postman](/assignment-2/assets/api_fact_random_postman.png)

#### Fact of the Day

Endpoint

```
GET /api/fact/today
```

Response Model:

```json
{"text": string}
```

![postman](/assignment-2/assets/api_fact_today_postman.png)

### Animal API

#### Random Fox Image

Endpoint

```
GET /api/animal/random_fox
```

Response Model:

```json
{"url": string}
```

![postman](/assignment-2/assets/api_animal_random_fox_postman.png)