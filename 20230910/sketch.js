// Spore Print © 2023-09-10 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Fungi 🍄 #WCCChallenge

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { mountGrid } from "./Grid.js"

mountFlex(p5)
mountGrid(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [400, 400]
	let gfx

	let pgs, gfxgs
	const padding = 50
	const gridSize = p.random([4, 5])

	const gsParams = {
		cols: gridSize,
		rows: gridSize,
		gridW: WIDTH - padding * 2,
		gridH: HEIGHT - padding * 2,
	}

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" }, canvas: { fit: p.SCALE_DOWN } })
		p.containerBgColor(51)
		p.parentBgColor(51)

		gfx = p.createGraphics(WIDTH, HEIGHT)

		pgs = gfx.Grid(gsParams)
		gfxgs = p.Grid(gsParams)

		const theme = p.shuffle([0, 255])
		p.background(theme[0])
		p.stroke(theme[1])

		p.push()
		p.translate(padding, padding)
		gfxgs.generate(content)
		p.pop()

		gfx.push()
		gfx.translate(padding, padding)
		pgs.generate(centerCircle)
		gfx.filter(gfx.BLUR, 10)
		gfx.pop()

		p.image(gfx, 0, 0)

		Border(theme[1], 5)
	}

	const content = ({ id, w, h }) => {
		p.noiseSeed(id * 100)
		const contourSize = p.random(w - 20, w - 10)
		p.noFill()
		p.strokeWeight(0.05)
		p.circle(w / 2, h / 2, contourSize)
		lamella(w / 2, h / 2, p.random(10, 20), contourSize - gfx.random(5, 10))
	}

	const centerCircle = ({ w, h }) => {
		gfx.noStroke()
		gfx.fill(gfx.random(255), gfx.random(255), gfx.random(255), 250)
		gfx.circle(w / 2, h / 2, 15)
	}

	const lamella = (posX, posY, centerSize, contourSize) => {
		p.push()
		p.angleMode(p.DEGREES)
		const centerRadius = centerSize / 2 // Stipe radius
		const stepSize = (contourSize - centerSize) / 2 // point step size
		p.translate(posX, posY)
		let amount = p.floor(p.random(1, 12)) * 10
		let rotateStep = 360 / amount
		for (let i = 0; i < amount; i++) {
			p.rotate(rotateStep) // use rotate to make lamella effect
			// step start from centerRadius because have Stipe
			for (let step = 0; step < stepSize; step++) {
				const baseWei = 3 // base stroke weight
				const gradient = p.map(step, 0, 100, 0.5, 1) // make stroke weight more heavy from center to edge
				const noiseScal = 0.05 // make stroke more organic
				const wei = baseWei * gradient * p.noise(step * noiseScal) // final weight
				p.strokeWeight(wei) // Apply to strokeWeight
				p.point(centerRadius + step, 0)
			}
		}
		p.pop()
	}

	const Border = (color, weight) => {
		p.push()
		p.noFill()
		p.stroke(color)
		p.strokeWeight(weight * 2)
		p.rectMode(p.CENTER)
		p.rect(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT)
		p.pop()
	}
})
