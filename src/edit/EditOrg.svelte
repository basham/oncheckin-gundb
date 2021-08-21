<script>
  import { gun } from '../gun.js'
  import App from '../components/App.svelte'
  import Breadcrumbs from '../components/Breadcrumbs.svelte'
  import BreadcrumbsItem from '../components/BreadcrumbsItem.svelte'

  const title = 'Edit organization'
  const root = '../'
  let loading = true
  let orgName = ''
  let name = ''

  gun.get('org').once((data) => {
    if (data) {
      orgName = data.name
      name = data.name
    }
    loading = false
  })

  function submit (event) {
    event.preventDefault()
    gun.get('org').put({ name })
    window.location = root
  }
</script>

<App
  loading={loading}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem href={root}>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    on:submit={submit}>
    <div class="u-m-top-4">
      <label for="name">Name</label>
      <input
        bind:value={name}
        id="name"
        type="text">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
  </form>
</App>
