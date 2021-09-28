<script>
  export let legend = ''
  export let name = ''
  export let options = []

  $: _options = options
    .map((label) => {
      const value = label.toLowerCase()
      return {
        id: `${name}-${value}`,
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

  input + label::before {
    --color-border: var(--color-base-70);
    --color-background: var(--color-base-100);
    --color-radio: var(--color-base-100);
    --size: var(--size-5);
    align-items: center;
    background-color: var(--color-base-100);
    border-radius: 50%;
    box-shadow:
      inset 0 0 0 var(--px-2) var(--color-border),
      inset 0 0 0 calc(var(--size-1) + var(--px-1)) var(--color-background),
      inset 0 0 0 var(--size-3) var(--color-radio);
    content: '';
    display: inline-block;
    height: var(--size);
    margin-right: var(--size-2);
    width: var(--size);
  }

  input:checked + label::before {
    --color-radio: var(--color-base-5);
  }

  input:checked:focus + label::before {
    --color-border: var(--color-ix);
  }
</style>

<fieldset>
  <legend>{legend}</legend>
  <ul>
    {#each _options as option}
      <li>
        <input
          class="u-sr-only"
          id={option.id}
          name={option.name}
          type="radio"
          value={option.value}>
        <label for={option.id}>{option.label}</label>
      </li>
    {/each}
  </ul>
</fieldset>
