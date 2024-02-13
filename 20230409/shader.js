// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.1/src/Shox.js"

export const filterFrag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform vec2 mouse;
	uniform float time;

	uniform sampler2D iTaiwan;

	vec4 invert(vec4 color) {
		vec3 ivrt = vec3(1.-color);
		return vec4(ivrt, 1.);
	}

	vec4 colorAdjust(vec4 color, float brightness, float contrast, float saturation) {
		vec3 RGB = color.rgb;
		RGB *= brightness;
		RGB = (RGB-.5)*contrast+.5;
		vec3 gray = vec3(dot(RGB, vec3(.2126, .7152, .0722)));
		RGB = mix(gray, RGB, saturation);
		return vec4(RGB, color.a);
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;

		vec4 color = texture(tex0, uv);
		vec4 taiwan = texture(iTaiwan, uv);
		vec4 ivrtColor = invert(color);

		color = mix(
			ivrtColor+vec4(.25, .3, .3, 1.),
			color+vec4(.2, .1, .5, 1.), 
			taiwan.r
		);

		fragColor = colorAdjust(color, .8, 1.5, 1.5);
	}
`

export const frag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform vec2 mouse;
	uniform float time;

	${Shox.noiseMath}
	${Shox.snoise3D}
	${Shox.snoise3DImage}
	${Shox.displace}
	${Shox.hash}

	float circle(vec2 uv, vec2 pos, float r, float blur) {
		return smoothstep(r+blur, r-blur, length(uv-pos));
	}

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
		vec3  move = vec3(0., 0., time*.0025);
		vec4 dimg = noise(uv, scal, gain, ofst, expo, move);
		dimg *= (dimg+hash12(uv*314159.26));

		float wei = .005;
		vec2 duv = displace(uv, dimg.rg, ofst, wei);

		vec3 color = texture(tex0, duv).rgb;

		float cursor = circle(uv, mouse, .001, .035);
		color = mix(color, vec3(0.), cursor);

		fragColor = vec4(color, 1.);
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
