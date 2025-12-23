import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";

interface UselessFactResponse {
	id: string;
	text: string;
	source: string;
	source_url: string;
	language: string;
	permalink: string;
}

class FactController {
	private static USELESS_FACTS_API_BASE_URL: string = "https://uselessfacts.jsph.pl";

	constructor() {}

	/**
	 * @param language Currently supported languages are `en` and `de`.
	 */
	private async fetchRandomFact(language: string = "en"): Promise<Response> {
		const url = `${FactController.USELESS_FACTS_API_BASE_URL}/api/v2/facts/random?language=${language}`;

		const response = await fetch(url, {
			method: "GET",
		});

		return response;
	}

	/**
	 * @param language Currently supported languages are `en` and `de`.
	 */
	private async fetchTodayFact(language: string = "en"): Promise<Response> {
		const url = `${FactController.USELESS_FACTS_API_BASE_URL}/api/v2/facts/today?language=${language}`;

		const response = await fetch(url, {
			method: "GET",
		});

		return response;
	}

	public async getRandomFact(language: string = "en"): Promise<string | null> {
		const random_fact_response = await this.fetchRandomFact(language);
		if (!random_fact_response.ok) {
			return null;
		}

		const random_fact_json: UselessFactResponse = await random_fact_response.json() ?? {};

		return random_fact_json.text ?? null;
	}

	public async getTodayFact(language: string = "en"): Promise<string | null> {
		const today_fact_response = await this.fetchRandomFact(language);
		if (!today_fact_response.ok) {
			return null;
		}

		const today_fact_json: UselessFactResponse = await today_fact_response.json() ?? {};

		return today_fact_json.text ?? null;
	}

	public async routeGetRandomFact(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const random_fact_response = await this.fetchRandomFact();
		if (!random_fact_response.ok) {
			await res.status(random_fact_response.status).json({"message": await random_fact_response.text()});

			next();
			return;
		}

		const today_fact_json: UselessFactResponse = await random_fact_response.json() ?? {};

		await res.json({"text": today_fact_json.text ?? ""});
	}

	public async routeGetTodayFact(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const today_fact_response = await this.fetchTodayFact();
		if (!today_fact_response.ok) {
			await res.status(today_fact_response.status).json({"message": await today_fact_response.text()});

			next();
			return;
		}

		const today_fact_json: UselessFactResponse = await today_fact_response.json() ?? {};

		await res.json({"text": today_fact_json.text ?? ""});
	}
}

declare global {
	var factController: FactController;
}

if (global.factController == undefined) {
	global.factController = new FactController();
}

export const factController = global.factController;