<script>
  export let firstName = ''
  export let lastName = ''
  export let alias = ''
</script>

<div class="u-m-top-6">
  <label for="firstNameInput">First name</label>
  <br>
  <input
    bind:value={firstName}
    id="firstNameInput"
    type="text">
</div>
<div class="u-m-top-6">
  <label for="lastNameInput">Last name</label>
  <br>
  <input
    bind:value={lastName}
    id="lastNameInput"
    type="text">
</div>
<div class="u-m-top-6">
  <label for="aliasInput">Alias</label>
  <br>
  <input
    placeholder={firstName ? `Just ${firstName}` : ''}
    bind:value={alias}
    id="aliasInput"
    type="text">
</div>
