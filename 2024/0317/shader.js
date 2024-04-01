import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.3/src/Shox.js"

const FRAG = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 texelSize;
	uniform vec2 canvasSize;

	${Shox.hash}

	float dust(vec2 uv, float oriChannel, float dustChannel, float wei) {
		oriChannel += dustChannel*wei;
		return oriChannel-wei/2.;
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;
		float rnd = hash12(uv*314159.26);
		vec4 canvas = texture(tex0, uv);
		vec4 color = vec4(
			dust(uv, canvas.r, rnd, .1*.8),
			dust(uv, canvas.g, rnd, .2*.8),
			dust(uv, canvas.b, rnd, .3*.8),
			1.
		);
		fragColor = color;
	}
`

export default FRAG
