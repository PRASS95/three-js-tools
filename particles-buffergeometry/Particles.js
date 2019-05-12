import Simple1DNoise from 'nsfw/graphics/Simple1DNoise';

/**
 * Particles
 */

class Particles extends THREE.Group {


	constructor(x, y, nb = 100000) {

		super();

		this.originalPosition = {x,y};

		this.position.x = x;
		this.position.y = y;

		this.rotation.z = Math.random() * .3 - .15;

		// vectors
		this.c0 = {x:50.0,y:500.0};
		this.c1 = {x:100.0,y:0.0};
		this.end = {x:300};

		// params
		this.nb = window.isDesktop ? nb : window.isTablet ? Math.floor(nb * .66) : Math.floor(nb * .33);
		if(!window.isGoodGPU) this.nb *= .5; // bad bad bad GPU
		this.time = 0;
		
		// noises
		this.simpleNoise = new Simple1DNoise();

		this.perlinOrigin 	= new THREE.Vector2(Math.random(), Math.random());
		this.perlinC0 		= new THREE.Vector2(Math.random(), -Math.random());
		this.perlinC1 		= new THREE.Vector2(Math.random(), Math.random());
		this.perlinEnd 		= new THREE.Vector2(0, Math.random());

		const starsGeometry = new THREE.BufferGeometry();

		// vertices
		const vertices = [];

		for( let i = 0; i <this.nb; i+=3 ) {

			vertices[i] = 0;
			vertices[i+1] = Math.random() * 100;
			vertices[i+2] = 0;
		}

        starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3 ));

		// progress
		const progress = [];
		for( let i = 0; i <this.nb; i++ ) {

			progress[i] = Math.random();
		}

		starsGeometry.addAttribute('progress', new THREE.BufferAttribute(new Float32Array(progress), 1 ));

		// speeds
		this.speeds = [];
		for( let i = 0; i <this.nb; i++ ) {

			this.speeds[i] = .001 + Math.random() * .01;
		}


		const vert = require('shaders/points.vert.glsl');
		const frag = require('shaders/points.frag.glsl');

		const material = new THREE.ShaderMaterial({
			uniforms: {
				size 		: { type:'f', value: 0.5 },
				time 		: { type:'f', value: 0.0 },
				scale 		: { type:'f', value: 1.0 },
				opacity 	: { type:'f', value: 1.0 },
				uProgress 	: { type:'f', value: 0.0 },
				uC0 		: { type:'v2', value: new THREE.Vector3(0.0,0.0) },
				uC1 		: { type:'v2', value: new THREE.Vector3(0.0,0.0) },
				uEnd 		: { type:'v2', value: new THREE.Vector3(0.0,10.0) },
				diffuse 	: { type:'v3', value: new THREE.Vector3(1.0,1.0,1.0) }
			},
			vertexShader: vert,
			fragmentShader: frag,
			transparent: true,
			depthTest: true
		});

		//window.gui.add( material.uniforms.uProgress, 'value', 0, 1);

		this.starField = new THREE.Points( starsGeometry, material );
		this.add(this.starField);

	}

	changeColor( color ) {

		const {r,g,b} = color;

		TweenMax.to( this.starField.material.uniforms.diffuse.value, .5, {x:r,y:g,z:b, ease:Power3.easeOut});
	}


	render() {

		this.time += .001;

		this.starField.material.uniforms.time.value = this.time;

		// position
		//this.perlinOrigin.x += .0015;
		//this.perlinOrigin.y += .0005;

		//this.position.x += ( ( this.originalPosition.x + this.simpleNoise.getVal( this.perlinOrigin.x ) * 100 - 50 ) - this.position.x ) * .1;
		//this.position.y += ( ( this.originalPosition.y + this.simpleNoise.getVal( this.perlinOrigin.y ) * 50 - 25 ) - this.position.y ) * .1;

		// C0
		this.perlinC0.y += .00195;

		this.c0.y += ( ( this.simpleNoise.getVal( this.perlinC0.y ) * 250 - 125 ) - this.c0.y ) * .1;

		this.starField.material.uniforms.uC0.value.y = this.c0.y;

		// C1
		this.perlinC1.y += .00255;

		this.c1.y += ( ( this.simpleNoise.getVal( this.perlinC1.y ) * 300 - 150 ) - this.c1.y ) * .1;

		this.starField.material.uniforms.uC1.value.y = this.c1.y;

		// End
		this.perlinEnd.x += .0056;

		this.end.x += ( ( this.simpleNoise.getVal( this.perlinC1.x ) * 200 - 25 ) - this.end.x ) * .1;

		this.starField.material.uniforms.uEnd.value.x = this.end.x;

		// particles move
		let progress;

		for( let i = 0; i < this.nb; i++ ) {

			progress = this.starField.geometry.attributes.progress.getX(i);

			if(progress > 1) progress = 0;

			this.starField.geometry.attributes.progress.setX(i, progress + this.speeds[i]);
		}

		this.starField.geometry.attributes.progress.needsUpdate = true;


	}

	

}

export default Particles;