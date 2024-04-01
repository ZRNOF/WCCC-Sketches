// noprotect

// https://github.com/ZRNOF/Shox
import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.2.0/src/Shox.js"

const brightness = `
	// SPDX-License-Identifier: Unlicense
	// This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means. In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	float brightness(vec3 color) {
		return dot(color, vec3(0.2126, 0.7152, 0.0722));
	}
`

export const UPDATE_VERT = `
	precision mediump float;

	uniform vec2 uMouse;
	uniform float uDivisionCount;
	uniform float uScrollValue;
	uniform bool uRecover;
	uniform float uSize;

	in float aAngle;
	out float vAngle;

	void main() {
		float cid = uDivisionCount-float(gl_VertexID);
		float pid = cid-1.;

		float oToMo = length(uMouse*.5);
		float d = uDivisionCount*2./uSize;

		vAngle = uRecover ? aAngle*.975 : aAngle;
		if (pid/d < oToMo && oToMo < cid/d) vAngle += uScrollValue;
	}
`

export const UPDATE_FRAG = `
	precision mediump float;
	void main() { discard; }
`

export const RENDER_VERT = `
	precision mediump float;

	in vec2 aPosition;
	in vec2 aTexCoord;
	in float aAngle;

	out vec2 vTexCoord;
	out float vAngle;
	out float vID;

	uniform float uDivisionCount;
	uniform float uSize;

	void main() {
		vTexCoord = aTexCoord;
		vAngle = aAngle;
		vID = uDivisionCount-float(gl_InstanceID);
		gl_Position = vec4(aPosition*uSize, 0., 1.);
	}
`

export const RENDER_FRAG = `
	precision mediump float;

	in vec2 vTexCoord;
	in float vID;
	in float vAngle;

	out vec4 fragColor;

	uniform sampler2D uTexture;
	uniform vec2 uResolution;
	uniform float uTime;
	uniform float uDivisionCount;
	uniform bool uAutoMove;
	uniform bool uMonochrome;

	${Shox.flip}
	${Shox.hash}
	${Shox.rotate}
	${brightness}

	void main() {
		vec2 uv = flip(vTexCoord);
		uv -= .5;
		uv.x *= uResolution.x/uResolution.y;
		float ts = 1./uResolution.x;

		float circle = smoothstep(ts, -ts, length(uv)-vID/(uDivisionCount*2.));

		float angle = vAngle + (uAutoMove ? sin(uTime+vID*.1) : 0.);
		vec2 ruv = uv*rotate2D(angle)+.5;

		vec3 tex = texture(uTexture, ruv).rgb;
		tex *= tex;
		tex += .1;
		tex -= hash12(uv*314159.26)*.1;

		vec3 col = uMonochrome ? vec3(brightness(tex)) : tex;

		fragColor = vec4(col*circle, circle);
	}
`
