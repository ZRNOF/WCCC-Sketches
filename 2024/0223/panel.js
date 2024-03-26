import { Drage } from "https://cdn.jsdelivr.net/npm/drage@1.0.1/Drage.js"
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane/dist/tweakpane.js"
import Collections from "./Collections.js"

const { onDrage, contentArea } = Drage({ hor: "right" })

// Parameters
const PARAMS = {
	Collection: "Petroleum",
	Feed: 0.02011,
	Kill: 0.04994,
	DeltaT: 1.5,
	Iterations: 5,
	Scale: 2,
	Radius: 0.02,
	Wrap: true,
	Render: {
		Palette: {
			Brightness: { x: 0.5, y: 0.5, z: 0.5 },
			Constrast: { x: 0.5, y: 0.5, z: 0.5 },
			Oscilates: { x: 1, y: 1, z: 1 },
			Phase: { x: 0.1, y: 0.1, z: 0.1 },
		},
		Emboss: true,
		Offset: 0.5,
	},
	Pause: false,
	Clear: false,
}

// Tweakpane
const pane = new Pane({
	title: "Parameters",
	container: contentArea,
})

// Collection
const Collection = pane.addBinding(PARAMS, "Collection", {
	options: Object.keys(Collections).map((v) => ({ text: v, value: v })),
})
Collection.on("change", (e) => {
	const C = Collections[e.value]
	PARAMS.Feed = C.Feed
	PARAMS.Kill = C.Kill
	PARAMS.DeltaT = C.DeltaT
	PARAMS.Iterations = C.Iterations
	PARAMS.Scale = C.Scale
	PARAMS.Radius = C.Radius
	PARAMS.Wrap = C.Wrap
	PARAMS.Render.Palette.Brightness = { ...C.Render.Palette.Brightness }
	PARAMS.Render.Palette.Constrast = { ...C.Render.Palette.Constrast }
	PARAMS.Render.Palette.Oscilates = { ...C.Render.Palette.Oscilates }
	PARAMS.Render.Palette.Phase = { ...C.Render.Palette.Phase }
	PARAMS.Render.Emboss = C.Render.Emboss
	PARAMS.Render.Offset = C.Render.Offset
	pane.refresh()
})

pane.addBlade({ view: "separator" })

// Feed
pane.addBinding(PARAMS, "Feed", { min: 0, max: 0.1 })

// Kill
pane.addBinding(PARAMS, "Kill", { min: 0.01413, max: 0.06534 })

// Delta t
pane.addBinding(PARAMS, "DeltaT", { label: "Delta t", min: 0.1, max: 2 })

// Iterations
pane.addBinding(PARAMS, "Iterations", { min: 1, max: 10, step: 1 })

// Scale
pane.addBinding(PARAMS, "Scale", { min: 1, max: 2 })

// Radius
pane.addBinding(PARAMS, "Radius", { min: 0.001, max: 0.5 })

// Wrap
pane.addBinding(PARAMS, "Wrap")

pane.addBlade({ view: "separator" })

// Render
const Render = pane.addFolder({ title: "Render", expanded: false })

// Palette
const Palette = Render.addFolder({ title: "Palette" })

// Brightness
Palette.addBinding(PARAMS.Render.Palette, "Brightness", {
	x: { min: 0, max: 1 },
	y: { min: 0, max: 1 },
	z: { min: 0, max: 1 },
})

// Constrast
Palette.addBinding(PARAMS.Render.Palette, "Constrast", {
	x: { min: 0, max: 1 },
	y: { min: 0, max: 1 },
	z: { min: 0, max: 1 },
})

// Oscilates
Palette.addBinding(PARAMS.Render.Palette, "Oscilates", {
	x: { min: 0, max: 5 },
	y: { min: 0, max: 5 },
	z: { min: 0, max: 5 },
})

// Phase
Palette.addBinding(PARAMS.Render.Palette, "Phase", {
	x: { min: 0, max: 1 },
	y: { min: 0, max: 1 },
	z: { min: 0, max: 1 },
})

Render.addBlade({ view: "separator" })

// Emboss
Render.addBinding(PARAMS.Render, "Emboss")

// Offset
Render.addBinding(PARAMS.Render, "Offset", { min: -0.5, max: 0.5 })

pane.addBlade({ view: "separator" })

// Pause
const Pause = pane.addBinding(PARAMS, "Pause")

// Clear Canvas
const Clear = pane.addButton({ title: "Clear Canvas" })
Clear.on("click", () => (PARAMS.Clear = true))

export { PARAMS, onDrage, pane, Pause }
