<script>
  export let legend = ''
  export let name = ''
  export let onSelected = () => {}
  export let options = []
  export let selected = -1

  $: _options = options
    .map((label, i) => {
      const value = label.toLowerCase().replace(/ /g, '-')
      return {
        checked: i === selected,
        id: `${name}-${value}-radio`,
        label,
        name,
        value
      }
    })
</script>

<style>
  fieldset {
    border: none;
    display: block;
    margin: var(--size-6) 0 0 0;
    padding: 0;
  }

  legend {
    font-size: var(--fs-2);
    line-height: var(--lh-2);
    padding: 0;
  }

  ul {
    list-style-type: '';
    margin: 0;
    padding: 0;
  }

  li {
    margin-top: var(--size-2);
    width: fit-content;
  }

  label {
    cursor: pointer;
    display: flex;
    font-weight: normal;
    margin: 0;
  }

  .radio {
    --color-border: var(--color-base-75);
    --color-background: var(--color-base-100);
    --color-checked: var(--color-base-100);
    --size: var(--size-6);
    background-color: var(--color-base-100);
    border-radius: 50%;
    box-shadow:
      inset 0 0 0 var(--px-2) var(--color-border),
      inset 0 0 0 calc(var(--size-1) + var(--px-1)) var(--color-background),
      inset 0 0 0 var(--size-3) var(--color-checked);
    content: '';
    display: inline-block;
    flex-shrink: 0;
    height: var(--size);
    margin-right: var(--size-2);
    width: var(--size);
  }

  .text {
    padding: var(--px-2) 0;
  }

  input:checked + label .radio {
    --color-checked: var(--color-ix);
  }

  input:focus + label .radio {
    --color-border: var(--color-ix);
  }
</style>

<fieldset on:change={onSelected}>
  <legend>{legend}</legend>
  <ul>
    {#each _options as option}
      <li>
        <input
          checked={option.checked}
          class="u-sr-only"
          id={option.id}
          name={option.name}
          type="radio"
          value={option.value}>
        <label for={option.id}>
          <span class="radio"></span>
          <span class="text">{option.label}</span>
        </label>
      </li>
    {/each}
  </ul>
</fieldset>
