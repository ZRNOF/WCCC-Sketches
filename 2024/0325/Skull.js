const drawSkull = (x, y, angle) => {
	// Body
	layer({ x, y, angle }, () => {
		fill(SKULL_COLOR)
		shape(data.skull, 0.5, 0, 1, 0, false)
	})

	// Eye
	layer({ x, y, angle }, () => {
		if (random() < 0.75) fill(SKULL_EYE_COLOR)
		else fill(BG_COLOR)
		shape(data.skullEye, 0.39, 0.07, 0.35, 0)
	})
	layer({ x, y, angle, flipX: true }, () => {
		if (random() < 0.75) fill(SKULL_EYE_COLOR)
		else fill(BG_COLOR)
		shape(data.skullEye, 0.39, 0.07, 0.35, 0)
	})

	// Nose
	layer({ x, y, angle }, () => {
		strokeWeight(STROKE_WEIGHT * 0.75)
		shape(data.tattoo, 0.49, 0.15, 0.15, 180)
		shape(data.tattoo, 0.51, 0.15, 0.15, 180)
	})
}

const paw = () => {
	shape(data.tooth, 0.69, 0.09, 0.5, -35)
	shape(data.tooth, 0.6, 0.14, 0.5, -20)
	shape(data.tooth, 0.5, 0.15, 0.5, 0)
	shape(data.tooth, 0.4, 0.14, 0.5, 20)
	shape(data.tooth, 0.31, 0.09, 0.5, 35)
}

const end = (x, y, angle) => {
	layer({ x, y, angle }, () => {
		let h = (arcLG - arcSM) / 3
		fill(FG_COLOR)
		arc(CELL_SIZE / 2, 0, (arcLG - arcSM) / 2, h, 0, 180)
		if (random() < 0.8) paw()
	})
}

const cross = (x, y, angle) => {
	layer({ x, y, angle: angle + 45 }, () => {
		fill(SKULL_CROSS_COLOR)
		Ellipse(0.5, 0.5, 0.5, 0.1)
		Ellipse(0.5, 0.5, 0.1, 0.5)
	})
}

const tube = (x, y, angle) => {
	layer({ x, y, angle }, () => {
		strokeCap(SQUARE)
		fill(SKULL_TUBE_COLOR)
		Arc(0, 0, 1.15, 1.15, 5, 85)
		fill(BG_COLOR)
		Arc(0, 0, 0.85, 0.85, 2, 88)
	})

	layer({ x, y, angle: angle + 180 }, () => {
		strokeCap(SQUARE)
		fill(SKULL_TUBE_COLOR)
		Arc(0, 0, 1.15, 1.15, 5, 85)
		fill(BG_COLOR)
		Arc(0, 0, 0.85, 0.85, 2, 88)
	})
}

const radiance = (x, y, angle) => {
	layer({ x, y, angle }, () => {
		fill(STROKE_COLOR)
		strokeWeight(STROKE_WEIGHT)
		shape(data.tattoo, 0.425, 0.575, 0.5, 45)
		shape(data.tattoo, 0.575, 0.575, 0.5, -45)
		shape(data.tattoo, 0.425, 0.425, 0.5, 135)
		shape(data.tattoo, 0.575, 0.425, 0.5, -135)
	})
}

const cube = (x, y, angle) => {
	layer({ x, y, angle: 45 }, () => {
		rectMode(CENTER)
		fill(SKULL_CUBE_COLOR)
		Square(0.5, 0.5, 0.12, 0.015)
	})
	if (random() < 0.5) radiance(x, y, 0)
}

const Skull = (x, y, angle) => {
	cube(x, y, angle)

	random([cross, tube])(x, y, angle)
	if (random() < 0.5) tube(x, y, angle + 90)

	random([drawSkull, end])(x, y, 0)
	random([drawSkull, end])(x, y, 90)
	random([drawSkull, end])(x, y, 180)
	random([drawSkull, end])(x, y, 270)

	fstDecorate(x, y, angle)
	secDecorate(x, y, angle)
}
