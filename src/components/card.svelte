<script>
  export { clazz as class }
  export let heading

  let clazz
</script>

<style>
  .card {
    background-color: var(--color-base-90);
    border-radius: var(--size-2);
    display: grid;
    grid-template-areas:
      "heading actions"
      "body body";
    grid-template-columns: 1fr auto;
    padding: var(--size-4);
  }

  .heading {
    grid-area: heading;
    padding: var(--px-2) 0;
  }

  .actions {
    grid-area: actions;
  }

  .body {
    grid-area: body;
  }

  .body:not(:empty) {
    margin-top: var(--size-4);
  }
</style>

<div class={`card ${clazz || ''}`}>
  <h2 class="heading">{heading}</h2>
  <div class="actions">
    <slot name="actions"></slot>
  </div>
  <div class="body">
    <slot></slot>
  </div>
</div>
