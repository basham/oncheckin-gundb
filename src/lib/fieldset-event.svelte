<script>
  export let name = ''
  export let date = ''
</script>

<div>
  <label for="nameInput">Name</label>
  <br>
  <input
    bind:value={name}
    class="input"
    id="nameInput"
    type="text">
</div>
<div class="u-m-top-6">
  <label for="dateInput">Date</label>
  <br>
  <input
    bind:value={date}
    class="input input--small"
    id="dateInput"
    type="date">
</div>
