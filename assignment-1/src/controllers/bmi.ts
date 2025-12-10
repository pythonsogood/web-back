import { NextFunction, Request, Response } from "express";

class BMIController {
	constructor() {}

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

		const bmi = this.calculate_bmi(weight, height);

		await res.json({"bmi": bmi});
	}
}

declare global {
	var bmiController: BMIController;
}

if (global.bmiController == undefined) {
	global.bmiController = new BMIController();
}

export default global.bmiController;