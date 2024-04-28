function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform = "";
  /**
   * The translations we use to calculate are always relative to the viewport coordinate space.
   * But when we apply scales, we also scale the coordinate space of an element and its children.
   * For instance if we have a treeScale (the culmination of all parent scales) of 0.5 and we need
   * to move an element 100 pixels, we actually need to move it 200 in within that scaled space.
   */
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  if (xTranslate || yTranslate) {
    transform = `translate3d(${xTranslate}px, ${yTranslate}px, 0) `;
  }
  /**
   * Apply scale correction for the tree transform.
   * This will apply scale to the screen-orientated axes.
   */
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { rotate, rotateX, rotateY } = latestTransform;
    if (rotate) transform += `rotate(${rotate}deg) `;
    if (rotateX) transform += `rotateX(${rotateX}deg) `;
    if (rotateY) transform += `rotateY(${rotateY}deg) `;
  }
  /**
   * Apply scale to match the size of the element to the size we want it.
   * This will apply scale to the element-orientated axes.
   */
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform || "none";
}

export { buildProjectionTransform };
