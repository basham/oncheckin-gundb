<script>
  import { h1 } from '@src/data.js'
  import { APP_NAME } from '@src/constants.js'
  import Layout from './page.svelte'
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

<Layout>
  <div class="layout">
    <header>
      <img alt="" src="/icon.svg">
      <a href="/">{APP_NAME}</a>
    </header>
    <main>
      {#if h1}
        <h1>{h1}</h1>
      {/if}
      <slot></slot>
    </main>
  </div>
</Layout>
