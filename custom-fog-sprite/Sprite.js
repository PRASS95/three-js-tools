
class Sprite extends THREE.Sprite {

    constructor( spriteMap ) {

        const customUniforms = {...THREE.ShaderLib.basic.uniforms};

        customUniforms.map.value = spriteMap;
        customUniforms.fogFar.value = 500;
        customUniforms.fogNear.value = 50;

        const mat = new THREE.ShaderMaterial({
            defines: {'USE_MAP':true, 'USE_FOG':true},
            uniforms:customUniforms,
            fragmentShader: require('./sprite.frag.glsl'),
            vertexShader: THREE.ShaderLib.basic.vertexShader,
            side:THREE.DoubleSide,
            transparent:true
        })

        super( mat );

        this.scale.multiplyScalar(100);

    }

}

export default Sprite;