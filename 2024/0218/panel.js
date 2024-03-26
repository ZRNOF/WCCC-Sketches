import { Drage } from "https://cdn.jsdelivr.net/npm/drage@1.0.1/Drage.js"
import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane/dist/tweakpane.js"
import { CopyText, PaletteFrom, limitArrayLength } from "./tools.js"

const { onDrage, contentArea } = Drage({ hor: "right" })

// prettier-ignore
const initURL = "https://coolors.co/palette/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77"
const initHexArray = `["#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5", "#2196f3", "#1e88e5", "#1976d2", "#1565c0", "#0d47a1"]`
const initColors = PaletteFrom(initURL)
const limitColorsLength = 25
let typing = false

/////////////////////////////////////////////
// BLUR ACTIVE ELEMENTS /////////////////////

const blurActiveElements = () => document.activeElement.blur()

/////////////////////////////////////////////
// PARAMETERS ///////////////////////////////

const PARAMS = {
	Colors: initColors,
	Import: {
		mode: 0,
		url: initURL,
		hexArray: initHexArray,
	},
	Block: {
		size: 0.9,
		radius: 0.2,
		Border: {
			thickness: 0,
			color: { r: 255, b: 255, g: 255 },
			enable: true,
		},
		Text: {
			font: "Courier New",
			style: "NORMAL",
			size: 0.65,
			height: -1,
			color: { r: 255, b: 255, g: 255 },
			showAll: false,
		},
	},
	Palette: {
		pickedID: null,
		picked: "#000000",
		Add: {
			color: "#000000",
			usePicked: false,
		},
		colors: JSON.stringify(initColors, null, 2),
	},
}

/////////////////////////////////////////////
// TWEAKPANE ////////////////////////////////

const pane = new Pane({
	title: "Parameters",
	container: contentArea,
})

/////////////////////////////////////////////
// IMPORT ///////////////////////////////////

const Import = pane.addFolder({ title: "Import" })
const ImportTab = Import.addTab({
	pages: [{ title: "URL" }, { title: "Hex Array" }],
})
const [URLPage, HexArrayPage] = ImportTab.pages
URLPage.addBinding(PARAMS.Import, "url", { label: "source" })
HexArrayPage.addBinding(PARAMS.Import, "hexArray", { label: "source" })
ImportTab.on("select", (e) => (PARAMS.Import.mode = e.index))

const resetPickedColor = () => {
	if (typing) return
	PARAMS.Palette.Add.color = "#000000"
	pane.refresh()
}

const usePickedColor = () => {
	if (PARAMS.Colors.length === 0) resetPickedColor()
	else PARAMS.Palette.Add.color = PARAMS.Colors[PARAMS.Palette.pickedID]
	pane.refresh()
}

const resetPicked = () => {
	blurActiveElements()
	PARAMS.Palette.pickedID = null
	PARAMS.Palette.picked = "#000000"
	if (PARAMS.Palette.Add.usePicked) resetPickedColor()
	pane.refresh()
}

const setPicked = (id) => {
	blurActiveElements()
	if (PARAMS.Colors.length === 0) return
	PARAMS.Palette.pickedID = id
	PARAMS.Palette.picked = PARAMS.Colors[id]
	if (PARAMS.Palette.Add.usePicked) usePickedColor()
	pane.refresh()
}

const updateColors = () => {
	PARAMS.Palette.colors = JSON.stringify(PARAMS.Colors, null, 2)
	pane.refresh()
}

const Convert = Import.addButton({ title: "Convert" })
Convert.on("click", () => {
	resetPicked()
	try {
		if (PARAMS.Import.mode === 0) PARAMS.Colors = PaletteFrom(PARAMS.Import.url)
		if (PARAMS.Import.mode === 1)
			PARAMS.Colors = JSON.parse(PARAMS.Import.hexArray)
		PARAMS.Colors = limitArrayLength(PARAMS.Colors, limitColorsLength)
	} catch {
		PARAMS.Colors = []
	}
	updateColors()
})
pane.addBlade({ view: "separator" })

/////////////////////////////////////////////
// BLOCK ////////////////////////////////////

const Block = pane.addFolder({ title: "Block", expanded: false })
Block.addBinding(PARAMS.Block, "size", { min: 0.5, max: 1 })
Block.addBinding(PARAMS.Block, "radius", { min: 0, max: 1 })

const BlockTab = Block.addTab({
	pages: [{ title: "Border" }, { title: "Text" }],
})
const [BorderPage, TextPage] = BlockTab.pages

BorderPage.addBinding(PARAMS.Block.Border, "thickness", { min: 0, max: 10 })
BorderPage.addBinding(PARAMS.Block.Border, "color")
BorderPage.addBinding(PARAMS.Block.Border, "enable")

