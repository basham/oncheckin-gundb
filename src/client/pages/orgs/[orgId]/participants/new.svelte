<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/org.svelte'
  import FieldsetParticipantName from '@src/client/lib/fieldset-participant-name.svelte'

  const { h1 } = getContext('data')
</script>

<Layout>
  <h1>{h1}</h1>
  <form
    autocomplete="off"
    method="post">
    <FieldsetParticipantName />
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
