<script>
  export let firstName = ''
  export let lastName = ''
  export let alias = ''
</script>

<div>
  <label for="firstNameInput">First name</label>
  <br>
  <input
    bind:value={firstName}
    class="input"
    id="firstNameInput"
    type="text">
</div>
<div class="u-m-top-6">
  <label for="lastNameInput">Last name</label>
  <br>
  <input
    bind:value={lastName}
    class="input"
    id="lastNameInput"
    type="text">
</div>
<div class="u-m-top-6">
  <label for="aliasInput">Alias</label>
  <br>
  <input
    bind:value={alias}
    class="input"
    id="aliasInput"
    placeholder={firstName ? `Just ${firstName}` : ''}
    type="text">
</div>
