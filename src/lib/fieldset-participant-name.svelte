<script>
  export let firstName = ''
  export let lastName = ''
  export let alias = ''
</script>

<div class="u-m-top-4">
  <label for="firstNameInput">First name</label>
  <br>
  <input
    bind:value={firstName}
    class="input input--small"
    id="firstNameInput"
    type="text">
</div>
<div class="u-m-top-4">
  <label for="lastNameInput">Last name</label>
  <br>
  <input
    bind:value={lastName}
    class="input input--small"
    id="lastNameInput"
    type="text">
</div>
<div class="u-m-top-4">
  <label for="aliasInput">Hash name</label>
  <br>
  <input
    bind:value={alias}
    class="input"
    id="aliasInput"
    placeholder={firstName ? `Just ${firstName}` : ''}
    type="text">
</div>
