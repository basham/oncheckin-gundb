<script>
  export let fullName = ''
  export let alias = ''
</script>

<div class="u-m-top-4">
  <label for="fullNameInput">Full name</label>
  <br>
  <input
    bind:value={fullName}
    class="input"
    id="fullNameInput"
    type="text">
</div>
<div class="u-m-top-4">
  <label for="aliasInput">Hash name</label>
  <br>
  <input
    bind:value={alias}
    class="input"
    id="aliasInput"
    placeholder={fullName ? `Just ${fullName}` : ''}
    type="text">
</div>
