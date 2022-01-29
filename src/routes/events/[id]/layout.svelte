<script>
  import Layout from '../../layout.svelte'

  export let params
</script>

<Layout>
  <h2>This event {params?.id}</h2>
  <slot></slot>
</Layout>
