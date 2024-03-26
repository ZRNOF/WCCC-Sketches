// Palette © 2024-02-18 by Zaron Chen is licensed under MIT
// Make a Tool 🧰 #WCCChallenge
// fixing the bugs... (;´༎ຶ д ༎ຶ`)
//
// Controls:
// - Left-click to select the block under the mouse
// - Right-click to copy the color of the block under the mouse
// - Use arrow keys (↑, ↓, ←, →) to pick neighboring blocks
// - Press "a" or "A" to add a block
// - Press "s" or "S" to save the sketch as an image
// - Press "c" or "C" to copy all colors as an array
// - Press "Delete" to remove the selected block
// - Press "Escape" to cancel the selection
// - Press "Enter" to select the first block (if no block is selected)
// - Press "Home" to select the first block in the line
// - Press "End" to select the last block in the line
//
// [*] If the controls are not responsive, please click on the canvas to ensure the browser focuses on it.

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { mountGrid } from "./Grid.js"
import { mountControl } from "./Controls.js"
import { CopyText } from "./tools.js"
import { PARAMS } from "./panel.js"
import { addBlock, removeBlock } from "./panel.js"
import { typing, onTweakpane, onDrage } from "./panel.js"
import { resetPicked, setPicked } from "./panel.js"
import { copyColors } from "./panel.js"

mountFlex(p5)
mountGrid(p5)
mountControl(p5)

