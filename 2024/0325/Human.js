const Human = (x, y, angle) => {
	// Background
	layer({ x, y, angle }, () => {
		noStroke()
		fill(BG_COLOR)
		square(0, 0, 1)
	})

	// Top of Head
	layer({ x, y, angle }, () => {
		fill(HUMAN_COLOR)
		let h = (arcLG - arcSM) / 3
		arc(CELL_SIZE / 2, 0, (arcLG - arcSM) / 2, h, 0, 180)
		if (random() < 0.5) paw()
	})

	// Right Face
	layer({ x, y, angle: angle + 180 }, () => {
		fill(HUMAN_COLOR)
		arc(0, 0, arcLG, arcLG, 0, 90)
		fill(BG_COLOR)
		arc(0, 0, arcSM, arcSM, 0, 90)
	})

	// Left Face
	layer({ x, y, angle: angle + 270 }, () => {
		fill(HUMAN_COLOR)
		arc(0, 0, arcLG, arcLG, 0, 90)
		fill(BG_COLOR)
		arc(0, 0, arcSM, arcSM, 0, 90)
	})

	// Right Face (show outline)
	layer({ x, y, angle: angle + 180 }, () => {
		noFill()
		arc(0, 0, arcLG, arcLG, 0, 90)
		arc(0, 0, arcSM, arcSM, 0, 90)
	})

	// 人中 :p
	layer({ x, y, angle }, () => {
		fill(STROKE_COLOR)
		strokeWeight(STROKE_WEIGHT * 0.1)
		shape(data.tattoo, 0.5, 0.7, 0.2, 0)
	})

	// Tattoo
	layer({ x, y, angle }, () => {
		fill(HUMAN_TATTOO_COLOR)
		strokeWeight(STROKE_WEIGHT)

		for (let i = 0; i < 2; i++) {
			const dir = -(i * 2 - 1)
			// under eyes
			shape(data.tattoo, abs(0.25 - i), 0.35, 1, 0 * dir)
			shape(data.tattoo, abs(0.175 - i), 0.5, 0.5, 90 * dir)
			shape(data.tattoo, abs(0.175 - i), 0.425, 0.5, 90 * dir)
			// under face
			shape(data.tattoo, abs(0.2 - i), 0.8, 0.4, -150 * dir)
			shape(data.tattoo, abs(0.15 - i), 0.75, 0.4, -150 * dir)
			shape(data.tattoo, abs(0.1 - i), 0.7, 0.4, -150 * dir)
		}
	})

	// Eyes
	layer({ x, y, angle }, () => {
		fill(HUMAN_EYE_COLOR)
		shape(data.eye, 0.25, 0.3, 0.3, 180)
		shape(data.eye, 0.75, 0.3, 0.3, 180)
		fill(HUMAN_IRIS_COLOR)
		Circle(0.25, 0.3, 0.1)
		Circle(0.75, 0.3, 0.1)
		fill(HUMAN_NOSE_COLOR)
		shape(data.nose, 0.5, 0.5, 0.5, 0)
	})

	// Mouth
	layer({ x, y, angle }, () => {
		fill(HUMAN_MOUTH_COLOR)
		strokeWeight(STROKE_WEIGHT * 0.5)
		shape(data.mouthFill, 0.5, 0.8, 0.3, 0)
		strokeWeight(STROKE_WEIGHT)
		outline(data.mouth, 0.5, 0.8, 0.3, 0)
		noFill()
		Arc(0.5, 0.93, 0.1, 0.03, 210, 330)
	})

	// Decoration
	fstDecorate(x, y, angle)
	secDecorate(x, y, angle)
}
