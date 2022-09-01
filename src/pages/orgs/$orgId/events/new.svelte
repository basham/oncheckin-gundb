<script>
  import { getContext } from 'svelte';
  import Layout from '@src/pages/orgs/$orgId/layout.svelte'
  import FieldsetEvent from '@src/lib/fieldset-event.svelte'

  const { h1, date } = getContext('data')
</script>

<Layout>
  <h1>{h1}</h1>
  <form
    autocomplete="off"
    method="post">
    <FieldsetEvent date={date} />
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