new p5((p) => {
	let [WIDTH, HEIGHT] = [600, 600]
	const CELL_SIZE = 100
	let gs, cols, rows, grid_w, grid_h
	let preLength = PARAMS.Colors.length
	let mx, my

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex()
		resetGridParams()
		gs = p.Grid({ cols, rows, grid_w, grid_h, order: p.LRTB })
		keyEvents()
	}

	p.draw = () => {
		p.background(51)

		const tx = WIDTH / 2 - grid_w / 2
		const ty = HEIGHT / 2 - grid_h / 2

		mx = p.mouseX - tx
		my = p.mouseY - ty

		ColorsLenChanged() && configGrid()
		!noPickedID() && editColor(getPickedID())

		p.push()
		setTextStyles(PARAMS.Block.Text)
		p.translate(tx, ty)
		gs.generate(content)
		p.pop()
	}

	const content = (cell) => {
		const [x, y] = [0, 0]
		const size = cell.w * PARAMS.Block.size
		const radius = (cell.w / 2) * PARAMS.Block.radius
		const hexCode = PARAMS.Colors[cell.id]

		if (!hexCode) return

		p.translate(cell.w / 2, cell.h / 2)
		p.rectMode(p.CENTER)

		// border
		if (PARAMS.Block.Border.enable) {
			p.stroke(toP5Color(PARAMS.Block.Border.color))
			p.strokeWeight(PARAMS.Block.Border.thickness)
		} else p.noStroke()

		// base color
		p.fill(hexCode)
		p.square(x, y, size, radius)

		// clip text area
		p.clip(() => p.square(x, y, size, radius))

		// text
		const mouseInteract = mouseIsOver(cell, mx, my)
		if (mouseInteract && p.mouseIsPressed) blockEvents(cell)
		if (mouseInteract || hasPickedID(cell.id) || PARAMS.Block.Text.showAll)
			showText(size, hexCode, -PARAMS.Block.Text.height)

		// outside border square
		p.noFill()
		p.square(x, y, size, radius)
	}

	const keyEvents = () => {
		p.PressDo("ArrowUp", pickNeighbor, [0, -1])
		p.PressDo("ArrowDown", pickNeighbor, [0, 1])
		p.PressDo("ArrowRight", pickNeighbor, [1, 0])
		p.PressDo("ArrowLeft", pickNeighbor, [-1, 0])
		p.PressDo("a", addBlock)
		p.PressDo("A", addBlock)
		p.PressDo("s", save)
		p.PressDo("S", save)
		p.PressDo("c", copyColors)
		p.PressDo("C", copyColors)
		p.PressDo("Delete", removeBlock)
		p.PressDo("Escape", resetPicked)
		p.PressDo("Enter", setPickedToIndex0)
		p.PressDo("Home", setPickedToLineHead)
		p.PressDo("End", setPickedToLineTail)
		p.ClickDo(
			() =>
				!onDrage() && !onTweakpane() && !mouseOnGrid(mx, my) && resetPicked()
		)
	}

	const save = () => p.save(PARAMS.Colors.join("-").replace(/#/g, ""))

	const ColorsLenChanged = () => {
		if (preLength === PARAMS.Colors.length) return false
		preLength = PARAMS.Colors.length
		return true
	}

	const configGrid = () => {
		resetGridParams()
		gs.config({ cols, rows, grid_w, grid_h })
	}

	const setTextStyles = ({ font, style }) => {
		p.textAlign(p.CENTER, p.CENTER)
		p.textFont(font)
		p.textStyle(p[style])
	}

	const getPickedID = () => PARAMS.Palette.pickedID
	const noPickedID = () => getPickedID() === null
	const hasPickedID = (id) => getPickedID() === id

	const setPickedToIndex0 = () => !typing && noPickedID() && setPicked(0)

	const setPickedToLineHead = () => {
		if (typing || noPickedID()) return
		const lineHead = p.floor(getPickedID() / cols) * cols
		setPicked(lineHead)
	}

	const setPickedToLineTail = () => {
		if (typing || noPickedID()) return
		const lineTail = p.min(
			(p.floor(getPickedID() / cols) + 1) * cols - 1,
			PARAMS.Colors.length - 1
		)
		setPicked(lineTail)
	}

	const blockEvents = (cell) => {
		if (onTweakpane()) return
		if (p.mouseButton === p.LEFT) setPicked(cell.id)
		if (p.mouseButton === p.RIGHT) CopyText(PARAMS.Colors[cell.id])
	}

	const pickNeighbor = (cOff, rOff) => {
		if (typing) return
		const currID = getPickedID()
		const cell = gs.cells[currID]
		if (!cell) return
		const nbrID = gs.getID(cell.col + cOff, cell.row + rOff)
		if (nbrID === -1 || nbrID >= PARAMS.Colors.length) return
		setPicked(nbrID)
	}

	const editColor = (id) => {
		PARAMS.Colors[id] = PARAMS.Palette.picked
		PARAMS.Palette.colors = JSON.stringify(PARAMS.Colors, null, 2)
	}

	const toP5Color = ({ r, g, b }) => p.color(r, g, b)

	const toTextBgColor = (color, darkness) => {
		color.setRed(p.red(color) - darkness)
		color.setGreen(p.green(color) - darkness)
		color.setBlue(p.blue(color) - darkness)
		color.setAlpha(p.alpha(color) - darkness)
	}

	const mouseIsOver = (cell, mx, my) => {
		if (onDrage()) return false
		return (
			cell.col * cell.w < mx &&
			mx < cell.col * cell.w + cell.w &&
			cell.row * cell.h < my &&
			my < cell.row * cell.h + cell.h
		)
	}

	const mouseOnGrid = (mx, my) => {
		if (onDrage()) return false
		return 0 < mx && mx < grid_w && 0 < my && my < grid_h
	}

	const showText = (size, text, textH) => {
		textH *= (3 * size) / 8

		p.push()
		p.noStroke()

		const c = p.color(text)
		toTextBgColor(c, 50)

		p.fill(c)
		p.rect(0, textH, size, size / 4)

		p.fill(toP5Color(PARAMS.Block.Text.color))
		p.textSize(PARAMS.Block.Text.size * (size / 4))
		p.text(text, 0, textH)
		p.pop()
	}

	const resetGridParams = () => {
		cols = p.max(1, p.min(PARAMS.Colors.length, 5))
		rows = p.max(1, p.ceil(PARAMS.Colors.length / cols))
		grid_w = cols * CELL_SIZE
		grid_h = rows * CELL_SIZE
	}
})
