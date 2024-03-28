// 螢 © 2024-03-10 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Firefly 🐛 #WCCChallenge
//
// I don't have much time to code this week...
// So, here is just a simple particle system! (hehe)
//
// This work is inspired by "GPU-Accelerated Particles with WebGL 2":
// https://gpfault.net/posts/webgl2-particles.txt.html
//
// The article is the best WebGL2-based particle system tutorial I've found so far; highly recommended!
// Of course, I'm also very open to any more article suggestions!
// Sharing is beautiful; thank you!

import { UPDATE_VERT, UPDATE_FRAG } from "./shader.js"
import { RENDER_VERT, RENDER_FRAG } from "./shader.js"
import Olon from "https://cdn.jsdelivr.net/npm/olon@0.2.4/dist/Olon.min.js"
import { random, min } from "./tools.js"

const COLS = 80
const ROWS = 80
const MAX_AMOUNT = COLS * ROWS
const MIN_AGE = 0
const MAX_AGE = 30
const SPEED = 0.5
let BORN_AMOUNT = 0

const ol = Olon(innerWidth, innerHeight, true)

ol.blend({ sfactor: ol.SRC_ALPHA, dfactor: ol.ONE })
ol.enableBlend()

const TFV = ["vPosition", "vAge", "vLife", "vVel"]
const updateProgram = ol.createProgram(UPDATE_VERT, UPDATE_FRAG, TFV)
const renderProgram = ol.createProgram(RENDER_VERT, RENDER_FRAG)

const aPosition = { name: "aPosition", unit: "f32", size: 2 }
const aAge = { name: "aAge", unit: "f32", size: 1 }
const aLife = { name: "aLife", unit: "f32", size: 1 }
const aVel = { name: "aVel", unit: "f32", size: 2 }
const aCoord = { name: "aCoord", unit: "f32", size: 2 }
const aTexCoord = { name: "aTexCoord", unit: "f32", size: 2 }

const updateAttribs = [aPosition, aAge, aLife, aVel]
const renderAttribs = [aPosition, aAge, aLife]
const quadAttribs = [aCoord, aTexCoord]

const particleData = []
for (var i = 0; i < MAX_AMOUNT; i++) {
	const LIFE = random(MIN_AGE, MAX_AGE)
	// prettier-ignore
	///////////////// aPosition  aAge       aLife  aVel
	particleData.push(0, 0,      LIFE + 1,  LIFE,  0, 0)
}
const initData = ol.Data(particleData)
const quadData = ol.quadData()

const buffer0 = ol.createBuffer(initData, ol.STREAM_DRAW)
const buffer1 = ol.createBuffer(initData, ol.STREAM_DRAW)
const quadBuffer = ol.createBuffer(quadData, ol.STATIC_DRAW)

// prettier-ignore
const VAOConfig = (buffer, stride, attributes, divisor) => ({ buffer, stride, attributes, divisor })
const updateVAO0 = ol.createVAO(updateProgram, [
	VAOConfig(buffer0, 4 * 6, updateAttribs),
])
const updateVAO1 = ol.createVAO(updateProgram, [
	VAOConfig(buffer1, 4 * 6, updateAttribs),
])
const renderVAO0 = ol.createVAO(renderProgram, [
	VAOConfig(buffer0, 4 * 6, renderAttribs, 1),
	VAOConfig(quadBuffer, 4 * 4, quadAttribs),
])
const renderVAO1 = ol.createVAO(renderProgram, [
	VAOConfig(buffer1, 4 * 6, renderAttribs, 1),
	VAOConfig(quadBuffer, 4 * 4, quadAttribs),
])

const buffers = [buffer0, buffer1]
const updateVAOs = [updateVAO0, updateVAO1]
const renderVAOs = [renderVAO0, renderVAO1]
let [read, write] = [0, 1]

ol.render(() => {
	BORN_AMOUNT = min(MAX_AMOUNT, BORN_AMOUNT + 10)

	ol.clearColor(0, 0, 0, 1)
	ol.clearDepth()

	ol.use({
		program: updateProgram,
	}).run(() => {
		ol.transformFeedback(updateVAOs[read], buffers[write], ol.POINTS, () => {
			ol.uniform("uMouse", ol.mouse)
			ol.uniform("uSpeed", SPEED)
			ol.uniform("uTime", ol.frame / 60)
			ol.uniform("uScale", ol.width / ol.height)
			ol.points(0, BORN_AMOUNT)
		})
	})

	ol.use({
		VAO: renderVAOs[read],
		program: renderProgram,
	}).run(() => {
		ol.uniform("uScale", ol.width / ol.height)
		ol.trianglesInstanced(0, 6, BORN_AMOUNT)
	})

	// swap
	;[read, write] = [write, read]
})
