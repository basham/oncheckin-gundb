<script>
  export let id = ''
  export let label = ''

  const icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <style>
        polyline {
          fill: none;
          stroke: #000;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2px;
        }
      </style>
      <polyline points="3 9 6 12 13 5"/>
    </svg>
  `
  const encodedIcon = window.btoa(icon.replace(/  /g, ''))
  const iconVar = `--icon: url("data:image/svg+xml;base64,${encodedIcon}")`
</script>

<style>
  div {
    width: fit-content;
  }

  label {
    cursor: pointer;
    display: flex;
    font-weight: normal;
    margin: 0;
  }

  input + label::before {
    --color-border: var(--color-base-75);
    --color-background: var(--color-base-100);
    --color-checked: var(--color-base-100);
    --size: var(--size-6);
    background-color: var(--color-checked);
    background-image: var(--icon);
    background-position: 50% 50%;
    background-repeat: no-repeat;
    border-radius: var(--size-1);
    box-shadow:
      inset 0 0 0 var(--px-2) var(--color-border),
      inset 0 0 0 var(--size-1) var(--color-background);
    content: '';
    color: var(--color-background);
    display: inline-block;
    height: var(--size);
    margin-right: var(--size-2);
    width: var(--size);
  }

  input:checked + label::before {
    --color-checked: var(--color-ix);
  }

  input:focus + label::before {
    --color-border: var(--color-ix);
  }

  label span {
    padding: var(--px-2) 0;
  }
</style>

<div class="u-m-top-6">
  <input
    class="u-sr-only"
    id={id}
    type="checkbox">
  <label
    for={id}
    style={iconVar}>
    <span>{label}</span>
  </label>
</div>
