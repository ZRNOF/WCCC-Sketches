export const floor = (value) => Math.floor(value)

export const ceil = (value) => Math.ceil(value)

export const random = (min = 0, max = 1) => Math.random() * (max - min) + min

export const getRandomImage = () => {
	const imageList = [
		"Rain_Window_01.jpg",
		"Flower_01.jpg",
		"Flower_03.jpg",
		"Sheet_Music_01.jpg",
		"Sunset_01.jpg",
		"Sunset_02.jpg",
		"Piano_01.jpg",
		"Plant_01.jpg",
		"Beimen_Crystal_Church_01.jpg",
		"The_Dome_of_Light_02.jpg",
		"The_Dome_of_Light_01.jpg",
		"Centipede_01.jpg",
	]
	const index = floor(random(0, imageList.length))
	const filename = imageList[index]
	return `https://raw.githubusercontent.com/ZRNOF/Photos-for-image-processing/main/Package/${filename}`
}
