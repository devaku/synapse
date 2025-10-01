export function formatDate(date: Date) {
	const pad = (n: any) => n.toString().padStart(2, '0');

	const month = pad(date.getMonth() + 1); // Months are 0-indexed
	const day = pad(date.getDate());
	const year = date.getFullYear().toString();
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${year}-${month}-${day} || ${hours}:${minutes}`;
}
