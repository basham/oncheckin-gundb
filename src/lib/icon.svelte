<script>
  export let name = ''
  export let visible = true
</script>

<style>
  svg {
    --size: var(--size-4);
    height: var(--size);
    pointer-events: none;
    width: var(--size);
  }

  use {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: var(--px-2);
  }

  .invisible {
    visibility: hidden;
  }
</style>

<svg
  aria-hidden="true"
  class:invisible={!visible}>
  <use href={`/icons.svg#${name}`}></use>
</svg>
