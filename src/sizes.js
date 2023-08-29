/**
 * Sizes
 */



export {sizes};

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
    // Update fireflies
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  });