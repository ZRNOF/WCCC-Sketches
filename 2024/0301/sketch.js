// Nope © 2024-03-01 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Nope 🙅‍♂️ #WCCChallenge
//
// Hi!
//
// This is my second submission for "Nope".
// You can definitely skip this one,
// but I'm glad we met again this week.✨
//
// Here is my first time making an SDF-based creative coding work.
// Thanks to Inigo Quilez and David Hoskins for their amazing works.
//
// Inigo Quilez's articles:
//   https://iquilezles.org/articles/
// David Hoskins's hash functions:
//   https://www.shadertoy.com/view/4djSRW
//
// "Olon" is my little WebGL2 tool that I'm building in my spare time.
// While there is still much work to be done and many fixes to be made,
// it currently meets most of my needs.
//
// Special thanks to Andrew Adamson for his WebGL2 tutorial
// and to Stefan Gustavson for his encouragement!
//
// Andrew Adamson's tutorial:
//   https://www.youtube.com/playlist?list=PLPbmjY2NVO_X1U1JzLxLDdRn4NmtxyQQo
// Stefan Gustavson's GitHub:
//   https://github.com/stegu
//
// There are so many people to thank!
// Anyway, happy coding!

import Olon from "https://cdn.jsdelivr.net/npm/olon@0.2.3/dist/Olon.min.js"
import { vert, frag } from "./shader.js"

const ol = Olon(innerWidth, innerHeight, true)
ol.fullscreen()

ol.setShader(vert, frag)

ol.sketch()

ol.render(() => {
	ol.clearColor()
	ol.uniform("iResolution", ol.resolution)
	ol.uniform("iTime", ol.seconds)
	ol.triangles(0, 6)
})
