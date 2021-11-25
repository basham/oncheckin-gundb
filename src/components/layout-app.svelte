<script>
  import { APP_NAME } from '../constants.js'

  export let title = ''
</script>

<style>
  .layout {
    margin: var(--size-8) auto;
    max-width: 30rem;
  }

  header {
    align-items: center;
    color: var(--color-base-30);
    display: flex;
    font-size: var(--fs-4);
    gap: var(--size-3);
  }

  .logo {
    --size: 3rem;
    height: var(--size);
    width: var(--size);
  }

  main {
    padding-top: var(--size-8);
  }
</style>

<div class="layout">
  <header class="logo">
    <img
      alt=""
      class="logo"
      src="../icon.svg">
    <span>{APP_NAME}</span>
  </header>
  <main>
    <h1>{title}</h1>
    <slot></slot>
  </main>
</div>
