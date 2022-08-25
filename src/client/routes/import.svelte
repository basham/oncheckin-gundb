<script>
  import { importStore } from '@src/client/stores.js'
  import Layout from '@src/client/layouts/public.svelte'

  let files
  let isSubmitting = false

  function submit (event) {
    event.preventDefault()

    if (isSubmitting || !files || !files.length) {
      return
    }

    isSubmitting = true
    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = JSON.parse(e.target.result)
      const { id } = await importStore.import(content)
      window.location = `?p=${id}/events`
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
      <a href="/account">Back to account</a>
    </div>
  </form>
</Layout>
