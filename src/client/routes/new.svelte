<script>
  import Layout from '@src/client/layouts/public.svelte'
</script>

<Layout title="New workspace">
  <form
    autocomplete="off"
    method="post">
    <div class="u-m-top-6">
      <label for="workspaceNameInput">Workspace name</label>
      <br>
      <input
        class="input"
        id="workspaceNameInput"
        name="name"
        type="text">
    </div>
    <div class="u-m-top-6">
      <button
        class="button button--primary"
        type="submit">
        Create workspace
      </button>
    </div>
    <div class="u-m-top-6">
      <a href="/account">Back to account</a>
    </div>
  </form>
</Layout>
