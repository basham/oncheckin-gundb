<script>
  import Checkbox from './checkbox.svelte'
  import Fieldset from './fieldset.svelte'
  import RadioGroup from './radio-group.svelte'

  const paymentOptions = ['Cash', 'Prepaid card', 'Online', 'IOU', 'Waived']
</script>

<Fieldset>
  <Checkbox
    checked={true}
    id="arrived"
    label="Arrived at this event" />
  <Checkbox
    class="u-m-top-2"
    id="host"
    label="Host of this event" />
</Fieldset>
<RadioGroup
  legend="Payment"
  name="payment"
  options={paymentOptions} />
