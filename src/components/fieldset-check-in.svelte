<script>
  import Checkbox from './checkbox.svelte'
  import Fieldset from './fieldset.svelte'
  import RadioGroup from './radio-group.svelte'

  export let arrived = false
  export let host = false
  export let payment = null

  const paymentOptions = ['Cash', 'Prepaid card', 'Online', 'IOU', 'Waived']
</script>

<Fieldset>
  <Checkbox
    bind:checked={arrived}
    id="arrived"
    label="Arrived at this event" />
  <Checkbox
    bind:checked={host}
    class="u-m-top-2"
    id="host"
    label="Host of this event" />
</Fieldset>
<RadioGroup
  bind:value={payment}
  legend="Payment"
  name="payment"
  options={paymentOptions} />
