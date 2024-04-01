// WCCChallenge Poster © 2024-03-17 by Zaron Chen is licensed under CC BY 3.0. To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/
// Swiss Design 🧀 #WCCChallenge

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import mountShadow from "./Shadow.js"
import FRAG from "./shader.js"
import { PALETTE, PRESET, SHAPES, MESSAGE, LINKS } from "./data.js"

mountFlex(p5)
mountShadow(p5)

new p5((p) => {
	const POSTER_WIDTH = 600
	const POSTER_HEIGHT = 800
	const CANVAS_SIZE = POSTER_HEIGHT * 1.2

	const [bgColor, fgColor, colorA, colorB] = p.random(PALETTE)

	const PADDING = 100
	const HALF_PADDING = PADDING / 2
	let GRID

	const gfx = p.createGraphics(POSTER_WIDTH, POSTER_HEIGHT)
	let filterShader

	p.setup = () => {
		p.createCanvas(CANVAS_SIZE, CANVAS_SIZE)
		p.flex()

		gfx.background(bgColor)
		gfx.noStroke()
		gfx.textFont("Verdana")

		filterShader = p.createFilterShader(FRAG)

		p.random([
			showWCCCPattern,
			showBirbPattern,
			showWCCCGrid,
			showSquaresGrid,
			showCirclesGrid,
			showDiamondsGrid,
			showMixGrid,
		])()

		p.background("#f5f5f5")
		showWCCCFullNameText()
		showLinksText()
		showBirbsText()
		showFooterText()

		p.shadow("#000", 100, 50, 50)
		p.imageMode(p.CENTER)
		p.image(gfx, CANVAS_SIZE / 2, CANVAS_SIZE / 2, POSTER_WIDTH, POSTER_HEIGHT)

		p.noShadow()
		p.imageMode(p.CORNER)
		p.filter(filterShader)
	}

	/////////////////////////////////////////////
	// CREATE 2D ARRAY //////////////////////////

	const array2D = (rows, cols, initValue) =>
		Array.from({ length: rows }, () => Array(cols).fill(initValue))

	/////////////////////////////////////////////
	// SHOW PRESET PATTERN FUNCTION /////////////

	const initGridForPreset = (type) => {
		const props = {}
		props.WIDTH = POSTER_WIDTH - PADDING
		props.ROWS = 11
		props.COLS = 12
		props.CELL_SIZE = props.WIDTH / props.COLS
		props.HEIGHT = props.CELL_SIZE * props.ROWS
		props.tx = 50
		props.ty = 50
		props.data = PRESET[type]
		return props
	}

	const showPresetPattern = (type) => {
		GRID = initGridForPreset(type)

		gfx.push()
		gfx.translate(GRID.tx, GRID.ty)
		GRID.data.forEach((row, y) => {
			row.forEach((col, x) => {
				const clr = col === 0 ? colorA : bgColor
				gfx.stroke(clr)
				gfx.fill(clr)
				gfx.square(x * GRID.CELL_SIZE, y * GRID.CELL_SIZE, GRID.CELL_SIZE)
			})
		})
		gfx.pop()
	}

	/////////////////////////////////////////////
	// SHOW WCCC MOSAIC /////////////////////////

	const showWCCCPattern = () => showPresetPattern(p.random(["WCCCa", "WCCCb"]))

	/////////////////////////////////////////////
	// SHOW BIRB MOSAIC /////////////////////////

	const showBirbPattern = () => showPresetPattern("BIRB")

	/////////////////////////////////////////////
	// SHOW GRID FUNCTION ///////////////////////

	const initGridForGrid = () => {
		const props = {}
		props.WIDTH = POSTER_WIDTH - PADDING
		props.HEIGHT = props.WIDTH
		props.ROWS = gfx.random([3, 4, 5])
		props.COLS = props.ROWS
		props.CELL_SIZE = props.WIDTH / props.COLS
		props.tx = 50
		props.ty = 50
		props.data = array2D(props.ROWS, props.COLS, 0)
		return props
	}

	const showGrid = (callback) => {
		GRID = initGridForGrid()

		gfx.push()
		gfx.translate(GRID.tx, GRID.ty)
		GRID.data.forEach((row, y) =>
			row.forEach((_, x) => {
				const posX = x * GRID.CELL_SIZE + GRID.CELL_SIZE / 2
				const posY = y * GRID.CELL_SIZE + GRID.CELL_SIZE / 2
				callback(posX, posY)
			})
		)
		gfx.pop()
	}

	/////////////////////////////////////////////
	// CIRCLES GRID /////////////////////////////

	const circle = (posX, posY, color, size) => {
		gfx.push()
		gfx.fill(color)
		gfx.circle(posX, posY, size)
		gfx.pop()
	}

	const showCirclesGrid = () =>
		showGrid((posX, posY) =>
			circle(posX, posY, gfx.random([colorA, colorB]), GRID.CELL_SIZE)
		)

	/////////////////////////////////////////////
	// SQUARES GRID /////////////////////////////

	const square = (posX, posY, color, size) => {
		gfx.push()
		gfx.fill(color)
		gfx.rectMode(gfx.CENTER)
		gfx.translate(posX, posY)
		gfx.angleMode(gfx.DEGREES)
		gfx.rotate(0)
		gfx.square(0, 0, size)
		gfx.pop()
	}

	const showSquaresGrid = () =>
		showGrid((posX, posY) =>
			square(posX, posY, gfx.random([colorA, colorB]), GRID.CELL_SIZE * 0.85)
		)

	/////////////////////////////////////////////
	// DIAMONDS GRID ////////////////////////////

	const diamond = (posX, posY, color, size) => {
		const SQRT_2 = 1.41421356237
		gfx.push()
		gfx.fill(color)
		gfx.rectMode(gfx.CENTER)
		gfx.translate(posX, posY)
		gfx.angleMode(gfx.DEGREES)
		gfx.rotate(45)
		gfx.square(0, 0, size * SQRT_2 * 0.5)
		gfx.pop()
	}

	const showDiamondsGrid = () =>
		showGrid((posX, posY) =>
			diamond(posX, posY, gfx.random([colorA, colorB]), GRID.CELL_SIZE, 45)
		)

	/////////////////////////////////////////////
	// CIRCLES + SQUARES + DIAMONDS GRID ////////

	const showMixGrid = () =>
		showGrid((posX, posY) => {
			const SCALE = 0.85
			const SIZE = GRID.CELL_SIZE * SCALE
			const props = [posX, posY, gfx.random([colorA, colorB]), SIZE]
			gfx.random([circle, square, diamond])(...props)
		})

	/////////////////////////////////////////////
	// WCCC GRID ////////////////////////////////

	const W = (posX, posY, color, size) => {
		gfx.push()
		gfx.translate(posX, posY)
		gfx.scale(size)
		gfx.noStroke()
		gfx.fill(color)
		gfx.beginShape()
		SHAPES.W.forEach(({ x, y }) => gfx.vertex(x, y))
		gfx.endShape()
		gfx.pop()
	}

	const C = (posX, posY, color, size) => {
		gfx.push()
		gfx.angleMode(gfx.DEGREES)
		gfx.translate(posX, posY)
		gfx.fill(color)
		gfx.arc(0, 0, 1 * size, 1 * size, 30, 330)
		gfx.fill(bgColor)
		gfx.circle(0, 0, 0.5 * size)
		gfx.pop()
	}

	const showWCCCGrid = () =>
		showGrid((posX, posY) =>
			gfx.random() < 0.5
				? W(posX, posY, colorA, GRID.CELL_SIZE)
				: C(posX, posY, colorB, GRID.CELL_SIZE)
		)

	/////////////////////////////////////////////
	// SHOW TEXT FUNCTION ///////////////////////

	const showText = ({ text, posX, posY, color, size, align } = {}) => {
		gfx.push()
		gfx.fill(color)
		gfx.textSize(size)
		gfx.textAlign(...align)
		gfx.text(text, posX, posY)
		gfx.pop()
	}

	/////////////////////////////////////////////
	// SHOW WCCC FULL NAME //////////////////////

	const showWCCCFullNameText = () => {
		const TEXT_SIZE = 25
		showText({
			text: MESSAGE.WCCCFullName,
			posX: POSTER_WIDTH - HALF_PADDING,
			posY: GRID.HEIGHT + PADDING,
			color: fgColor,
			size: TEXT_SIZE,
			align: [gfx.RIGHT, gfx.CENTER],
		})
	}

	/////////////////////////////////////////////
	// SHOW LINKS ///////////////////////////////

	const showLinksText = () => {
		const TEXT_SIZE = 13
		const WCCC_SIZE = 25
		showText({
			text: LINKS.OpenProcessing,
			posX: POSTER_WIDTH - HALF_PADDING,
			posY: GRID.HEIGHT + PADDING + WCCC_SIZE,
			color: fgColor,
			size: TEXT_SIZE,
			align: [gfx.RIGHT, gfx.CENTER],
		})
		showText({
			text: LINKS.Discord,
			posX: POSTER_WIDTH - HALF_PADDING,
			posY: GRID.HEIGHT + PADDING + WCCC_SIZE + 20,
			color: fgColor,
			size: TEXT_SIZE,
			align: [gfx.RIGHT, gfx.CENTER],
		})
		showText({
			text: LINKS.Twitch,
			posX: POSTER_WIDTH - HALF_PADDING,
			posY: GRID.HEIGHT + PADDING + WCCC_SIZE + 40,
			color: fgColor,
			size: TEXT_SIZE,
			align: [gfx.RIGHT, gfx.CENTER],
		})
	}

	/////////////////////////////////////////////
	// SHOW BIRBS TEXT //////////////////////////

	const showBirbsText = () => {
		const TEXT_SIZE = 20
		const TO_FOOTER = 10
		const STEP = 25
		const TIMES = p.random() > 0.1 ? 3 : 30
		for (let i = 1; i <= TIMES; i++)
			showText({
				text: p.random([MESSAGE.Birb, MESSAGE.Birb, MESSAGE.Join]), // :)
				posX: HALF_PADDING + gfx.random([0, 25, 50]),
				posY: POSTER_HEIGHT - HALF_PADDING - TO_FOOTER - STEP * i,
				color: fgColor,
				size: TEXT_SIZE,
				align: [gfx.LEFT, gfx.CENTER],
			})
	}

	/////////////////////////////////////////////
	// SHOW FOOTER TEXT /////////////////////////

	const showFooterText = () => {
		const TEXT_SIZE = 20
		showText({
			text: MESSAGE.Swiss,
			posX: HALF_PADDING,
			posY: POSTER_HEIGHT - HALF_PADDING,
			color: fgColor,
			size: TEXT_SIZE,
			align: [gfx.LEFT, gfx.CENTER],
		})
		showText({
			text: MESSAGE.Cheese,
			posX: POSTER_WIDTH / 2,
			posY: POSTER_HEIGHT - HALF_PADDING,
			color: fgColor,
			size: TEXT_SIZE,
			align: [gfx.CENTER, gfx.CENTER],
		})
		showText({
			text: MESSAGE.WCCCTag,
			posX: POSTER_WIDTH - HALF_PADDING,
			posY: POSTER_HEIGHT - HALF_PADDING,
			color: fgColor,
			size: TEXT_SIZE,
			align: [gfx.RIGHT, gfx.CENTER],
		})
	}

	// END //////////////////////////////////////
	/////////////////////////////////////////////
})
