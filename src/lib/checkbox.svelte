<script>
  import Icon from './icon.svelte'

  export let checked = false
  export let id = ''
  export let label = ''
  export let name = ''
</script>

<style>
  div {
    width: fit-content;
  }

  label {
    cursor: pointer;
    display: flex;
    font-weight: normal;
  }

  .checkbox {
    --color-border: var(--color-base-70);
    --color-background: var(--color-base-90);
    --color-checked: var(--color-base-90);
    --size: var(--size-6);
    align-items: center;
    background-color: var(--color-checked);
    border-radius: var(--size-1);
    box-shadow:
      inset 0 0 0 var(--px-2) var(--color-border),
      inset 0 0 0 var(--size-1) var(--color-background);
    color: var(--color-background);
    display: inline-flex;
    flex-shrink: 0;
    height: var(--size);
    justify-content: center;
    margin-right: var(--size-2);
    width: var(--size);
  }

  .text {
    padding: var(--px-2) 0;
  }

  input:checked + label .checkbox {
    --color-checked: var(--color-ix);
  }

  input:checked:hover + label .checkbox {
    --color-checked: var(--color-base-25);
  }

  input:focus + label .checkbox {
    _outline: var(--px-2) solid var(--color-ix);
    --color-border: var(--color-ix);
  }
</style>

<div class={$$props.class}>
  <input
    bind:checked={checked}
    class="u-sr-only"
    id={id}
    name={name}
    type="checkbox">
  <label
    class="u-m-0"
    for={id}>
    <span class="checkbox">
      <Icon name="check" />
    </span>
    <span class="text">{label}</span>
  </label>
</div>
