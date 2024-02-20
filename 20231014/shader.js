// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.1/src/Shox.js"

export const frag = `
	#define PI    3.141592653589793
	#define TAU   6.283185307179586
	#define WHITE vec3(255.)/255.
	#define BLUE  vec3(0., 41., 204.)/255.
	#define RED   vec3(242., 0., 0.)/255.

	precision mediump float;

	uniform vec2 uResolution;
	uniform float uCloudiness;
	uniform float uAngle;
	uniform vec2 uArea;
	uniform float uTime;

	${Shox.noiseMath}
	${Shox.snoise3D}
	${Shox.snoise3DImage}
	${Shox.displace}
	${Shox.mapFunc}

	float sun(vec2 uv, vec2 pos, float r) {
		// This function is based on Inigo Quilez's sdStar function.
		// Please refer to the following links for more details:
		// - Article: https://iquilezles.org/articles/distfunctions2d/
		// - ShaderToy: https://www.shadertoy.com/view/3tSGDy
		// Original License: The MIT License, Copyright © 2019 Inigo Quilez, Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

		uv = (uv-pos)*2.;
		float w = fwidth(uv.y);
		float an = PI/float(12);
		float en = PI/float(6);
		vec2  acs = vec2(cos(an), sin(an));
		vec2  ecs = vec2(cos(en), sin(en));
		float bn = mod(atan(uv.x, uv.y), 2.0*an) - an;
		vec2 st = length(uv)*vec2(cos(bn), abs(sin(bn)));
		st -= r*acs;
		st += ecs*clamp(-dot(st, ecs), 0., r*acs.y/ecs.y);
		float vertices = smoothstep(w, -w, length(st)*sign(st.x));
		float gap = smoothstep(.5+w*5., .5-w*5., (length(1.764*uv/r)-.5));
		float center = smoothstep(.5+w*5., .5-w*5., (length(2.*uv/r)-.5));
		return clamp(vertices-gap+center, 0., 1.);
	}

	float rect(vec2 uv, vec2 pos, vec2 size, float fw) {
		uv = abs(uv-pos);
		uv = smoothstep(size-fw, size+fw, uv);
		return 1.-max(uv.x, uv.y);
	}

	vec4 noise(vec2 uv, vec3 move) {
		float scal = 3.;
		float gain = 2.;
		float ofst = .5;
		vec4 noise;
		noise  =     1.0*snoise3DImage((uv-vec2(421., 132))*1., scal, gain, ofst, move);
		noise +=     0.5*snoise3DImage((uv-vec2(913., 687))*2., scal, gain, ofst, move);
		noise +=    0.25*snoise3DImage((uv-vec2(834., 724))*4., scal, gain, ofst, move);
		noise +=   0.125*snoise3DImage((uv-vec2(125., 209))*8., scal, gain, ofst, move);
		noise /= 1.875;
		return noise;
	}

	vec2 rotate(vec2 uv, float angle) {
		float s = sin(angle);
		float c = cos(angle);
		mat2 rot = mat2(c, -s, s, c);
		return rot*uv;
	}

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord-.5;
		uv.x *= uResolution.x/uResolution.y;

		// result color
		vec3 color = vec3(0.);

		vec3 move = vec3(uTime*.1);
		vec2 n = noise(uv, move).rg;
		float t = dot(uv, vec2(5., 2.))+uTime;
		vec2 fuv = displace(uv, n, .5, .01);
		fuv = displace(fuv, vec2(sin(t)), .5, .04);

		// flag
		float fw = .001; // blur edge
		float flagSize = 0.75; // (0-1)
		vec2 size = flagSize*vec2(.75, .5);
		float RedEarth = rect(fuv, vec2(0.), size, fw);
		float BlueSky = rect(fuv, vec2(-.5, .5)*size, .5*size, fw);
		float WhiteSun = sun(fuv, vec2(-.5, .5)*size, size.x/2.);
		color = mix(color, RED, RedEarth);
		color = mix(color, BLUE, BlueSky);
		color = mix(color, WHITE, WhiteSun);

		// shadow & light, bunch of magic numbers...
		float shadow = .4*sin(t)+.05*(n.r+n.g-1.);
		float light = .75/length(uv-1.);
		color *= light*.01+smoothstep(0., 1., 1.+shadow);
		color += .4*(light+shadow);

		// sky
		color = mix(BLUE*2.5, color, RedEarth);

		// cloud
		vec2 ruv = rotate(uv, radians(uAngle));
		float showArea = length(ruv*(2.-uArea))-1.;
		vec3 cloud = uCloudiness*vec3(smoothstep(0., 1., uCloudiness+showArea+.2*(n.r+n.g-1.)));
		color += .5*cloud;

		// result
		color = mix(color, cloud, cloud.x);

		fragColor = vec4(color, 1.);
	}
`

export const vert = `

	in vec4 aPosition;
	in vec2 aTexCoord;

	out vec2 vTexCoord;

	void main() {
		vTexCoord = aTexCoord;
		gl_Position = aPosition;
	}
`
