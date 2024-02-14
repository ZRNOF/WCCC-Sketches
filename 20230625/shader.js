// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.1/src/Shox.js"

export const frag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform vec2 mouse;
	uniform float time;

	uniform float iDisplaceWeight;
	uniform float iNoiseSpeed;

	${Shox.noiseMath}
	${Shox.snoise3D}
	${Shox.snoise3DImage}
	${Shox.displace}
	${Shox.hash}

	vec4 noise(vec2 uv, float scal, float gain, float ofst, float expo, vec3 move) {
		vec4 noise;
		noise  =     1.*snoise3DImage((uv-vec2(421., 132))*1., scal, gain, ofst, move);
		noise +=     .5*snoise3DImage((uv-vec2(913., 687))*2., scal, gain, ofst, move);
		noise +=    .25*snoise3DImage((uv-vec2(834., 724))*4., scal, gain, ofst, move);
		noise +=   .125*snoise3DImage((uv-vec2(125., 209))*8., scal, gain, ofst, move);
		noise +=  .0625*snoise3DImage((uv-vec2(387., 99))*16., scal, gain, ofst, move);
		noise /= 1.9375;
		return noise;
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;

		float scal = 40.;
		float gain = 1.;
		float ofst = .5;
		float expo = 1.;
		vec3  move = vec3(0., 0., time*iNoiseSpeed);
		vec4 dimg = noise(uv, scal, gain, ofst, expo, move);
		dimg *= (dimg+hash12(uv*314159.26));

		float wei = iDisplaceWeight;
		vec2 duv = displace(uv, dimg.rg, ofst, wei);

		fragColor = vec4(texture(tex0, duv).rgb, 1.);
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
