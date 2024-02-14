// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.1/src/Shox.js"

export const filterFrag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;

	${Shox.hash}

	float dust(vec2 uv, float oriChannel, float dustChannel, float wei) {
		oriChannel += dustChannel*wei;
		return oriChannel-wei/2.;
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;
		vec4 canvas = texture(tex0, uv);
		float rnd = hash12(uv*314159.26);
		vec4 color = vec4(
			dust(uv, canvas.r, rnd, .08),
			dust(uv, canvas.g, rnd, .08),
			dust(uv, canvas.b, rnd, .08),
			1.
		);
		fragColor = color;
	}
`

export const frag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;
	uniform vec2 mouse;
	uniform float time;

	uniform vec2 grid;
	uniform vec2 gridSize;

	${Shox.noiseMath}
	${Shox.snoise3D}
	${Shox.snoise3DImage}
	${Shox.displace}
	${Shox.gradient}
	${Shox.hash}
	${Shox.voronoi}
	${Shox.mapFunc}

	vec2 scale(vec2 uv, vec2 pos, vec2 scale) {
		return .5+(uv-pos)/scale;
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;
		uv.x *= canvasSize.x/canvasSize.y;
		uv = scale(uv, vec2(.5), gridSize/canvasSize);

		vec2 iuv = floor(uv*grid);
		vec2 fuv = fract(uv*grid)-.5;

		// Noise
		float scal = 10.;
		float gain = 2.;
		float ofst = .5;
		float expo = .5;
		vec3  move = vec3(0.);
		vec4 dimg = 1.*snoise3DImage((uv-vec2(421., 132))*1., scal, gain, ofst, expo, move);
		dimg +=     .5*snoise3DImage((uv-vec2(913., 687))*2., scal, gain, ofst, expo, move);
		dimg +=    .25*snoise3DImage((uv-vec2(834., 724))*4., scal, gain, ofst, expo, move);
		dimg +=   .125*snoise3DImage((uv-vec2(125., 209))*8., scal, gain, ofst, expo, move);
		dimg +=  .0625*snoise3DImage((uv-vec2(387., 99))*16., scal, gain, ofst, expo, move);
		dimg /= 1.9375;

		// Displace
		vec2 duv = displace(uv, dimg.rb, .5, .01);

		// Voronoi
		float rnd12 = hash12(iuv*314159.26);
		float voroScal = 6.+4.*floor(map(rnd12, 0., 1., 0., 4.));
		float voroOfst = rnd12*100.;
		vec4 voro = voronoi(duv*voroScal+voroOfst, vec2(0.), 0.);
		voro.w *= map(rnd12, 0., 1., 1.8, 6.);  // 1.8->thick 6.->thin

		// Easing
		float t = map(pow((time*.01), 4.), 0., 1., .2, -.175);

		// Mask
		vec4 mdimg = snoise3DImage((uv-vec2(913., 687)), 10., 10., .5, 1., vec3(0.));
		vec2 muv = displace(fuv, mdimg.rb, .5, .01);
		float mask = smoothstep(0., 1., length(muv+hash22(iuv*314159.26)-.5)+t);

		float voroContour = step(.1, voro.w+mask);
		voroContour = clamp(0., 1., voroContour);

		// Result
		vec4 buffer = texture(tex0, uv);
		vec4 color = vec4(0.);
		color.rgb = mix(buffer.rgb, vec3(0.), voroContour);
		color.a = 1.-voroContour;

		fragColor = color;
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
