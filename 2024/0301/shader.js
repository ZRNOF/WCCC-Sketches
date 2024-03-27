export const vert = `

	in vec4 aPosition;
	in vec2 aTexCoord;

	out vec2 vTexCoord;
	void main() {
		vTexCoord = aTexCoord;
		gl_Position = aPosition;
	}
`

export const frag = `
	precision mediump float;

	#define PI  3.141592653589793
	#define TAU 6.283185307179586

	#define UV_SCALE  .6

	#define MAX_STEPS 100
	#define MAX_DIST  100.
	#define EPSILON   .001

	#define LIGHT_COLOR    vec3(1.,  1.,  1.)
	#define AMBIENT_COLOR  vec3(0., .02, .03)
	#define SPECULAR_COLOR vec3(1.,  1.,  1.)
	#define DIFFUSE_COLOR  vec3(0., .02, .03)
	#define SHININESS      7.

	#define FOG_COLOR vec3(0., .01, .01)

	uniform vec2 iResolution;
	uniform float iTime;

	// The MIT License
	// Copyright © Inigo Quilez
	// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	// https://iquilezles.org/articles/distfunctions/
	float sdRoundBox(vec3 p, vec3 b, float r) {
		vec3 q = abs(p)-b;
		return length(max(q, 0.0))+min(max(q.x, max(q.y, q.z)), 0.0)-r;
	}

	float sdCross(vec3 p, float l, float s, float r) {
		float b1 = sdRoundBox(p, vec3(s, l, s), r);
		float b2 = sdRoundBox(p, vec3(l, s, s), r);
		return min(b1, b2);
	}

	// The MIT License
	// Copyright © 2014 David Hoskins
	// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	// https://www.shadertoy.com/view/4djSRW
	float hash13(vec3 p3) {
		p3 = fract(p3*.1031);
		p3 += dot(p3, p3.zyx+31.32);
		return fract((p3.x+p3.y)*p3.z);
	}

	// SPDX-License-Identifier: Unlicense
	// This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means. In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	mat2 rotate2D(float angle) {
		float s = sin(angle);
		float c = cos(angle);
		return mat2(c,-s, s, c);
	}

	float world(vec3 p) {
		// Domain Repetition (id & r)
		// The MIT License
		// Copyright © Inigo Quilez
		// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		// https://iquilezles.org/articles/sdfrepetition/
		float s = 10.;
		vec3 id = round(p/s);
		vec3  r = p-s*id;

		// rotate
		float hash = hash13(id*PI*1000.);
		r.xy *= rotate2D(PI/4.);
		r.xz *= rotate2D(iTime+hash*TAU);
		r.yz *= rotate2D(iTime+hash*TAU);

		return .78*sdCross(r, 2., .5, .1);
	}

	float RayMarch(vec3 ro, vec3 rd) {
		float tot = 0.;
		for (int i = 0; i < MAX_STEPS; i++) {
			vec3 p  = ro+tot*rd;
			float d = world(p);
			if (abs(d) < EPSILON || tot > MAX_DIST) break;
			tot += d;
		}
		return tot;
	}

	// The MIT License
	// Copyright © Inigo Quilez
	// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	// https://iquilezles.org/articles/normalsSDF/
	vec3 calcNormal(vec3 p) {
		const float h = 0.0001;
		const vec2 k = vec2(1,-1);
		return normalize(k.xyy*world(p+k.xyy*h)+k.yyx*world(p+k.yyx*h)+k.yxy*world(p+k.yxy*h)+k.xxx*world(p+k.xxx*h));
	}

	// SPDX-License-Identifier: Unlicense
	// This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means. In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	vec3 BlinnPhong(vec3 p, vec3 LightPos, vec3 ViewPos) {
		vec3 LightDir = normalize(LightPos - p);
		vec3 ViewDir  = normalize(ViewPos  - p);
		vec3 HalfDir  = normalize(LightDir + ViewDir);

		vec3 Normal   = calcNormal(p);

		float diffuseFactor  = max(dot(Normal, LightDir), 0.);
		vec3 diffuse  = DIFFUSE_COLOR*LIGHT_COLOR*diffuseFactor;

		float specularFactor = pow(max(dot(Normal, HalfDir), 0.), SHININESS);
		vec3 specular = SPECULAR_COLOR*LIGHT_COLOR*specularFactor;

		return AMBIENT_COLOR+diffuse+specular;
	}

	// SPDX-License-Identifier: Unlicense
	// This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means. In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	vec3 fog(vec3 sceneColor, vec3 fogColor, float dist) {
		float amt = 1./(1.+pow(dist, 2.2)*.001);
		return mix(fogColor, sceneColor, amt);
	}

	out vec4 fragColor;
	in vec2 vTexCoord;
	void main() {
		vec2 uv = (gl_FragCoord.xy*2.-iResolution.xy)/min(iResolution.x, iResolution.y);
		uv *= UV_SCALE;

		vec3 ro = vec3(0., 0., -7);
		vec3 rd = normalize(vec3(uv, 1.));

		mat2 rxy = rotate2D(cos(iTime*.75)*.25);
		mat2 rxz = rotate2D(sin(iTime*.75)*.25);
		mat2 ryz = rxy;

		ro.xy *= rxy; rd.xy *= rxy;
		ro.xz *= rxz; rd.xz *= rxz;
		ro.yz *= ryz; rd.yz *= ryz;

		vec3 col = vec3(0.);

		float d = RayMarch(ro, rd);

		if (d < MAX_DIST) {
			vec3 p = ro+rd*d;
			vec3 LightPos = vec3(0., 0., -30.);
			vec3 ViewPos  = vec3(0., 0., -30.);
			col = BlinnPhong(p, LightPos, ViewPos);
		}

		col = fog(col, FOG_COLOR, d);

		fragColor = vec4(col, 1.);
	}
`
