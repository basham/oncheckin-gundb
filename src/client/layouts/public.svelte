<script>
  import { APP_NAME, STATE } from '@src/constants.js'
  import Layout from './page.svelte'

  export let title = ''
  export let state = STATE.LOADED
</script>

<style>
  .layout {
    margin: 0 auto;
    max-width: 30rem;
    padding: var(--size-8);
  }

  header {
    align-items: center;
    color: var(--color-base-30);
    display: flex;
    font-size: var(--fs-4);
    gap: var(--size-3);
  }

  header > img {
    --size: 3rem;
    height: var(--size);
    width: var(--size);
  }

  header > a {
    text-decoration: none;
  }

  header > a:hover {
    text-decoration: underline;
  }

  main {
    padding-top: var(--size-8);
  }
</style>

<Layout
  state={state}
  title={title}>
  <div class="layout">
    <header>
      <img alt="" src="/icon.svg">
      <a href="/">{APP_NAME}</a>
    </header>
    <main>
      {#if title}
        <h1>{title}</h1>
      {/if}
      <slot></slot>
    </main>
  </div>
</Layout>
