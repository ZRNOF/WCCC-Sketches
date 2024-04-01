// Wheel © 2024-03-31 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Scrolling 🛞 OR Rhythm 🥁 #WCCChallenge
//
// Try some mouse wheel interactions this time! (*•̀ㅂ•́)و
// I used my WebGL2 tool - Olon, and shader tool set - Shox.
// Tweakpane is used for panels, and Drage makes Tweakpane draggable.
//
// Olon:      https://github.com/ZRNOF/Olon 🚧
// Shox:      https://github.com/ZRNOF/Shox
// Tweakpane: https://tweakpane.github.io/docs/
// Drage:     https://github.com/ZRNOF/Drage

import Olon from "https://cdn.jsdelivr.net/npm/olon@0.3.2/dist/Olon.min.js"
import { loadImage } from "https://cdn.jsdelivr.net/npm/olon@0.3.2/dist/Olon.min.js"
import { loadWebcam } from "https://cdn.jsdelivr.net/npm/olon@0.3.2/dist/Olon.min.js"
import { UPDATE_VERT, UPDATE_FRAG } from "./shader.js"
import { RENDER_VERT, RENDER_FRAG } from "./shader.js"
import { PARAMS, Pause, Save, MAX_DIVISION } from "./panel.js"
import { dir } from "./scroll.js"

const webcam = await loadWebcam()
const img = await loadImage(
	"https://openprocessing-usercontent.s3.amazonaws.com/files/user324002/visual1820214/ha36fa4f28daa765149edd82274297dcb/cat.jpg"
)

const ol = Olon(512, 512, true)
ol.flex()

// Programs
const TFV = ["vAngle"] // transformFeedback varyings
const updatePG = ol.createProgram(UPDATE_VERT, UPDATE_FRAG, TFV)
const renderPG = ol.createProgram(RENDER_VERT, RENDER_FRAG)

// Buffers
const initData = ol.Data(new Array(MAX_DIVISION).fill(0))
const buffers = [
	ol.createBuffer(initData, ol.STREAM_DRAW),
	ol.createBuffer(initData, ol.STREAM_DRAW),
]

// AttribsInfos
const aAngle = { name: "aAngle", unit: "f32", size: 1 }
const updateAttribs = [aAngle]
const renderAttribs = [aAngle]

const BFI = (buffer, attributes, stride, divisor) => {
	return { buffer, stride, attributes, divisor }
}
// BufferInfos
const BFI0 = BFI(buffers[0], updateAttribs, 4)
const BFI1 = BFI(buffers[1], updateAttribs, 4)
const BFI2 = BFI(buffers[0], renderAttribs, 4, 1)
const BFI3 = BFI(buffers[1], renderAttribs, 4, 1)
const quadBufferInfo = ol.quadBufferInfo() // aPosition & aTexCoord

// VAO
const vaos = [
	ol.createVAO(updatePG, BFI0),
	ol.createVAO(updatePG, BFI1),
	ol.createVAO(renderPG, [BFI2, quadBufferInfo]),
	ol.createVAO(renderPG, [BFI3, quadBufferInfo]),
]

// For swap VAO / Buffer
let [read, write] = [0, 1]

// Textures
const webcamTexture = ol.texture2D({ iformat: ol.RGBA })
const texture = ol.texture2D({
	flipY: false,
	data: img,
	iformat: ol.RGBA,
	// filter: ol.LINEAR,
})

// Blend
ol.enableBlend()
ol.blend({
	sfactor: ol.ONE,
	dfactor: ol.ONE_MINUS_SRC_ALPHA,
})

// Culling
ol.enableCulling()
ol.cull(ol.BACK)

// Toggle Play / Pause
Pause.on("change", (e) => (e.value ? ol.pause() : ol.play()))

// Save
Save.on("click", () => ol.save("image.png"))

ol.render(() => {
	const time = ol.frame / 60

	ol.ATTACH_TO_2D && ol.o2D.clearRect(0, 0, ol.width, ol.height)
	ol.clearColor(245 / 255, 245 / 255, 245 / 255, 1)
	ol.clearDepth()

	ol.use({
		program: updatePG,
	}).run(() =>
		ol.transformFeedback(vaos[read], buffers[write], ol.POINTS, () => {
			ol.uniform("uMouse", ol.mouse)
			ol.uniform("uDivisionCount", PARAMS.DivisionCount)
			ol.uniform("uScrollValue", dir * (PARAMS.Sensitivity * 0.01))
			ol.uniform("uRecover", PARAMS.Recover)
			ol.uniform("uSize", PARAMS.Size)
			ol.points(0, PARAMS.DivisionCount)
		})
	)

	ol.use({
		VAO: vaos[read + 2],
		program: renderPG,
	}).run(() => {
		if (PARAMS.Texture === "Webcam") {
			ol.uniform("uTexture", webcamTexture, webcam)
		} else if (PARAMS.Texture === "Image") {
			ol.uniform("uTexture", texture)
		}
		ol.uniform("uResolution", ol.resolution)
		ol.uniform("uTime", time)
		ol.uniform("uDivisionCount", PARAMS.DivisionCount)
		ol.uniform("uAutoMove", PARAMS.AutoMove)
		ol.uniform("uSize", PARAMS.Size)
		ol.uniform("uMonochrome", PARAMS.Monochrome)
		ol.trianglesInstanced(0, 6, PARAMS.DivisionCount)
	})

	// swap
	;[read, write] = [write, read]
})
