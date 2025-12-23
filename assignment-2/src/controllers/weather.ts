import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";

interface LocationCoordinatesResponse {
	name: string;
	local_names: Record<string, string>;
	lat: number;
	lon: number;
	country: string;
	state: string;
}

interface CoordinatesLocationResponse {
	name: string;
	local_names: Record<string, string>;
	lat: number;
	lon: number;
	country: string;
}

interface CurrentResponse {
	coord: {
		lon: number;
		lat: number;
	};
	weather: {
		id: number | undefined;
		main: string | undefined;
		description: string | undefined;
		icon: string | undefined;
	}[] | undefined;
	base: string | undefined;
	main: {
		temp: number | undefined;
		feels_like: number | undefined;
		temp_min: number | undefined;
		temp_max: number | undefined;
		pressure: number | undefined;
		humidity: number | undefined;
		sea_level: number | undefined;
		grnd_level: number | undefined;
	};
	visibility: number | undefined;
	wind: {
		speed: number | undefined;
		deg: number | undefined;
		gust: number | undefined;
	} | undefined;
	rain: {
		"1h": number | undefined;
	} | undefined;
	clouds: {
		all: number | undefined;
	} | undefined;
	dt: number | undefined;
	sys: {
		type: number | undefined;
		id: number | undefined;
		country: string | undefined;
		sunrise: number | undefined;
		sunset: number | undefined;
	} | undefined;
	timezone: number | undefined;
	id: number | undefined;
	name: string | undefined;
	cod: number | undefined;
}

interface WeatherResponse {
	temperature: number;
	description: string;
	icon: string;
	latitude: number;
	longitude: number;
	feels_like: number;
	humidity: number;
	pressure: number;
	wind_speed: number;
	county_code: string;
	rain_volume: number;
}

class WeatherController {
	private static OPENWEATHER_API_BASE_URL: string = "https://api.openweathermap.org";
	private static OPENWEATHER_API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;

	constructor() {
		if (WeatherController.OPENWEATHER_API_KEY == undefined) {
			throw new Error("OPENWEATHER_API_KEY is not defined in environment variables!");
		}
	}

	/**
	 * Fetches coordinates by location name using OpenWeather Geocoding API
	 * @param city_name City name, state code (only for the US) and country code divided by comma. Please use ISO 3166 country codes.
	 * @param limit Number of the locations in the API response (up to 5 results can be returned in the API response)
	 */
	private async fetchLocationCoordinates(city_name: string, limit: number = 5): Promise<Response> {
		const url = `${WeatherController.OPENWEATHER_API_BASE_URL}/geo/1.0/direct?q=${city_name}&limit=${limit}&appid=${WeatherController.OPENWEATHER_API_KEY}`;

		const response = await fetch(url, {
			method: "GET",
		});

		return response;
	}

	/**
	 * Fetches coordinates by location name using OpenWeather Geocoding API
	 * @param latitude Latitude.
	 * @param longitude Longitude.
	 * @param limit Number of the locations in the API response (up to 5 results can be returned in the API response)
	 */
	private async fetchCoordinatesLocation(latitude: number, longitude: number, limit: number = 5): Promise<Response> {
		const url = `${WeatherController.OPENWEATHER_API_BASE_URL}/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=${limit}&appid=${WeatherController.OPENWEATHER_API_KEY}`;

		const response = await fetch(url, {
			method: "GET",
		});

		return response;
	}

	/**
	 * Fetches current and forecasts weather data using OpenWeather Current weather data API
	 * @param latitude Latitude.
	 * @param longitude Longitude.
	 * @param units Units of measurement. `standard`, `metric` and `imperial` units are available.
	 * @param language Refer to https://openweathermap.org/current#multi for available values
	 */
	private async fetchCurrentWeather(latitude: number, longitude: number, units: string = "metric", language: string = "en"): Promise<Response> {
		const url = `${WeatherController.OPENWEATHER_API_BASE_URL}/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WeatherController.OPENWEATHER_API_KEY}&units=${units}&lang=${language}&mode=json`;

		const response = await fetch(url, {
			method: "GET",
		});

		return response;
	}

	/**
	 * Returns OpenWeather icon URL
	 * See: https://openweathermap.org/weather-conditions#Icon-list
	 * @param icon OpenWeather icon code
	 */
	private getOpenWeatherIconURL(icon: string): string {
		if (icon.length == 0) {
			return "";
		}

		return `https://openweathermap.org/img/wn/${icon}@2x.png`;
	}

