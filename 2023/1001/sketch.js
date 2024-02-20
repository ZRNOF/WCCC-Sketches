// Pixel Collapse © 2023-10-01 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Falling 🍂 #WCCChallenge
//
// All photos were taken in Taiwan❤️.
//
// Most of my WebGL2 knowledge comes from Andrew Adamson's tutorial videos (Big Thanks!)
// Playlist: https://www.youtube.com/playlist?list=PLPbmjY2NVO_X1U1JzLxLDdRn4NmtxyQQo

import Olon, {
	Data,
	loadImage,
} from "https://cdn.jsdelivr.net/npm/olon@0.1.0/dist/Olon.min.js"
import { frag, vert } from "./shader.js"
import { getRandomImage, floor, ceil, random } from "./tools.js"

const image = await loadImage(getRandomImage())

const ol = Olon(image.width, image.height)
ol.enableCanvas2D()

const program = ol.createProgram(vert, frag)

const pointSize = [1, 3, 5, 7, 9][floor(random(0, 5))]

const positionData = []
const offsetData = []
const texCoordData = []

const cols = ceil(image.width / pointSize)
const rows = ceil(image.height / pointSize)
const [xOff, yOff] = [2 / cols, 2 / rows]
const [uOff, vOff] = [1 / cols, 1 / rows]

// noprotect
for (let col = 0; col < cols; col++) {
	for (let row = 0; row < rows; row++) {
		positionData.push(-1 + xOff * col + 1 / cols)
		positionData.push(1 - yOff * row - 1 / rows)
		offsetData.push(random(-1, 1))
		offsetData.push(random(-1, 1))
		texCoordData.push((col + 1 / cols) * uOff)
		texCoordData.push((row + 1 / rows) * vOff)
	}
}

const VAO = ol.createVAO(program, [
	{ name: "aPosition", data: Data(positionData), size: 2 },
	{ name: "aOffset", data: Data(offsetData), size: 2 },
	{ name: "aTexCoord", data: Data(texCoordData), size: 2 },
])

const imageTexture = ol.texture2D({
	data: image,
	iformat: ol.RGB,
	filter: ol.NEAREST,
	flipY: false,
})

ol.render(() =>
	ol.use({ program, VAO }).run(() => {
		ol.clearColor(0, 0, 0, 0.5)
		ol.uniform("uImage", imageTexture)
		ol.uniform("uPointSize", pointSize)
		ol.uniform("uTime", ol.frame / 60)
		ol.points(0, cols * rows)
	})
)
