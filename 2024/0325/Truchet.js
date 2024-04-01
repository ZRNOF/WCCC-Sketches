const crest = (arcLG) => {
	const r = arcLG / 2
	const al = (r * TAU) / 4
	const amount = 5
	const firstPoint = alrToAngle(al / (amount * 2), r)
	let d = dist(r, 0, cos(firstPoint) * r, sin(firstPoint) * r)
	d -= STROKE_WEIGHT / 2

	const type = random(["short", "mix"])
	const mouthRange = 97
	for (let i = 0; i < amount; i++) {
		push()
		const t = alrToAngle((al / (amount * 2)) * (i * 2 + 1), r)
		translate(cos(t) * r * 0.9, sin(t) * r * 0.9)
		rotate(t)

		switch (type) {
			case "short":
				fill(TRUCHET_CREST_SHORT_COLOR)
				strokeCap(SQUARE)
				arc(0, 0, d / 4, d, -mouthRange, mouthRange)
				strokeCap(ROUND)
				arc(0, 0, r * 0.45, d, mouthRange - 5, -(mouthRange - 5))
				break
			case "mix":
				fill(i % 2 === 0 ? TRUCHET_CREST_SHORT_COLOR : TRUCHET_CREST_LONG_COLOR)
				strokeCap(SQUARE)
				arc(0, 0, d / 4, d, -mouthRange, mouthRange)
				strokeCap(ROUND)
				if (i % 2 === 0) arc(0, 0, r * 0.45, d, mouthRange, -mouthRange)
				else arc(0, 0, r * 0.9, d, mouthRange, -mouthRange)
				break
		}
		pop()
	}

	if (type === "short") {
		push()
		noFill()
		const shift = 12.5
		const st = 0 + shift
		const ed = 90 - shift
		arc(0, 0, arcLG * 0.45, arcLG * 0.45, st, ed)
		arc(0, 0, arcLG * 0.55, arcLG * 0.55, st, ed)
		circle(
			cos(st) * arcLG * 0.25,
			sin(st) * arcLG * 0.25,
			arcLG * 0.5 - arcLG * 0.45
		)
		circle(
			cos(ed) * arcLG * 0.25,
			sin(ed) * arcLG * 0.25,
			arcLG * 0.5 - arcLG * 0.45
		)
		stroke(TRUCHET_ARC_COLOR)
		strokeWeight(arcLG * 0.5 - arcLG * 0.45 - STROKE_WEIGHT * 0.975)
		arc(0, 0, arcLG * 0.5, arcLG * 0.5, st, ed)
		pop()
	}
}

const backFeathers = (arcLG) => {
	push()
	fill(BG_COLOR)
	let r = arcLG / 2
	let al = (r * TAU) / 4
	let amount = 4
	let firstPoint = alrToAngle(al / (amount * 2), r)
	let d = dist(r, 0, cos(firstPoint) * r, sin(firstPoint) * r)
	d -= STROKE_WEIGHT / 2
	for (let i = 0; i < amount; i++) {
		push()
		const t = alrToAngle((al / (amount * 2)) * (i * 2 + 1), r)
		translate(cos(t) * r, sin(t) * r)
		rotate(t)
		const mouthRange = 97
		fill(TRUCHET_FEATHER_COLOR)
		arc(0, 0, d * 3, d * 2, -mouthRange, mouthRange)
		fill(TRUCHET_FEATHER_DOT_COLOR)
		circle(d / 1.5, 0, d / 1.5)
		pop()
	}
	pop()
}

const zigzag = (posX, posY, angle) => {
	push()
	const rot = random([90, 270])
	const trans = (CELL_SIZE / 2 / SQRT2) * (rot === 90 ? 0.98 : 0.93)
	translate(trans, trans)
	rotate(rot)
	fill(TRUCHET_ZIGZAG_COLOR)
	shape(data.zigzag, 0, 0, 0.65, 0)
	fill(TRUCHET_ZIGZAG_DOTS_COLOR)
	Circle(-0.086667, 0.086667, 0.108334)
	Circle(-0.086667, -0.216667, 0.108334)
	Circle(0.216667, 0.086667, 0.108334)
	pop()
}

const drawTruchet = (x, y, angle, order) => {
	if (order === "first") fstDecorate(x, y, angle)

	layer({ x, y, angle }, () => {
		const mainArea = (arcLG - arcSM) / 2
		if (random() < 0.5) backFeathers(arcLG)
		fill(TRUCHET_COLOR)
		arc(0, 0, arcLG, arcLG, 0, 90)
		fill(BG_COLOR)
		arc(0, 0, arcSM, arcSM, 0, 90)
		if (random() < 0.5) zigzag(x, y, angle)
		else crest(arcLG)
	})

	if (order === "second") secDecorate(x, y, angle)
}

const Truchet = (posX, posY, angle) => {
	drawTruchet(posX, posY, angle, "first")
	drawTruchet(posX, posY, angle + 180, "second")
}
