// 圖騰 © 2024-03-25 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Chalchiuhtlicue (or Mesoamerican design) 🌽 #WCCChallenge
//
// Play with Truchet tiles this week. (*•̀ㅂ•́)و
//
// The color tab can edit the color for most units. :)
// I don't want to color it today, maybe tomorrow. :p
//
// Canvas size:
//     width:  COLS * CELL_SIZE * PIXEL_DENSITY
//     height: ROWS * CELL_SIZE * PIXEL_DENSITY

const [COLS, ROWS] = [10, 5]
const CELL_SIZE = 60
const PIXEL_DENSITY = 4

const [WIDTH, HEIGHT] = [COLS * CELL_SIZE, ROWS * CELL_SIZE]
const SQRT2 = 1.41421356237
const STROKE_WEIGHT = CELL_SIZE / 60
const MAIN_AREA_SCALE = 1.5
const arcSM = (CELL_SIZE / 3) * (3 - MAIN_AREA_SCALE)
const arcLG = (CELL_SIZE / 3) * (3 + MAIN_AREA_SCALE)
const grid = Array.from({ length: ROWS }, () => Array(COLS))

function setup() {
	createCanvas(WIDTH, HEIGHT)
	flex({ container: { width: "95%", height: "95%" } })
	pixelDensity(PIXEL_DENSITY)
	angleMode(DEGREES)

	setPalette(random(palettes))
	stroke(STROKE_COLOR)
	strokeWeight(STROKE_WEIGHT)
	background(BG_COLOR)

	for (let y = 0; y < ROWS; y++) {
		for (let x = 0; x < COLS; x++) {
			grid[y][x] = random([Truchet, Dino, Human, Skull])
			if (x >= 1 && grid[y][x - 1] === Skull)
				grid[y][x] = random([Truchet, Dino, Human])
			if (y >= 1 && grid[y - 1][x] === Skull)
				grid[y][x] = random([Truchet, Dino, Human])

			let angle = random([0, 90, 180, 270])
			const posX = x * (WIDTH / COLS)
			const posY = y * (HEIGHT / ROWS)
			grid[y][x](posX, posY, angle)
		}
	}
}
