// Sky © 2023-06-25 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Why is the sky blue 🪂 #WCCChallenge
//
// Why is the sky blue?
//    ... I don't know.  (;´༎ຶ д ༎ຶ`)

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { vert, frag } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [1200, 600]
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let gfx, bufferLayer, theShader

	const displaceWeight = 0.008 // 0 to see p5
	const noiseSpeed = 0.025
	const endFrame = 200
	const cloudAmount = 20

	const pos = []

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" }, canvas: { fit: p.SCALE_DOWN } })
		p.containerBgColor(255)
		p.parentBgColor(255)
		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		bufferLayer = p.createGraphics(WIDTH, HEIGHT)

		theShader = p.createShader(vert, frag)

		p.noStroke()
		gfx.noStroke()
		bufferLayer.noStroke()

		bufferLayer.background(255)
		bufferLayer.rectMode(p.CENTER)

		for (let y = 0; y <= HEIGHT; y += 6) {
			bufferLayer.fill(
				0,
				p.map(p.noise(y), 0, 1, 160, 180),
				p.map(p.noise(y), 0, 1, 220, 255)
			)
			bufferLayer.rect(WIDTH / 2, y, WIDTH, 5)
		}

		// cloud position
		for (let i = 0; i < cloudAmount; i++) {
			pos.push({
				x: p.random(WIDTH),
				y: p.random(HEIGHT),
				dir: p.random([-1, 1]),
				speed: p.random(),
			})
		}
	}

	p.draw = () => {
		const t = p.frameCount

		pos.forEach(({ x, y, dir, speed }) => cloud(x + dir * t * speed, y))

		gfx.shader(theShader)
		theShader.setUniform("tex0", bufferLayer)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
		theShader.setUniform("time", p.frameCount)
		theShader.setUniform("iDisplaceWeight", displaceWeight)
		theShader.setUniform("iNoiseSpeed", noiseSpeed)
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)
		bufferLayer.image(gfx, 0, 0)
		p.image(bufferLayer, 0, 0)

		p.frameCount === endFrame && p.noLoop()
	}

	const cloud = (posX, posY) => {
		bufferLayer.push()
		bufferLayer.rectMode(p.CENTER)
		bufferLayer.translate(posX, posY)

		let w
		const h = 20
		const rad = 20

		bufferLayer.fill(p.random(200, 255), 5)

		for (let y = 0; y <= 100; y += 20) {
			const xoff =
				p.map(p.noise(p.frameCount * 0.01 + y * 10), 0, 1, -1, 1) * 150
			const yoff = y
			w = p.noise(p.frameCount * 0.01 + y * 20) * 150
			bufferLayer.rect(xoff, yoff, w, h, rad)
		}

		bufferLayer.pop()
	}
})
