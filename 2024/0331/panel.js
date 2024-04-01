import { Drage } from "https://cdn.jsdelivr.net/npm/drage@1.0.1/Drage.js"
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane/dist/tweakpane.js"

const { contentArea } = Drage({ hor: "right" })

const MAX_DIVISION = 100

// Parameters
const PARAMS = {
	Texture: "Image",
	DivisionCount: 10,
	Size: 0.9,
	Sensitivity: 10,
	Recover: true,
	AutoMove: true,
	Monochrome: true,
	Pause: false,
}

// Tweakpane
const pane = new Pane({
	title: "Parameters",
	container: contentArea,
})

// Texture
pane.addBinding(PARAMS, "Texture", {
	options: [
		{ text: "Image", value: "Image" },
		{ text: "Webcam", value: "Webcam" },
	],
})

// Division Count
pane.addBinding(PARAMS, "DivisionCount", {
	min: 1,
	max: MAX_DIVISION,
	step: 1,
	label: "Division Count",
})

// Size
pane.addBinding(PARAMS, "Size", { min: 0.5, max: 1 })

// Sensitivity
pane.addBinding(PARAMS, "Sensitivity", { min: 1, max: 10 })

// Recover
pane.addBinding(PARAMS, "Recover")

// AutoMove
pane.addBinding(PARAMS, "AutoMove")

// Monochrome
pane.addBinding(PARAMS, "Monochrome")

// Pause
const Pause = pane.addBinding(PARAMS, "Pause")

// Save
const Save = pane.addButton({ title: "Save" })

export { PARAMS, Pause, Save, MAX_DIVISION }
