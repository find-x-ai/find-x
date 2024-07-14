export function splitText(text: string, maxLength: number = 1000, overlap: number = 50): string[] {
	if (text.length <= maxLength) {
		return [text];
	}

	const chunks: string[] = [];
	let start: number = 0;

	while (start < text.length) {
		let end: number = start + maxLength;

		if (end >= text.length) {
			chunks.push(text.slice(start));
			break;
		}

		// Find the last period or comma within the chunk
		let splitPoint: number = text.lastIndexOf('.', end);
		if (splitPoint <= start || splitPoint === -1) {
			splitPoint = text.lastIndexOf(',', end);
		}

		// If no suitable punctuation found, fall back to the last space
		if (splitPoint <= start || splitPoint === -1) {
			splitPoint = text.lastIndexOf(' ', end);
		}

		// If still no suitable split point, just split at maxLength
		if (splitPoint <= start || splitPoint === -1) {
			splitPoint = end;
		}

		chunks.push(text.slice(start, splitPoint + 1).trim());

		// Move to the next chunk without overlap
		start = splitPoint + 1;
	}

	return chunks;
}