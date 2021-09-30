<script>
  export let legend = ''
</script>

<style>
  div {
    background-color: var(--color-base-90);
    border-radius: var(--size-1);
    border: var(--px-1) solid var(--color-base-100);
    padding: var(--size-4);
    margin-top: var(--size-4);
  }

  fieldset {
    border: none;
    display: block;
  }
</style>

<div class={$$props.class}>
  <fieldset class="u-m-0 u-p-0">
    <legend class="u-p-0 u-ts-2">{legend}</legend>
    <slot></slot>
  </fieldset>
</div>
