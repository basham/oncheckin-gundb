<script>
  import { getContext } from 'svelte'
  import Layout from '@src/client/layouts/org.svelte'

  const { heading, org } = getContext('data')
</script>

<Layout>
  <h1>{heading}</h1>
  <form
    autocomplete="off"
    method="post">
    <div class="u-m-top-4">
      <label for="orgNameField">Organization name</label>
      <br>
      <input
        class="input"
        id="orgNameField"
        name="name"
        type="text"
        value={org.name}>
    </div>
    <div class="u-m-top-4">
      <button class="button button--primary" type="submit">Save</button>
    </div>
  </form>
</Layout>
