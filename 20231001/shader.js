export const vert = `

	in vec2 aPosition;
	in vec2 aOffset;
	in vec2 aTexCoord;

	uniform float uPointSize;
	uniform float uTime;

	out vec2 vTexCoord;
	void main() {
		vTexCoord = aTexCoord;
		vec2 pos = aPosition;
		const float scale = 1.;
		const vec2 speed = vec2(.03, .1);
		pos.x += speed.x*sin(uTime+aOffset.x*100.)*clamp(uTime*.05, 0., 1.);
		pos.y -= speed.y*scale*abs(aOffset.y)*(1.-.5*(pos.y+1.))*pow(uTime, 3.);
		gl_Position = vec4(pos, 0., 1.);
		gl_PointSize = clamp(uPointSize*abs(aOffset.x), 2., uPointSize);
	}
`

export const frag = `
	precision mediump float;

	uniform sampler2D uImage;

	in vec2 vTexCoord;
	out vec4 fragColor;
	void main() {
		vec2 uv = vTexCoord;
		fragColor = texture(uImage, uv);
	}
`
