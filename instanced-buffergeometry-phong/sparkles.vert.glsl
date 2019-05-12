precision highp float;

uniform float sineTime;
uniform float time;

#define PHONG
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

//attribute vec3 positions;
attribute vec3 offset;
attribute vec4 color;
attribute vec4 orientations;
attribute float progress;

// cf http://barradeau.com/blog/?p=1109

vec3 transform( inout vec3 position, vec4 R ) {
    //applies the scale
    //position *= S;
    //computes the rotation where R is a (vec4) quaternion
    position += 2.0 * cross( R.xyz, cross( R.xyz, position ) + R.w * position );
    //translates the transformed 'blueprint'
    //position += T;
    //return the transformed position
    return position;
}


void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif

    #include <begin_vertex>

    vec3 of = offset;
    of.y -= 800. * progress;
    of.z += 800. * progress;

    vec3 p = transformed;
    vec4 r = orientations;
    transform(p, r);

    transformed = vec3(of + p);

	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
    vViewPosition = -mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}