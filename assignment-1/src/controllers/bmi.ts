import { NextFunction, Request, Response } from "express";

class BMIController {
	constructor() {}

	/**
	 * @param weight in kilograms
	 * @param height in centimeters
	 * @returns in kg/m^2
	 */
	public calculate_bmi(weight: number, height: number): number {
		if (height == 0) {
			return 0;
		}

		return weight / (height ** 2);
	}

	public async routeCalculateBMI(req: Request, res: Response, next: NextFunction): Promise<void> {
		const {weight, height} = req.body;

		if (weight == undefined || height == undefined) {
			await res.status(400).json({"message": "weight and height must be defined!"});

			next();
			return;
		}

		if (typeof weight != "number" || typeof height != "number") {
			await res.status(400).json({"message": "weight and height must be numbers!"});

			next();
			return;
		}

		if (weight <= 0 || height <= 0) {
			await res.status(400).json({"message": "weight and height must be greater than 0!"});

			next();
			return;
		}

		const bmi = this.calculate_bmi(weight, height / 100);

		await res.json({"bmi": bmi});
	}
}

declare global {
	var bmiController: BMIController;
}

if (global.bmiController == undefined) {
	global.bmiController = new BMIController();
}

export const bmiController = global.bmiController;