<script>
  import cuid from 'cuid'
  import QRious from 'qrious'
  import { onMount } from 'svelte'

  export let code

  const id = cuid()

  onMount(() => {
    new QRious({
      background: '#ffb36a',
      element: document.getElementById(id),
      size: 160,
      value: code
    })
  })
</script>

<canvas id={id}></canvas>
