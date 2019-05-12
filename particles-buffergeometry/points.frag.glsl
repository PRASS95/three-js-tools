uniform vec3 diffuse;
uniform float opacity;
uniform float time;

uniform vec2 uEnd;


//varying float vProgress;
varying vec3 vPosition;
//varying vec2 vUv;

#include <common>
#include <packing>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

float distanceFromCircle(vec2 point, float radius) {
	return length(point) - radius;
}

void main() {

	#include <clipping_planes_fragment>

	// original radius 200, divided by 300 -> ellipsis
	vec2 pt = vec2( (vPosition.x * 2.0 - 200.0) / (300.0 + uEnd.x), ( ( vPosition.y * 2.0 - 200.) / 200.0) - 1.25);

	float alphaCircle = distanceFromCircle(pt, .025);
	float alphaPosition = sin(vPosition.x / (200.0 + uEnd.x) * 3.14);


	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse,  ( 1.0 - alphaCircle ) * alphaPosition);
	//vec4 diffuseColor = vec4( diffuse, alphaPosition );

	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>

	outgoingLight = diffuseColor.rgb;

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	//gl_FragColor = vec4( outgoingLight, alphaPosition );

	#include <premultiplied_alpha_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>

}