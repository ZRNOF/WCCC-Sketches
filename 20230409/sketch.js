// I'm from Taiwan © 2023-04-09 by Zaron Chen is licensed under CC BY-SA 3.0. To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/
// Where I live 📍 #WCCChallenge
// The artwork includes a modified version of the image "Prunus mume" by Kakidai, which is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported license. Link to original file: https://commons.wikimedia.org/wiki/File:Prunus_mume.JPG

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { vert, frag, filterFrag } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	let WIDTH, HEIGHT
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let nativeShader, filterShader
	let nativeLayer, bufferLayer, filterLayer
	let Taiwan, Flower

	p.preload = () => {
		Taiwan = p.loadImage("./Taiwan.png")
		Flower = p.loadImage("./Prunus_mume.jpg")
	}

	p.setup = () => {
		;[WIDTH, HEIGHT] = [Taiwan.width, Taiwan.height]
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" }, canvas: { fit: p.SCALE_DOWN } })
		p.containerBgColor(255)
		p.parentBgColor(255)
		p.pixelDensity(PIXEL_DENSITY)

		nativeLayer = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		bufferLayer = p.createGraphics(WIDTH, HEIGHT)
		filterLayer = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)

		nativeShader = p.createShader(vert, frag)
		filterShader = p.createShader(vert, filterFrag)

		p.noStroke()
		nativeLayer.noStroke()
		bufferLayer.noStroke()
		filterLayer.noStroke()
		bufferLayer.image(Flower, 0, 0, WIDTH, HEIGHT)
	}

	p.draw = () => {
		setShader(nativeLayer, nativeShader, bufferLayer)
		bufferLayer.image(nativeLayer, 0, 0)
		setShader(filterLayer, filterShader, bufferLayer)
		p.image(filterLayer, 0, 0)
	}

	const setShader = (canvas, shader, buffer) => {
		canvas.shader(shader)
		shader.setUniform("tex0", buffer)
		shader.setUniform("canvasSize", CANVAS_SIZE)
		shader.setUniform("texelSize", TEXEL_SIZE)
		shader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
		shader.setUniform("time", p.frameCount)
		shader.setUniform("iTaiwan", Taiwan)
		canvas.quad(-1, 1, 1, 1, 1, -1, -1, -1)
	}

	let STOP = false
	p.keyPressed = () => (p.key === " " && (STOP = !STOP) ? p.noLoop() : p.loop())
})
