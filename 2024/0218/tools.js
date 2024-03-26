/////////////////////////////////////////////
// Palette From URL /////////////////////////

/*
	// Extracts hex color codes array from a coolors.co or colorhunt.co URL
	// Example Usage:
	const url1 = "https://colorhunt.co/palette/2b3467bad7e9fcffe7eb455f";
	const url2 = "https://coolors.co/f8f9fa-c3c4c6-8d8f92-575a5e-212529";
	const colors1 = PaletteFrom(url1);
	const colors2 = PaletteFrom(url2);
	console.log(colors1); // ["#2b3467", "#bad7e9", "#fcffe7", "#eb455f"]
	console.log(colors2); // ["#f8f9fa", "#c3c4c6", "#8d8f92", "#575a5e", "#212529"]
*/
export const PaletteFrom = (URL) => {
	return URL.replace(/\/$/, "")
		.split("/")
		.pop()
		.replace(/[^a-fA-F0-9]/g, "")
		.match(/.{1,6}/g)
		.map((code) => `#${code}`)
}

/////////////////////////////////////////////
// CopyText /////////////////////////////////

export const CopyText = (text) => {
	let tempTextarea = document.createElement("textarea")
	tempTextarea.value = text
	document.body.appendChild(tempTextarea)
	tempTextarea.select()
	document.execCommand("copy")
	document.body.removeChild(tempTextarea)
}

/////////////////////////////////////////////
// limit Array Length ///////////////////////

export const limitArrayLength = (array, maxLength) => array.slice(0, maxLength)

/////////////////////////////////////////////
/////////////////////////////////////////////
