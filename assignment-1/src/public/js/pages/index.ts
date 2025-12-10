async function onBMIFormSubmit() {
	const weightInput = document.querySelector<HTMLInputElement>("#weight");
	const heightInput = document.querySelector<HTMLInputElement>("#height");

	const weight = parseInt(weightInput?.value ?? "0");
	const height = parseInt(heightInput?.value ?? "0");

	const response = await fetch("/calculate-bmi", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"weight": weight,
			"height": height
		})
	});

	const response_json: {bmi?: number} = await response.json() ?? {};

	const bmi = response_json["bmi"] ?? 0;

	const bmiDiv = document.querySelector<HTMLDivElement>("#bmi");

	if (bmiDiv != null) {
		bmiDiv.textContent = `Your BMI: ${Math.trunc(bmi)}`;
	}
}