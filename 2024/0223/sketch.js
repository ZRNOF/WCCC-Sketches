// Reaction-Diffusion © 2024-02-23 by Zaron Chen is licensed under the MIT License. See LICENSE for more details.
// Iterations 🔄 #WCCChallenge
//
// The implementation is based on Karl Sims's Reaction-Diffusion Tutorial:
// https://www.karlsims.com/rd.html
//
// I didn't use the Laplacian kernel from Karl Sims's tutorial;
// I implemented it in my shader repository "Shox".
// The implementation is based on Wikipedia:
// Discrete Laplace operator: https://en.wikipedia.org/wiki/Discrete_Laplace_operator
//
// from Wikipedia:         from tutorial:
//   [ .25,  .5, .25 ]       [ .05,  .2, .05 ]
//   [  .5, -3.,  .5 ]       [  .2, -1.,  .2 ]
//   [ .25,  .5, .25 ]       [ .05,  .2, .05 ]
//
// To set the center to -1, I divided by 3 on line 50 in shader.js.
//
// For the emboss effect, I directly applied an emboss kernel.
// I didn't adjust the color to correct it, and it seems the color shifted too much?
// But I liked the result, so I decided to keep it.
//
// Reaction-Diffusion must be one of my favorite systems.
// I immediately think of it when I see the topic of "Iterations".
// There's so much fun to be had with it. Thanks to Karl Sims's tutorial,
// it helped a lot in understanding what happens in Reaction-Diffusion.
//
// Trying to figure out why this is running weird on my iPhone 7...

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.mjs"
import { RenderFrag, RDFrag, vert } from "./shader.js"
import { PARAMS, onDrage, Pause } from "./panel.js"

mountFlex(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [p.windowWidth, p.windowHeight]
	const PIXEL_DENSITY = 0.5
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let prev, next
	let RDShader, RenderShader

	Pause.on("change", (e) => (e.value ? p.noLoop() : p.loop()))

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT, p.WEBGL)
		p.flex({ canvas: { fit: p.COVER } })
		p.containerBgColor(51)
		p.parentBgColor(51)
		p.pixelDensity(PIXEL_DENSITY)

		prev = p.createFramebuffer({ format: p.FLOAT, textureFiltering: p.NEAREST })
		next = p.createFramebuffer({ format: p.FLOAT, textureFiltering: p.NEAREST })

		RDShader = p.createShader(vert, RDFrag)
		RenderShader = p.createShader(vert, RenderFrag)

		p.noStroke()
		p.imageMode(p.CENTER)
	}

	p.draw = () => {
		RD()
		render()
	}

	const RD = () => {
		for (let i = 0; i < PARAMS.Iterations; i++) {
			;[prev, next] = [next, prev]
			next.begin()
			p.shader(RDShader)
			RDShader.setUniform("tex0", prev)
			RDShader.setUniform("canvasSize", CANVAS_SIZE)
			RDShader.setUniform("texelSize", TEXEL_SIZE)
			RDShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
			RDShader.setUniform("FEED", PARAMS.Feed)
			RDShader.setUniform("KILL", PARAMS.Kill)
			RDShader.setUniform("DeltaT", PARAMS.DeltaT)
			RDShader.setUniform("Scale", PARAMS.Scale)
			RDShader.setUniform("Radius", PARAMS.Radius)
			RDShader.setUniform("Wrap", PARAMS.Wrap)
			RDShader.setUniform("Cursor", p.mouseIsPressed && !onDrage())
			RDShader.setUniform("Clear", PARAMS.Clear)
			PARAMS.Clear && (PARAMS.Clear = false)
			p.quad(-1, 1, 1, 1, 1, -1, -1, -1)
			next.end()
		}
	}

	const render = () => {
		p.shader(RenderShader)
		RenderShader.setUniform("tex0", next)
		RenderShader.setUniform("canvasSize", CANVAS_SIZE)
		RenderShader.setUniform("texelSize", TEXEL_SIZE)
		RenderShader.setUniform("Wrap", PARAMS.Wrap)
		RenderShader.setUniform("Brightness", xyz(PARAMS.Render.Palette.Brightness))
		RenderShader.setUniform("Constrast", xyz(PARAMS.Render.Palette.Constrast))
		RenderShader.setUniform("Oscilates", xyz(PARAMS.Render.Palette.Oscilates))
		RenderShader.setUniform("Phase", xyz(PARAMS.Render.Palette.Phase))
		RenderShader.setUniform("Emboss", PARAMS.Render.Emboss)
		RenderShader.setUniform("Offset", PARAMS.Render.Offset)
		p.quad(-1, 1, 1, 1, 1, -1, -1, -1)
	}

	const xyz = (obj) => [obj.x, obj.y, obj.z]
})
