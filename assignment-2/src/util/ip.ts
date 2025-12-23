interface IpInfo {
	country: string;
	regionName: string;
	city: string;
	lat: number;
	lon: number;
}

export async function getIpInfo(ip: string): Promise<IpInfo | null> {
	const url = `http://ip-api.com/json/${ip}?fields=country,regionName,city,lat,lon`;

	const response = await fetch(url, {
		method: "GET",
	});

	if (!response.ok) {
		return null;
	}

	return response.json();
}