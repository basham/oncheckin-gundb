<script>
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
      const res = await fetch('/doc/import', {
        body: e.target.result,
        method: 'post'
      })
      window.location = res.url
    }
    reader.readAsText(files[0])
  }
</script>

<Layout title="Import workspace">
  <form
    class="u-m-top-6"
    on:submit={submit}>
    <div>
      <label for="file">File</label>
      <br>
      <input
        accept=".json"
        bind:files
        class="input"
        id="file"
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
