// Heterogeneous © 2023-09-17 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Refraction 💎 #WCCChallenge

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"

mountFlex(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [1200, 600]

	p.setup = async () => {
		p.createCanvas(1200, 600)
		p.flex({ container: { padding: "20px" }, canvas: { fit: p.SCALE_DOWN } })
		p.containerBgColor(0)
		p.parentBgColor(0)

		p.colorMode(p.HSB)
		p.angleMode(p.DEGREES)
		p.background(0)

		let junction

		for (let tm = 0; tm < 10; tm++) {
			const maxLen = p.floor(p.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT))
			const halfMaxLen = p.floor(maxLen / 2)

			junction = p.floor(p.random(HEIGHT * 0.9))

			const tx = WIDTH / 2
			const ty = HEIGHT / 2
			p.translate(tx, ty)
			p.rotate(p.random(360))

			p.stroke(0, 0, 100)
			p.line(
				-halfMaxLen,
				-halfMaxLen + junction,
				halfMaxLen,
				-halfMaxLen + junction
			)

			const ls = p.random(0.5, 0.75) // speed of light in slow medium, 0.66 glass, 0.75 water
			const ray = { fromX: 0, toX: 0 }
			const ref = { fromX: 0, toX: 0 }
			ray.fromX = -halfMaxLen + p.floor(p.random(WIDTH))
			ray.toX = -halfMaxLen + halfMaxLen
			const opp = ray.toX - ray.fromX
			const adj = junction
			const angle = p.atan2(opp, adj)

			ref.fromX = ray.toX
			ref.toX = ref.fromX + (HEIGHT - adj) * p.tan(angle * ls)

			const amount = p.random([5, 10, 15, 20, 25])
			const sd = p.random([1, 3, 5, 7, 9, 11])

			for (let y = -halfMaxLen; y < -halfMaxLen + junction; y++) {
				const x = p.map(
					y,
					-halfMaxLen,
					-halfMaxLen + junction,
					ray.fromX,
					ray.toX
				)
				p.stroke(0, 0, 100)
				light(x, y, amount, sd)
			}

			const minWei = 0.7 // the purple light
			const weiStep = (1 - minWei) / amount
			const lineAmount = amount
			for (let y = -halfMaxLen + junction; y <= halfMaxLen; y++) {
				let wei = 1
				for (let n = 0; n < lineAmount; n++) {
					ref.toX = ref.fromX + (HEIGHT - adj) * p.tan(angle * ls * wei)
					const x = p.map(
						y,
						-halfMaxLen + junction,
						halfMaxLen,
						ref.fromX,
						ref.toX
					)
					const h = p.map(wei, 1, minWei, 0, 270)
					const s =
						p.map(y, -halfMaxLen + junction, halfMaxLen, 0, 100) *
						(p.abs(angle) / 45)
					p.stroke(h, s, 100)
					light(x, y, 1, sd)
					wei -= weiStep
				}
			}
			await sleep(100)
		}
	}

	p.draw = () => {}

	const light = (x, y, amount, sd) => {
		for (let i = 0; i < amount; i++) p.point(p.randomGaussian(x, sd), y)
	}

	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
})
