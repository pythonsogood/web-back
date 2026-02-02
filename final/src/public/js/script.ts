function loadBootstrapForms(): void {
	for (const form of document.querySelectorAll<HTMLFormElement>("form.needs-validation")) {
		form.addEventListener("submit", (event) => {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}

			form.classList.add("was-validated");
		}, false);
	}
}

async function OnDOMLoaded(): Promise<void> {
	loadBootstrapForms();
}

document.addEventListener("DOMContentLoaded", OnDOMLoaded);