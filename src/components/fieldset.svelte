<script>
  export let legend = ''
</script>

<style>
  div {
    background-color: var(--color-base-90);
    border-radius: var(--size-1);
    border: var(--px-1) solid var(--color-base-100);
    padding: var(--size-4);
    margin: var(--size-4) 0 0 0;
  }

  fieldset {
    border: none;
    display: block;
    margin: 0;
    padding: 0;
  }

  legend {
    font-size: var(--fs-2);
    line-height: var(--lh-2);
    padding: 0;
  }
</style>

<div class={$$props.class}>
  <fieldset>
    <legend>{legend}</legend>
    <slot></slot>
  </fieldset>
</div>
