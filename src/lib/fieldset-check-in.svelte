<script>
  import Checkbox from './checkbox.svelte'
  import Fieldset from './fieldset.svelte'

  export let host = false
</script>

<Fieldset>
  <Checkbox
    bind:checked={host}
    id="host"
    label="Host of this event"
    name="host" />
</Fieldset>
