const Ellipse = (x, y, w, h) =>
	ellipse(x * CELL_SIZE, y * CELL_SIZE, w * CELL_SIZE, h * CELL_SIZE)

const Square = (x, y, s, t) =>
	square(x * CELL_SIZE, y * CELL_SIZE, s * CELL_SIZE, t * CELL_SIZE)

const Circle = (x, y, d) => circle(x * CELL_SIZE, y * CELL_SIZE, d * CELL_SIZE)

const Arc = (x, y, w, h, start, stop) =>
	arc(x * CELL_SIZE, y * CELL_SIZE, w * CELL_SIZE, h * CELL_SIZE, start, stop)

const alrToAngle = (arcLength, radius) => (arcLength / radius) * (180 / PI)

const shape = (nodes, posX, posY, size, angle, CLOSE = true) => {
	push()
	posX *= CELL_SIZE
	posY *= CELL_SIZE
	size *= CELL_SIZE
	translate(posX, posY)
	rotate(angle)
	beginShape()
	nodes.forEach(({ x, y }) => curveVertex(x * size, y * size))
	if (CLOSE) {
		curveVertex(nodes[0].x * size, nodes[0].y * size)
		curveVertex(nodes[1].x * size, nodes[1].y * size)
		curveVertex(nodes[2].x * size, nodes[2].y * size)
	}
	endShape()
	pop()
}

const outline = (nodes, posX, posY, size, angle) => {
	push()
	posX *= CELL_SIZE
	posY *= CELL_SIZE
	size *= CELL_SIZE
	translate(posX, posY)
	rotate(angle)
	noFill()
	beginShape()
	nodes.forEach(({ x, y }) => curveVertex(x * size, y * size))
	endShape()
	pop()
}

const layer = ({ x, y, angle, flipX }, callback) => {
	push()
	translate(x, y)
	translate(CELL_SIZE / 2, CELL_SIZE / 2)
	rotate(angle)
	if (flipX) scale(-1, 1)
	translate(-CELL_SIZE / 2, -CELL_SIZE / 2)
	callback()
	pop()
}

const setPalette = (palette) => {
	;[FG_COLOR, BG_COLOR, STROKE_COLOR] = palette

	DECORATION_COLOR = FG_COLOR
	DECORATION_DOT_COLOR = BG_COLOR

	TRUCHET_COLOR = FG_COLOR
	TRUCHET_FEATHER_COLOR = BG_COLOR
	TRUCHET_FEATHER_DOT_COLOR = FG_COLOR
	TRUCHET_ZIGZAG_COLOR = BG_COLOR
	TRUCHET_ZIGZAG_DOTS_COLOR = BG_COLOR
	TRUCHET_CREST_SHORT_COLOR = BG_COLOR
	TRUCHET_CREST_LONG_COLOR = BG_COLOR
	TRUCHET_ARC_COLOR = BG_COLOR

	DINO_COLOR = FG_COLOR
	DINO_EYE_COLOR = BG_COLOR
	DINO_NOSE_COLOR = BG_COLOR
	DINO_TOOTH_COLOR = FG_COLOR
	DINO_SCAR_COLOR = BG_COLOR
	DINO_TATTOO_COLOR = STROKE_COLOR

	HUMAN_COLOR = FG_COLOR
	HUMAN_EYE_COLOR = BG_COLOR
	HUMAN_IRIS_COLOR = FG_COLOR
	HUMAN_NOSE_COLOR = BG_COLOR
	HUMAN_MOUTH_COLOR = BG_COLOR
	HUMAN_TATTOO_COLOR = STROKE_COLOR

	SKULL_COLOR = FG_COLOR
	SKULL_EYE_COLOR = STROKE_COLOR
	SKULL_TUBE_COLOR = FG_COLOR
	SKULL_CROSS_COLOR = FG_COLOR
	SKULL_CUBE_COLOR = FG_COLOR
}

const normalTruchet = (x, y, angle) => {
	layer({ x, y, angle }, () => {
		fill(FG_COLOR)
		arc(0, 0, arcLG, arcLG, 0, 90)
		fill(BG_COLOR)
		arc(0, 0, arcSM, arcSM, 0, 90)
	})

	layer({ x, y, angle }, () => {
		crest(arcLG)
	})
}
