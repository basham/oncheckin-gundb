<script>
  export let legend = ''
</script>

<style>
  fieldset {
    border: none;
    display: block;
  }
</style>

<div class={`card u-m-top-6 ${$$props.class}`}>
  <fieldset class="u-m-0 u-p-0">
    <legend class="u-p-0 u-ts-3">{legend}</legend>
    <slot></slot>
  </fieldset>
</div>
