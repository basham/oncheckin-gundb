<script>
	export let name = '';
	export let date = '';
	export let count = '';
</script>

<div class="u-m-top-4">
	<label for="nameInput">Name</label>
	<br />
	<input class="input" id="nameInput" name="name" type="text" value={name} />
</div>
<div class="u-m-top-4">
	<label for="dateInput">Date</label>
	<br />
	<input
		class="input u-mw-5"
		id="dateInput"
		name="date"
		type="date"
		value={date}
	/>
</div>
<div class="u-m-top-4">
	<label for="countInput">Count</label>
	<br />
	<input
		class="input u-mw-5"
		id="countInput"
		min="1"
		name="count"
		type="number"
		value={count}
	/>
</div>