const TextFont = TextPage.addBlade({
	view: "list",
	label: "font",
	options: [
		{ text: "Arial", value: "Arial" },
		{ text: "Verdana", value: "Verdana" },
		{ text: "Tahoma", value: "Tahoma" },
		{ text: "Trebuchet MS", value: "Trebuchet MS" },
		{ text: "Times New Roman", value: "Times New Roman" },
		{ text: "Georgia", value: "Georgia" },
		{ text: "Garamond", value: "Garamond" },
		{ text: "Courier New", value: "Courier New" },
		{ text: "Brush Script MT", value: "Brush Script MT" },
		{ text: "Consolas", value: "Consolas" },
	],
	value: "Courier New",
})
TextFont.on("change", (e) => (PARAMS.Block.Text.font = e.value))
const TextStyle = TextPage.addBlade({
	view: "list",
	label: "style",
	options: [
		{ text: "Normal", value: "NORMAL" },
		{ text: "Italic", value: "ITALIC" },
		{ text: "Bold", value: "BOLD" },
		{ text: "Bold Italic", value: "BOLDITALIC" },
	],
	value: "NORMAL",
})
TextStyle.on("change", (e) => (PARAMS.Block.Text.style = e.value))
TextPage.addBinding(PARAMS.Block.Text, "size", { min: 0.25, max: 1 })
TextPage.addBinding(PARAMS.Block.Text, "height", { min: -1, max: 1 })
TextPage.addBinding(PARAMS.Block.Text, "color")
TextPage.addBinding(PARAMS.Block.Text, "showAll", { label: "show all" })

const resetBtn = Block.addButton({ title: "reset" })
resetBtn.on("click", () => {
	PARAMS.Block.size = 0.9
	PARAMS.Block.radius = 0.2

	PARAMS.Block.Border.thickness = 0
	PARAMS.Block.Border.color = { r: 255, b: 255, g: 255 }
	PARAMS.Block.Border.enable = true

	PARAMS.Block.Text.font = "Courier New"
	PARAMS.Block.Text.style = "NORMAL"
	PARAMS.Block.Text.size = 0.65
	PARAMS.Block.Text.height = -1
	PARAMS.Block.Text.color = { r: 255, b: 255, g: 255 }
	PARAMS.Block.Text.showAll = false

	TextFont.value = "Courier New"
	TextStyle.value = "NORMAL"

	pane.refresh()
})

pane.addBlade({ view: "separator" })

/////////////////////////////////////////////
// PALETTE //////////////////////////////////

const removeBlock = () => {
	if (typing) return

	blurActiveElements()
	const arr = PARAMS.Colors
	const index = PARAMS.Palette.pickedID
	resetPicked()
	if (index === null) return
	if (index >= 0 && index < arr.length) arr.splice(index, 1)
	updateColors()

	const newIndex = Math.min(index, PARAMS.Colors.length - 1)
	if (newIndex === -1) return
	setPicked(newIndex)
	pane.refresh()
}

const addBlock = () => {
	if (typing) return
	blurActiveElements()
	if (PARAMS.Colors.length < limitColorsLength) {
		PARAMS.Colors.push(PARAMS.Palette.Add.color)
	}
	updateColors()
}

const Palette = pane.addFolder({ title: "Palette" })

const PaletteTab = Palette.addTab({
	pages: [{ title: "Edit" }, { title: "Add" }],
})
const [EditPage, AddPage] = PaletteTab.pages

const picked = EditPage.addBinding(PARAMS.Palette, "picked")
picked.on("change", () => {
	if (PARAMS.Palette.Add.usePicked) usePickedColor()
})
const deleteBtn = EditPage.addButton({ title: "delete", label: "" })
deleteBtn.on("click", removeBlock)
const copyCurrentBlockBtn = EditPage.addButton({ title: "copy", label: "" })
copyCurrentBlockBtn.on("click", () => CopyText(PARAMS.Palette.picked))

const addColor = AddPage.addBinding(PARAMS.Palette.Add, "color")
// const usePickedBtn = AddPage.addBinding(PARAMS.Palette.Add, "usePicked", {
// 	label: "use picked",
// })
// usePickedBtn.on("change", (e) => {
// 	if (e.value) {
// 		addColor.disabled = true
// 		usePickedColor()
// 	} else addColor.disabled = false
// })

const addBtn = AddPage.addButton({ title: "add", label: "" })
addBtn.on("click", addBlock)

Palette.addBlade({ view: "separator" })

Palette.addBinding(PARAMS.Palette, "colors", {
	readonly: true,
	multiline: true,
	rows: 5,
})

const copyColors = () => {
	if (typing) return
	CopyText(JSON.stringify(PARAMS.Colors))
}

const copyBtn = Palette.addButton({ title: "copy", label: "" })
copyBtn.on("click", copyColors)

/////////////////////////////////////////////
// CHECK TYPING /////////////////////////////

const inputs = document.querySelectorAll('input[type="text"]')
inputs.forEach((input) => {
	input.addEventListener("focus", () => (typing = true))
	input.addEventListener("blur", () => (typing = false))
})

/////////////////////////////////////////////
// HANDLE TWEAKPANE ACTIVE //////////////////

const onTweakpane = () =>
	document.activeElement !== document.body &&
	document.activeElement.className.startsWith("tp-")

/////////////////////////////////////////////
// EXPORT ///////////////////////////////////

export {
	PARAMS,
	onDrage,
	pane,
	removeBlock,
	addBlock,
	resetPicked,
	setPicked,
	typing,
	copyColors,
	blurActiveElements,
	onTweakpane,
}
