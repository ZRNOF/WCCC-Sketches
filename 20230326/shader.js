// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.1/src/Shox.js"

export const frag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform vec2 mouse;
	uniform float time;
	uniform vec2 grid;

	${Shox.noiseMath}
	${Shox.snoise3D}
	${Shox.snoise3DImage}
	${Shox.displace}
	${Shox.extend}
	${Shox.smooth}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;

		// tiles
		vec2 tuv = repeat(uv, grid);
		tuv = abs(tuv-.5);
		tuv = vec2(max(tuv.x, tuv.y));
		vec4 tiles = vec4(smoo3(smoo3(smoo3( tuv.x ))));

		// duv, make displace uv for Canvas
		float wei = sin(time*.6)*.02;
		vec2 duv = displace(uv, tiles.rg, 0., wei);
		duv = mirror(duv, 1.);

		// generate noise image
		float scal = min(grid.x, grid.y);
		float gain = 1.;
		float ofst = .5;
		float expo = 1.;
		vec3  move = vec3(0, 0, time*.3);
		vec4 noise = snoise3DImage(uv, scal, gain, ofst, expo, move);

		// displace duv by noise image
		duv = displace(duv, noise.rg, ofst, .01);
		duv = mirror(duv, 1.);

		// tiles shadow
		float shadow = (1.-tiles.x);

		fragColor = vec4(texture(tex0, duv).rgb*shadow, 1.);
	}
`

export const vert = `#version 300 es

	in vec4 aPosition;
	in vec2 aTexCoord;

	out vec2 vTexCoord;

	void main() {
		vTexCoord = aTexCoord;
		gl_Position = aPosition;
	}
`
