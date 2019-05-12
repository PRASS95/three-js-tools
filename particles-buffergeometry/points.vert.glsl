uniform float size;
uniform float scale;
uniform float time;
uniform float uProgress;
uniform vec2 uC0;
uniform vec2 uC1;
uniform vec2 uEnd;

attribute float progress;

varying vec3 vPosition;

#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

@import ./simplex-noise-3d;


// p0: start position
// c0: control point 1
// c1: control point 2
// p1: end position
vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t) {   
  float tn = 1.0 - t;
	  return 
	    tn * tn * tn * p0 + 
	    3.0 * tn * tn * t * c0 + 
	    3.0 * tn * t * t * c1 + 
	    t * t * t * p1;
}

void main() {

	#include <color_vertex>
	#include <begin_vertex>

	vec3 p = transformed;

	vec3 c0 	= vec3(50., 50. + transformed.y + uC0.y, 0.0);
	//c0.y 		+= sin(time * 10.0) * 20.0 * cos( sin(time * 5.0)) * 6.;
	vec3 c1 	= vec3(100., -50. + transformed.y + uC1.y,0.0);
	vec3 end 	= vec3(200. + uEnd.x, 10. + transformed.y,0.0);


	vec3 bezier = cubicBezier(p, c0, c1, end, progress);

	//transformed.y += snoise(vec3(0.0,time,0.0)) * 100.;
	
	transformed += mix(vec3(bezier.x, 100.0 , 0.0),bezier, transformed.y / -100. );

	vPosition = transformed;

	#include <project_vertex>

	#ifdef USE_SIZEATTENUATION
		gl_PointSize = size * ( scale / - mvPosition.z );
	#else
		gl_PointSize = size;
	#endif


	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
