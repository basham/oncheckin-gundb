<script>
  import { getContext } from 'svelte';
  import Layout from '@src/client/layouts/org.svelte'
  import FieldsetEvent from '@src/client/lib/fieldset-event.svelte'

  const { heading, date } = getContext('data')
</script>

<Layout>
  <h1>{heading}</h1>
  <form
    autocomplete="off"
    method="post">
    <FieldsetEvent date={date} />
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
