<script>
	import QRious from 'qrious';
	import { onMount } from 'svelte';

	export let canvasId = 'qr-code-canvas';
	export let code;

	onMount(() => {
		new QRious({
			background: '#ffb36a',
			element: document.getElementById(canvasId),
			size: 160,
			value: code,
		});
	});
</script>

<canvas id={canvasId} />
