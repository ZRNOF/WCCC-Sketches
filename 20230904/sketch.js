// Crevice © 2023-09-04 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Break It Down 🔨 #WCCChallenge

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { mountGrid } from "./Grid.js"
import { vert, frag, filterFrag } from "./shader.js"
import { PaletteFrom } from "./tools.js"
import colorURLs from "./colorURLs.js"

mountFlex(p5)
mountGrid(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [600, 600]
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let Buffer, WebGL, Filter
	let theShader, theFilterShader

	// Grid System Params
	let gs
	const padding = 100
	const gap = 7
	const cols = p.random([1, 2, 3, 4, 5])
	const rows = p.random([1, 2, 3, 4, 5])
	const gridW = WIDTH - padding * 2
	const gridH = HEIGHT - padding * 2

	// Color
	const palette = PaletteFrom(p.random(colorURLs))
	const [bgColor, bdColor] = p.shuffle(["#E0E0E0", "#131313"])

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" }, canvas: { fit: p.SCALE_DOWN } })
		p.containerBgColor(51)
		p.parentBgColor(51)
		p.pixelDensity(PIXEL_DENSITY)
		p.rectMode(p.CENTER)

		Buffer = p.createGraphics(WIDTH, HEIGHT)
		WebGL = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		Filter = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)

		theShader = p.createShader(vert, frag)
		theFilterShader = p.createShader(vert, filterFrag)

		p.noStroke()
		Buffer.noStroke()
		WebGL.noStroke()
		Filter.noStroke()

		// Grid system
		gs = Buffer.Grid({ cols, rows, gridW, gridH })
	}

	p.draw = () => {
		p.background(bgColor)
		Buffer.background(bgColor)
		WebGL.clear()

		// Break Shader
		WebGL.shader(theShader)
		theShader.setUniform("tex0", Buffer)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
		theShader.setUniform("time", p.frameCount)
		theShader.setUniform("grid", [cols, rows])
		theShader.setUniform("gridSize", [gs.gridW, gs.gridH])
		WebGL.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		// Blocks
		Buffer.push()
		Buffer.translate(padding, padding)
		gs.generate(content)
		Buffer.pop()

		// Break Effect
		Buffer.image(WebGL, 0, 0)

		// Grain Filter
		Filter.shader(theFilterShader)
		theFilterShader.setUniform("tex0", Buffer)
		Filter.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		// Result
		p.image(Filter, 0, 0)
		Border(bdColor, 10)

		p.frameCount > 300 && p.noLoop()
	}

	const content = ({ id, w, h }) => {
		const rnd = Buffer.random

		Buffer.translate(w / 2, h / 2)
		Buffer.randomSeed(id * 1000)
		Buffer.fill(rnd(palette))
		Buffer.rectMode(p.CENTER)
		Buffer.imageMode(p.CENTER)

		const wid = w - gap * 2
		const hei = h - gap * 2

		if (cols === rows && rnd() < 0.2) Buffer.ellipse(0, 0, wid, hei)
		else {
			const radius = [
				rnd([0, 5, 10, 15, 20]),
				rnd([0, 5, 10, 15, 20]),
				rnd([0, 5, 10, 15, 20]),
				rnd([0, 5, 10, 15, 20]),
			]
			Buffer.rect(0, 0, wid, hei, ...radius)
		}
	}

	const Border = (color, weight) => {
		p.push()
		p.noFill()
		p.stroke(color)
		p.strokeWeight(weight * 2)
		p.rectMode(p.CENTER)
		p.rect(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT)
		p.pop()
	}
})
