// Ocean © 2023-03-26 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Azulejos 💠 #WCCChallenge

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { vert, frag } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	const colors = ["#222222", "#1C5D99", "#639FAB", "#BBCDE5", "#FFFFFF"]
	const [WIDTH, HEIGHT] = [600, 600]
	const PIXEL_DENSITY = 2
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let cnv, gfx, theShader

	// cell size
	const SIZE = 100

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" }, canvas: { fit: p.SCALE_DOWN } })
		p.containerBgColor(51)
		p.parentBgColor(51)
		p.pixelDensity(PIXEL_DENSITY)

		cnv = p.createGraphics(p.width, p.height)
		gfx = p.createGraphics(p.width, p.height, p.WEBGL)

		theShader = p.createShader(vert, frag)

		p.noStroke()
		cnv.noStroke()
		gfx.noStroke()

		// Ocean
		const bc = p.random(colors) // background color
		let wc = p.random(colors) // wave color
		while (bc === wc) wc = p.random(colors)
		cnv.background(bc)

		for (let x = 0; x <= p.width; x += SIZE) {
			for (let y = 0; y <= p.height; y += SIZE) {
				wc = p.random(colors)
				while (bc === wc) wc = p.random(colors)
				if (p.random(0, 1) < 0.05 && bc != "#639FAB") wc = "#FF8275"
				wave(x, y, wc)
			}
		}
	}

	p.draw = () => {
		gfx.shader(theShader)
		theShader.setUniform("tex0", cnv)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
		theShader.setUniform("time", p.frameCount / 60)
		theShader.setUniform("grid", [p.width / SIZE, p.height / SIZE])
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		p.image(gfx, 0, 0)
	}

	const wave = (posx, posy, clr) => {
		cnv.push()
		cnv.fill(clr)
		cnv.translate(posx, posy)
		const a = SIZE / 2
		const b = SIZE / 4

		cnv.beginShape()
		for (let x = 0; x <= SIZE / 2; x += 0.1) {
			const y = -p.sqrt(b * b * (1 - (x / a) * (x / a)))
			cnv.vertex(x + SIZE / 2, y + SIZE / 4)
		}
		for (let x = SIZE / 2; x >= 0; x -= 0.1) {
			const y = p.sqrt(b * b * (1 - (x / a) * (x / a)))
			cnv.vertex(x + SIZE / 2, y + SIZE / 4)
		}
		for (let i = p.TWO_PI; i >= p.HALF_PI + p.PI; i -= 0.01) {
			const r = SIZE / 2
			const x = p.cos(i) * r
			const y = p.sin(i) * r
			cnv.vertex(x + 0, y + SIZE / 2)
		}
		cnv.endShape()

		cnv.beginShape()
		for (let i = 0; i >= -p.PI; i -= 0.01) {
			const r = SIZE / 4
			const x = p.cos(i) * r
			const y = p.sin(i) * r
			cnv.vertex(x + SIZE / 4, y + SIZE / 2)
		}
		for (let x = -SIZE / 2; x <= 0; x += 0.1) {
			const y = -p.sqrt(b * b * (1 - (x / a) * (x / a)))
			cnv.vertex(x + SIZE / 2, y + (SIZE / 4) * 3)
		}
		cnv.endShape(p.CLOSE)

		cnv.beginShape()
		cnv.vertex(0, SIZE)
		for (let x = -SIZE / 2; x <= 0; x += 0.1) {
			const y = +p.sqrt(b * b * (1 - (x / a) * (x / a)))
			p.vertex(x + SIZE / 2, y + (SIZE / 4) * 3)
		}
		cnv.endShape(p.CLOSE)

		cnv.beginShape()
		for (let i = 0; i <= p.PI; i += 0.01) {
			const r = SIZE / 4
			const x = p.cos(i) * r
			const y = p.sin(i) * r
			cnv.vertex(x + (SIZE / 4) * 3, y + SIZE / 2)
		}
		for (let i = p.PI; i >= p.HALF_PI; i -= 0.01) {
			const r = SIZE / 2
			const x = p.cos(i) * r
			const y = p.sin(i) * r
			cnv.vertex(x + SIZE, y + SIZE / 2)
		}
		cnv.endShape(p.CLOSE)
		cnv.pop()
	}
})
