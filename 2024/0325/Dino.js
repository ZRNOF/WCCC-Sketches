const Dino = (x, y, angle) => {
	Truchet(x, y, angle)
	const flipX = random([true, false])

	// Tooth
	layer({ x, y, angle, flipX }, () => {
		strokeWeight(STROKE_WEIGHT * 0.6)
		fill(DINO_TOOTH_COLOR)
		for (let i = 0; i < 4; i++) {
			shape(data.tooth, 0.15 + i * 0.05, 0.5, 0.25, 0)
			shape(data.tooth, 0.15 + i * 0.05, 0.67, 0.25, 180)
		}
	})

	// Body
	layer({ x, y, angle, flipX }, () => {
		fill(DINO_COLOR)
		shape(data.dino, 0.5, 0.5, 1, 0, false)
	})

	// Eye
	layer({ x, y, angle, flipX }, () => {
		fill(DINO_EYE_COLOR)
		Circle(0.53, 0.4, 0.25)
	})

	// Nose
	layer({ x, y, angle, flipX }, () => {
		strokeWeight(STROKE_WEIGHT * 0.7)
		fill(DINO_NOSE_COLOR)
		shape(data.tooth, 0.2, 0.35, 0.3, 180)
	})

	// Scar
	layer({ x, y, angle, flipX }, () => {
		fill(DINO_SCAR_COLOR)
		shape(data.scar, 0.53, 0.75, 0.5, 0)
	})

	// Tattoo
	layer({ x, y, angle, flipX }, () => {
		noStroke()
		fill(DINO_TATTOO_COLOR)
		// Order: eye, right body, left body
		for (let i = 0; i < 3; i++)
			shape(data.tattoo, 0.6 + i * 0.025, 0.55 - i * 0.025, 0.2, -30 * (i + 1))
		for (let i = 0; i < 5; i++)
			shape(data.tattoo, 0.625, 0.65 + i * 0.05, 0.25, -90)
		for (let i = 0; i < 3; i++)
			shape(data.tattoo, 0.4, 0.75 + 0.05 * i, 0.25, 90)
	})
}
