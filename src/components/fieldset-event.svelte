<script>
  export let name = ''
  export let date = ''
</script>

<div class="u-m-top-6">
  <label for="nameInput">Name</label>
  <br>
  <input
    bind:value={name}
    id="nameInput"
    type="text">
</div>
<div class="u-m-top-6">
  <label for="dateInput">Date</label>
  <br>
  <input
    bind:value={date}
    id="dateInput"
    type="date">
</div>
