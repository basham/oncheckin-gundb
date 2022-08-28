<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/event.svelte'
  import FieldsetEvent from '@src/client/lib/fieldset-event.svelte'

  const { h2, event } = getContext('data')
  const { name, date, count } = event
</script>

<Layout>
  <h2>{h2}</h2>
  <form
    autocomplete="off"
    method="post">
    <div class="u-m-top-4">
      <FieldsetEvent
        name={name}
        date={date}
        count={count} />
    </div>
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
