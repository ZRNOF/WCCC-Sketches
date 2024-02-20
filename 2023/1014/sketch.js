// R.O.C. © 2023-10-14 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// 3 colors 🎨 #WCCChallenge
//
// Hi! Raphaël.
// The topic for this week is '3 colors.'
// This week coincides with Taiwan (R.O.C.)'s National Day!
// So I think it's the perfect time to create a piece for our national flag.
// Also inspired by Martijn Steinrucken's artwork 'The American Flag'
// - Shadertoy: https://www.shadertoy.com/view/flsXRM
// - YouTube: https://www.youtube.com/watch?v=t4XnK50ocMk
//
// There might be more Taiwanese participants in WCCC in the future,
// and that's really exciting to think about!
// Thanks to newyellow for his contributions to the Taiwan community!
// Special thanks to Raphaël for making all of this possible. ❤️
// Sharing is the most beautiful thing in the world. 🌏
//
// May the world be at peace, free from conflict.

import Olon from "https://cdn.jsdelivr.net/npm/olon@0.1.0/dist/Olon.min.js"
import { frag, vert } from "./shader.js"

const cloudiness = 1 // (0-1)
const area = [0.2, 1.2] // less cloudy area size, [width(0-2), height(0-2)]
const angle = 60 // degrees, for less cloudy area

const ol = Olon(2000, 600)
ol.enableCanvas2D()

ol.setShader(vert, frag)

ol.sketch()

ol.render(() => {
	ol.clearColor()
	ol.uniform("uResolution", ol.resolution)
	ol.uniform("uCloudiness", cloudiness)
	ol.uniform("uAngle", angle)
	ol.uniform("uArea", area)
	ol.uniform("uTime", ol.frame / 60)
	ol.triangles(0, 6)
})
