<script>
  import { gun } from '../../gun.js'
  import App from '../../components/App.svelte'
  import Breadcrumbs from '../../components/Breadcrumbs.svelte'
  import BreadcrumbsItem from '../../components/BreadcrumbsItem.svelte'

  const title = 'New event'
  const root = '../../'
  let loading = true
  let orgName = ''
  let name = ''
  let date = (new Date()).toJSON().split('T')[0]

  gun.get('org').once((data) => {
    if (data) {
      orgName = data.name
    }
    loading = false
  })

  function submit (event) {
    event.preventDefault()
    gun.get('events').set({
      name,
      date
    })
    window.location = root
  }
</script>

<App
  loading={loading}
  root={root}
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
      <label for="date">Date</label>
      <input
        bind:value={date}
        id="date"
        type="date">
    </div>
    <div class="u-m-top-4">
      <button type="submit">Save</button>
    </div>
  </form>
</App>
