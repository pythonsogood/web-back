const BMI_CATEGORY: {"name": string, "bmi": number}[] = [
	{"name": "underweight", "bmi": -Infinity},
	{"name": "normal", "bmi": 18.5},
	{"name": "overweight", "bmi": 25},
	{"name": "obese", "bmi": 30},
];

async function onBMIFormSubmit(): Promise<void> {
	const weightInput = document.querySelector<HTMLInputElement>("#weight");
	const heightInput = document.querySelector<HTMLInputElement>("#height");

	const weight = parseFloat(weightInput?.value ?? "0.0");
	const height = parseFloat(heightInput?.value ?? "0.0");

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

	if (response.status != 200) {
		const response_json: {message?: string} = await response.json() ?? {};

		alert(`Server returned ${response.status} code: ${response_json.message ?? "unknown error!"}`);

		return;
	}

	const response_json: {bmi?: number} = await response.json() ?? {};

	const bmi = response_json["bmi"] ?? 0;

	const bmiDiv = document.querySelector<HTMLDivElement>("#bmi");

	if (bmiDiv != null) {
		const bmiDivValue = bmiDiv.querySelector<HTMLSpanElement>(".value");
		const bmiDivCategory = bmiDiv.querySelector<HTMLSpanElement>(".category");

		let bmi_category = BMI_CATEGORY.find((v, i, a) => {
			return v.bmi <= bmi && (a[i + 1] == undefined || a[i + 1].bmi > bmi);
		})?.name;

		if (bmiDivValue != null) {
			bmiDivValue.textContent = `${Math.trunc(bmi * 10) / 10}`;

			for (const category of BMI_CATEGORY) {
				bmiDivValue.classList.toggle(category.name, category.name == bmi_category);
			}
		}

		if (bmiDivCategory != null) {
			bmiDivCategory.textContent = bmi_category != undefined ? bmi_category : "?";
		}
	}
}