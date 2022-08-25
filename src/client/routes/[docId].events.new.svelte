<script>
  import { getContext } from 'svelte';
  import { eventStore } from '@src/client/stores.js'
  import Layout from '@src/client/layouts/workspace.svelte'
  import FieldsetEvent from '@src/client/lib/fieldset-event.svelte'

  const title = 'New event'
  const { docId } = getContext('params')

  let name = ''
  let date = (new Date()).toJSON().split('T')[0]
  let count = ''

  async function submit (e) {
    e.preventDefault()
    const event = await eventStore.create(docId, { name, date, count })
    window.location = event.url
  }
</script>

<Layout title={title}>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <FieldsetEvent
      bind:name={name}
      bind:date={date}
      bind:count={count} />
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
