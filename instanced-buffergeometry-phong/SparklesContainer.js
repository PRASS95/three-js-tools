/**
 * Sparkles Container
 */

class SparklesContainer extends THREE.Mesh {

    constructor( gui ) {

        //this.items = [];

        const nbItems = 1600;

        // geometry
        const vector = new THREE.Vector4();
        const offsets = [];
        const speed = [];
        const progress = [];
        const colors = [];
        const orientations = [];
        const rVector = new THREE.Vector3();
        const rotations = [];

        const vertices = new Float32Array( [
            -3.0, -5.0,  0.0,
             3.0, -5.0,  0.0,
             3.0,  5.0,  0.0,

             3.0,  5.0,  0.0,
            -3.0,  5.0,  0.0,
            -3.0, -5.0,  0.0
        ] );

        const d = 800;

        // instanced attributes
        for ( let i = 0; i < nbItems; i ++ ) {

            // offsets
            const x = Math.random() * 2800 - 1400;
            const y = 800;
            const z = Math.random() * 4000 - 2000;
            offsets.push( x, y, z );

            // color
            colors.push( .99, 1, .99, 1.0 );

            // orientation start
            vector.set( Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI, 0 );
            vector.normalize();
            orientations.push( vector.x, vector.y, vector.z, vector.w );

            speed[i] = ( 1.5 + Math.random() * 3 ) / d;
            progress[i] = Math.random() * .9;

            rVector.set(speed[i] * d * .07, speed[i] * d * .06, speed[i] * d * .05);
            rotations[i] = rVector;
        }

        // geo
        const geometry = new THREE.InstancedBufferGeometry();
        geometry.maxInstancedCount = nbItems; 
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
        geometry.addAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
        geometry.addAttribute( 'orientations', new THREE.InstancedBufferAttribute( new Float32Array( orientations ), 4 ) );
        geometry.addAttribute( 'progress', new THREE.InstancedBufferAttribute( new Float32Array( progress ), 1 ) );
        geometry.computeVertexNormals();

        // material
        const customUniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.phong.uniforms,
            {
                time: { type: 'f', value: 0 },
                sineTime: { type: 'f', value: 0 },
                diffuse: {type: 'v3', value: new THREE.Color(0xfefffe) },
            }
        ]);

        const material = new THREE.ShaderMaterial( {
            uniforms: customUniforms,
            vertexShader: require('./sparkle.vert.glsl'),
            fragmentShader: THREE.ShaderLib.phong.fragmentShader,
            side: THREE.DoubleSide,
            lights:true,
            fog:true
        });

        super(geometry, material);

        // PARAMS
        this.matrixAutoUpdate = false;
        this.frustumCulled = false;
        this.updateMatrix();

        this.speed = speed;
        this.rotations = rotations;
        this.lastTime = 0;

        this.attProgress = this.geometry.attributes.progress;
        this.attRotation = this.geometry.attributes.orientations;

        this.moveQ = new THREE.Quaternion( 0.5, 0.5, 0.5, 0.0 ).normalize(); // .5 = 1deg
	    this.tmpQ = new THREE.Quaternion(); // temp (multiplier)
        this.currentQ = new THREE.Quaternion(); 
    }

    update() {

        this.material.uniforms.time.value += 0.025;
        this.material.uniforms.sineTime.value = Math.sin( this.material.uniforms.time.value );

        // progress
        let p;

        for( let i = 0, l = this.attProgress.count; i < l; i++) {

            p = this.attProgress.getX(i);

            if( p > 1)
                this.attProgress.setX(i,0);
            else
                this.attProgress.setX(i, p + this.speed[i]);

        }

        this.attProgress.needsUpdate = true;


        // rotation
        const time = performance.now();
        const delta = ( time - this.lastTime );// / 5000;
        
		for ( let i = 0, j = 0, ul = this.attRotation.count; i < ul; i ++ ) {
            
            const customDelta = delta * this.speed[i];

            this.tmpQ.set( this.moveQ.x * customDelta, this.moveQ.y * customDelta, this.moveQ.z * customDelta, 1 ).normalize();

			this.currentQ.set( this.attRotation.array[ j ], this.attRotation.array[ j + 1 ], this.attRotation.array[ j + 2 ], this.attRotation.array[ j + 3 ] );
			this.currentQ.multiply( this.tmpQ );
            this.attRotation.setXYZW( i, this.currentQ.x, this.currentQ.y, this.currentQ.z, this.currentQ.w );
            
            j+=4;
        }
        
		this.attRotation.needsUpdate = true;
		this.lastTime = time;

    }

}

export default SparklesContainer;