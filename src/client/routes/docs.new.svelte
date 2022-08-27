<script>
  import Layout from '@src/client/layouts/public.svelte'
</script>

<Layout>
  <form
    autocomplete="off"
    method="post">
    <div class="u-m-top-6">
      <label for="databaseNameInput">Database name</label>
      <br>
      <input
        class="input"
        id="databaseNameInput"
        name="name"
        type="text">
    </div>
    <div class="u-m-top-6">
      <button
        class="button button--primary"
        type="submit">
        Save
      </button>
    </div>
    <div class="u-m-top-6">
      <a href="/account">Back to account</a>
    </div>
  </form>
</Layout>
