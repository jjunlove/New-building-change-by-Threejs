import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { TorusGeometry } from 'three'
import gsap from 'gsap'

/**
 * Debug
 */
// const gui = new dat.GUI()


// gui
// .addColor(parameters, 'materialColor')
// .onChange( () => 
// {
//     material.color.set(parameters.materialColor)
//     particlesMaterial.color.set(parameters.materialColor)
// })

const parameters1 = {
    materialColor: '#2E64FE'
}
const parameters2 = {
    materialColor: '#FF4000'
}
const parameters3 = {
    materialColor: '#A9F5E1'
}
const particleParameters = {
    materialColor: '#F5A9F2'
}


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
// gradientTexture.magFilter = THREE.NearestFilter

// Material
const material1 = new THREE.MeshToonMaterial({ 
    color: parameters1.materialColor,
    gradientMap: gradientTexture,
    wireframe : true

})
const material2 = new THREE.MeshToonMaterial({ 
    color: parameters2.materialColor,
    gradientMap: gradientTexture,
    wireframe : true

})
const material3 = new THREE.MeshToonMaterial({ 
    color: parameters3.materialColor,
    gradientMap: gradientTexture,
    wireframe : true

})

// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1,2,2,2),
    material1
)
const mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 16),
    material2
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(.5,.3,100,16),
    material3
)

const objectDistance = 4
const meshHeight = 0.7

mesh1.position.y = -objectDistance * 0 + meshHeight
mesh2.position.y = -objectDistance * 1 + meshHeight
mesh3.position.y = -objectDistance * 2 + meshHeight

// mesh1.position.x = 1
// mesh2.position.x = -1
// mesh3.position.x = 1

const meshScale = .4

mesh1.scale.set(meshScale, meshScale, meshScale)
mesh2.scale.set(meshScale, meshScale, meshScale)
mesh3.scale.set(meshScale, meshScale, meshScale)


scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
// Geometry
const particlesCount = 400
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: particleParameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    // if(newSection != currentSection)
    // {
    //     currentSection = newSection

    //     gsap.to(
    //         sectionMeshes[currentSection].rotation,
    //         {
    //             duration: 1.5,
    //             ease: 'power2.inOut',
    //             x: '+=6',
    //             y: '+=3',
    //             z: '+=1.5',
    //         }
    //     )
    // }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = event.clientY / sizes.height -0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // console.log(deltaTime)

    // Animate Camera
    camera.position.y = -scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate Meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.y += deltaTime * 0.12
        mesh.rotation.x += deltaTime * 0.1
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()