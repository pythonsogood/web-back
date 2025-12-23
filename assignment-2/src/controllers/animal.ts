import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";

class AnimalController {
	constructor() {}

	public async fetchRandomFoxImage(): Promise<string | null> {
		const url = "https://randomfox.ca/floof/";

		const response = await fetch(url, {
			method: "GET",
		});

		const response_json = await response.json() ?? {};

		return response_json.image ?? null;
	}

	public async routeGetRandomFox(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const random_fox = await this.fetchRandomFoxImage();
		if (random_fox == null) {
			await res.status(503).json({"message": "Failed to fetch random fox image!"});

			next();
			return;
		}

		await res.json({"url": random_fox});
	}
}

declare global {
	var animalController: AnimalController;
}

if (global.animalController == undefined) {
	global.animalController = new AnimalController();
}

export const animalController = global.animalController;