	public async getCurrentWeather(latitude: number, longitude: number, units: string = "metric", language: string = "en"): Promise<WeatherResponse | null> {
		const location_response = await this.fetchCoordinatesLocation(latitude, longitude);
		if (!location_response.ok) {
			return null;
		}

		const location_json: CoordinatesLocationResponse[] = await location_response.json() ?? [];
		if (location_json.length == 0) {
			return null;
		}

		const {country} = location_json[0];

		const weather_response = await this.fetchCurrentWeather(latitude, longitude, units, language);
		if (!weather_response.ok) {
			return null;
		}

		const weather_json: CurrentResponse = await weather_response.json() ?? {};

		return {
			"temperature": weather_json.main?.temp ?? 0,
			"description": weather_json.weather?.[0]?.description ?? "",
			"icon": this.getOpenWeatherIconURL(weather_json.weather?.[0]?.icon ?? ""),
			"latitude": weather_json.coord?.lat,
			"longitude": weather_json.coord?.lon,
			"feels_like": weather_json.main?.feels_like ?? 0,
			"humidity": weather_json.main?.humidity ?? 0,
			"pressure": weather_json.main?.pressure ?? 0,
			"wind_speed": weather_json.wind?.speed ?? 0,
			"county_code": country ?? "",
			"rain_volume": weather_json.rain?.["1h"] ?? 0,
		}
	}

	public async getCurrentWeatherAtCity(city: string, units: string = "metric", language: string = "en"): Promise<WeatherResponse | null> {
		const location_response = await this.fetchLocationCoordinates(city, 1);
		if (!location_response.ok) {
			return null;
		}

		const location_json: LocationCoordinatesResponse[] = await location_response.json() ?? [];
		if (location_json.length == 0) {
			return null;
		}

		const {lat, lon, country} = location_json[0];

		const weather_response = await this.fetchCurrentWeather(lat, lon, units, language);
		if (!weather_response.ok) {
			return null;
		}

		const weather_json: CurrentResponse = await weather_response.json() ?? {};

		return {
			"temperature": weather_json.main?.temp ?? 0,
			"description": weather_json.weather?.[0]?.description ?? "",
			"icon": this.getOpenWeatherIconURL(weather_json.weather?.[0]?.icon ?? ""),
			"latitude": weather_json.coord?.lat,
			"longitude": weather_json.coord?.lon,
			"feels_like": weather_json.main?.feels_like ?? 0,
			"humidity": weather_json.main?.humidity ?? 0,
			"pressure": weather_json.main?.pressure ?? 0,
			"wind_speed": weather_json.wind?.speed ?? 0,
			"county_code": country ?? "",
			"rain_volume": weather_json.rain?.["1h"] ?? 0,
		}
	}

	public async routeGetWeather(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const {city} = req.query;

		if (city == undefined) {
			await res.status(400).json({"message": "city must be defined!"});

			next();
			return;
		}

		if (typeof city != "string") {
			await res.status(400).json({"message": "city must be a string!"});

			next();
			return;
		}

		const location_response = await this.fetchLocationCoordinates(city, 1);
		if (!location_response.ok) {
			await res.status(location_response.status).json({"message": "Failed to fetch location coordinates!"});

			next();
			return;
		}

		const location_json: LocationCoordinatesResponse[] = await location_response.json() ?? [];
		if (location_json.length == 0) {
			await res.status(404).json({"message": "Location not found!"});

			next();
			return;
		}

		const {lat, lon, country} = location_json[0];

		const weather_response = await this.fetchCurrentWeather(lat, lon);
		if (!weather_response.ok) {
			await res.status(weather_response.status).json({"message": "Failed to fetch weather data!"});

			next();
			return;
		}

		const weather_json: CurrentResponse = await weather_response.json() ?? {};

		await res.json({
			"temperature": weather_json.main?.temp ?? 0,
			"description": weather_json.weather?.[0]?.description ?? "",
			"icon": this.getOpenWeatherIconURL(weather_json.weather?.[0]?.icon ?? ""),
			"latitude": weather_json.coord?.lat,
			"longitude": weather_json.coord?.lon,
			"feels_like": weather_json.main?.feels_like ?? 0,
			"humidity": weather_json.main?.humidity ?? 0,
			"pressure": weather_json.main?.pressure ?? 0,
			"wind_speed": weather_json.wind?.speed ?? 0,
			"county_code": country ?? "",
			"rain_volume": weather_json.rain?.["1h"] ?? 0,
		});
	}
}

declare global {
	var weatherController: WeatherController;
}

if (global.weatherController == undefined) {
	global.weatherController = new WeatherController();
}

export const weatherController = global.weatherController;