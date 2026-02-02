async function onBlogCreateFormSubmit(): Promise<void> {
	const titleInput = document.querySelector<HTMLInputElement>("#create-title");
	const bodyInput = document.querySelector<HTMLInputElement>("#create-body");
	const authorInput = document.querySelector<HTMLInputElement>("#create-author");

	const title = titleInput?.value ?? "";
	const body = bodyInput?.value ?? "";
	const author = authorInput?.value ?? "";

	const blog: {[key: string]: unknown} = {
		"title": title,
		"body": body,
	}

	if (author.length > 0) {
		blog.author = author;
	}

	const response = await fetch("/blogs", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(blog)
	});

	const response_text = await response.text();

	alert(response_text);
}

async function onBlogGetFormSubmit(): Promise<void> {
	const idInput = document.querySelector<HTMLInputElement>("#get-id");

	const id = idInput?.value ?? "";

	const response = await fetch(`/blogs/${id}`, {
		method: "GET",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
	});

	const response_text = await response.text();

	alert(response_text);
}

async function onBlogUpdateFormSubmit(): Promise<void> {
	const idInput = document.querySelector<HTMLInputElement>("#update-id");
	const titleInput = document.querySelector<HTMLInputElement>("#update-title");
	const bodyInput = document.querySelector<HTMLInputElement>("#update-body");
	const authorInput = document.querySelector<HTMLInputElement>("#update-author");

	const id = idInput?.value ?? "";
	const title = titleInput?.value ?? "";
	const body = bodyInput?.value ?? "";
	const author = authorInput?.value ?? "";

	const blog: {[key: string]: unknown} = {}

	if (title.length > 0) {
		blog.title = title;
	}

	if (body.length > 0) {
		blog.body = body;
	}

	if (author.length > 0) {
		blog.author = author;
	}

	const response = await fetch(`/blogs/${id}`, {
		method: "PUT",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(blog)
	});

	const response_text = await response.text();

	alert(response_text);
}

async function onBlogDeleteFormSubmit(): Promise<void> {
	const idInput = document.querySelector<HTMLInputElement>("#delete-id");

	const id = idInput?.value ?? "";

	const response = await fetch(`/blogs/${id}`, {
		method: "DELETE",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
	});

	const response_text = await response.text();

	alert(response_text);
}