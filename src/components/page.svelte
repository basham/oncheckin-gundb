<script>
  import { APP_NAME } from '../constants.js'
  import Upgrader from './upgrader.svelte'
  import AppLayout from './layout-app.svelte'
  import WorkspaceLayout from './layout-workspace.svelte'

  export let loading = false
  export let location = ''
  export let notFound = false
  export let theme = 'workspace'
  export let title = ''

  $: title = notFound ? ['Page not found'] : (Array.isArray(title) ? title : [title])
  $: fullTitle = [...title, APP_NAME].filter((v) => v).join(' - ')
</script>

<svelte:head>
  <title>{fullTitle}</title>
</svelte:head>

<Upgrader />

{#if theme === 'app'}
  <AppLayout title={title}>
    <slot></slot>
  </AppLayout>
{:else if theme === 'workspace'}
  <WorkspaceLayout
    loading={loading}
    location={location}
    notFound={notFound}
    title={title}>
    <slot></slot>
  </WorkspaceLayout>
{:else if theme === 'plain'}
  <slot></slot>
{/if}
