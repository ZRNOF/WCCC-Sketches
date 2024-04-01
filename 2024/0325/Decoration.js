const threeDots = (x, y, angle, size) => {
	const sm = CELL_SIZE * (0.5 / 3)
	const lg = CELL_SIZE * (1 / 3)
	const md = sm + (lg - sm) * 0.5

	let r = md / 2
	let al = (r * TAU) / 4
	let amount = 3
	let firstPoint = alrToAngle(al / (amount * 2), r)
	let d = dist(r, 0, cos(firstPoint) * r, sin(firstPoint) * r)
	d -= STROKE_WEIGHT / 2

	layer({ x, y, angle: angle + 90 }, () => {
		for (let i = 0; i < amount; i++) {
			push()
			const t = alrToAngle((al / (amount * 2)) * (i * 2 + 1), r)
			translate(cos(t) * r, sin(t) * r)
			rotate(t)
			fill(DECORATION_DOT_COLOR)
			Circle(0, 0, size)
			pop()
		}
	})

	layer({ x, y, angle: angle + 270 }, () => {
		for (let i = 0; i < amount; i++) {
			push()
			const t = alrToAngle((al / (amount * 2)) * (i * 2 + 1), r)
			translate(cos(t) * r, sin(t) * r)
			rotate(t)
			fill(DECORATION_DOT_COLOR)
			Circle(0, 0, size)
			pop()
		}
	})
}

const threeBalls = (x, y, angle, size) => {
	const sm = CELL_SIZE * (0.5 / 3)
	const lg = CELL_SIZE * (1 / 3)
	const md = sm + (lg - sm) * 0.5

	let r = md / 2
	let al = (r * TAU) / 4
	let amount = 3
	let firstPoint = alrToAngle(al / 3, r)
	let d = dist(r, 0, cos(firstPoint) * r, sin(firstPoint) * r)
	d += STROKE_WEIGHT

	fill(DECORATION_COLOR)

	layer({ x, y, angle: angle + 90 }, () => {
		for (let i = 0; i < amount; i++) {
			push()
			const t = alrToAngle((al / (amount - 1)) * i, r)
			translate(cos(t) * r, sin(t) * r)
			rotate(t)
			if (i === 0) arc(0, 0, d, d, 0, 180)
			if (i === 1) arc(0, 0, d, d, 0, 360)
			if (i === 2) arc(0, 0, d, d, 180, 0)
			pop()
		}
	})

	layer({ x, y, angle: angle + 270 }, () => {
		for (let i = 0; i < amount; i++) {
			push()
			const t = alrToAngle((al / (amount - 1)) * i, r)
			translate(cos(t) * r, sin(t) * r)
			rotate(t)
			if (i === 0) arc(0, 0, d, d, 0, 180)
			if (i === 1) arc(0, 0, d, d, 0, 360)
			if (i === 2) arc(0, 0, d, d, 180, 0)
			pop()
		}
	})
}

const cornerRing = (x, y, angle, type) => {
	layer({ x, y, angle }, () => {
		const sm = 0.5 / 3
		const lg = 1 / 3
		if (type === "first") {
			fill(DECORATION_COLOR)
			Arc(1, 0, lg, lg, 90, 180)
			Arc(0, 1, lg, lg, 270, 360)
			fill(BG_COLOR)
			Arc(1, 0, sm, sm, 90, 180)
			Arc(0, 1, sm, sm, 270, 360)
		}
		if (type === "second") {
			fill(DECORATION_COLOR)
			Arc(0, 0, lg, lg, 0, 90)
			Arc(1, 1, lg, lg, 180, 270)
			fill(BG_COLOR)
			Arc(0, 0, sm, sm, 0, 90)
			Arc(1, 1, sm, sm, 180, 270)
		}
	})
}

const fstDecorate = (x, y, angle) => {
	if (random() < 0.5) {
		cornerRing(x, y, angle, "first")
		if (random() < 0.5) threeDots(x, y, angle, 0.025)
	} else threeBalls(x, y, angle, 0.025)
}

const secDecorate = (x, y, angle) => {
	if (random() < 0.5) {
		cornerRing(x, y, angle, "second")
		if (random() < 0.5) threeDots(x, y, angle + 90, 0.025)
	} else threeBalls(x, y, angle + 90, 0.025)
}
