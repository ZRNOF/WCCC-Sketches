// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.3/src/Shox.js"

export const RDFrag = `#version 300 es
	#define RED   vec4(1., 0., 0., 1.)
	#define GREEN vec4(0., 1., 0., 1.)

	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 canvasSize;
	uniform vec2 texelSize;
	uniform vec2 mouse;
	uniform float FEED;
	uniform float KILL;
	uniform float DeltaT;
	uniform float Scale;
	uniform float Radius;
	uniform bool Wrap;
	uniform bool Cursor;
	uniform bool Clear;

	${Shox.laplacian}

	float circle(vec2 uv, vec2 pos, float r) {
		float f = max(canvasSize.x, canvasSize.y)/min(canvasSize.x, canvasSize.y);
		vec2 sFac = (canvasSize.x > canvasSize.y) ? vec2(f, 1.) : vec2(1., f);
		float e = 2./canvasSize.x;
		return smoothstep(-e, e, length(uv*sFac-pos*sFac)-r);
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		if (Clear) { fragColor = RED; return; }

		vec2 uv = vTexCoord;
		uv.y = 1.-uv.y;

		/////////////////////////////////////////////
		// Reaction-Diffusion ///////////////////////

		vec2 AB = texture(tex0, uv).xy;
		float A = AB.x;
		float B = AB.y;
		float reaction = A*B*B;

		vec2 LAB = Wrap ? laplacianSWrap(uv, tex0, texelSize) : laplacianS(uv, tex0, texelSize);
		LAB /= 3.;
		float LA = LAB.x;
		float LB = LAB.y;

		float DA = 1./Scale/2.;
		float DB = .5/Scale/2.;

		float newA = A+(DA*LA-reaction+FEED*(1.-A))*DeltaT;
		float newB = B+(DB*LB+reaction-(KILL+FEED)*B)*DeltaT;

		fragColor = vec4(newA, newB, 0., 1.);

		/////////////////////////////////////////////
		// Mouse Interaction ////////////////////////

		float cursor = Cursor ? circle(uv, mouse, Radius) : 1.;
		fragColor = mix(GREEN, fragColor, cursor);
	}
`

export const RenderFrag = `#version 300 es
	precision mediump float;

	uniform sampler2D tex0;
	uniform vec2 canvasSize;
	uniform vec2 texelSize;
	uniform bool Wrap;
	uniform vec3 Brightness;
	uniform vec3 Constrast;
	uniform vec3 Oscilates;
	uniform vec3 Phase;
	uniform bool Emboss;
	uniform float Offset;

	${Shox.iqPalette}
	${Shox.emboss}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;

		float t = Emboss
			? Wrap
				? emboss2VWrap(uv, tex0, texelSize, 1.).r
				: emboss2V(uv, tex0, texelSize, 1.).r
			: texture(tex0, uv).r;

		t += Offset;

		fragColor = vec4( palette(t, Brightness, Constrast, Oscilates, Phase ), 1. );
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
