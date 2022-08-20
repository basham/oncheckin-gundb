<script>
  import { importStore } from '@src/stores.js'
  import Layout from '@src/layouts/public.svelte'

  let files

  function submit (event) {
    event.preventDefault()

    if (!files || !files.length) {
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = JSON.parse(e.target.result)
      await importStore.import(content)
      // window.location = '?p=events'
    }
    reader.readAsText(files[0])
  }
</script>

<Layout title="Import workspace">
  <form
    class="u-m-top-6"
    on:submit={submit}>
    <div>
      <label for="fileField">File</label>
      <br>
      <input
        accept=".json"
        bind:files
        class="input"
        id="fileField"
        type="file">
    </div>
    <div class="u-m-top-6">
      <button
        class="button button--primary"
        type="submit">
        Import
      </button>
    </div>
    <div class="u-m-top-6">
      <a href="?p=workspaces">Back to workspaces</a>
    </div>
  </form>
</Layout>
