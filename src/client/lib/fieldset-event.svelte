<script>
  export let name = ''
  export let date = ''
  export let count = ''
</script>

<div class="u-m-top-4">
  <label for="nameInput">Name</label>
  <br>
  <input
    bind:value={name}
    class="input"
    id="nameInput"
    type="text">
</div>
<div class="u-m-top-4">
  <label for="dateInput">Date</label>
  <br>
  <input
    bind:value={date}
    class="input u-mw-5"
    id="dateInput"
    type="date">
</div>
<div class="u-m-top-4">
  <label for="countInput">Count</label>
  <br>
  <input
    bind:value={count}
    class="input u-mw-5"
    id="countInput"
    min="1"
    type="number">
</div>
