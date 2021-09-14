<script>
  import { append, get, getAll } from '../store.js'
  import Breadcrumbs from './breadcrumbs.svelte'
  import BreadcrumbsItem from './breadcrumbs-item.svelte'
  import Page from './page.svelte'

  const params = (new URL(document.location)).searchParams
  const eventId = params.get('id')

  const title = 'Edit attendance'
  const maxResults = 10
  let loading = true
  let eventName = ''
  let orgName = ''
  let participants = []
  let query = ''
  let options = []
  let selectedIndex = 0
  $: optionsCount = options.length

  load()

  async function load () {
    const org = await get('org')
    orgName = org.data?.name

    const event = await get(['events', eventId])
    if (event.data) {
      eventName = event.data.name
    } else {
      title = 'Event not found'
    }

    participants = (await getAll('participants'))
      .map((p) => {
        const fullName = `${p.data.firstName} ${p.data.lastName}`
        const data = { ...p.data, fullName }
        return { ...p, data }
      })

    loading = false
  }

  function handleInput (event) {
    const { value } = event.target
    options = participants
      .filter(({ data }) =>
        data.fullName.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
      )
      .slice(0, maxResults)
    query = value
    selectedIndex = 0
  }

  function handleKeyDown (event) {
    const { key } = event
    const i = selectedIndex
    const lastIndex = optionsCount - 1
    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = i === lastIndex ? 0 : i + 1
        return
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex = i === 0 ? lastIndex : i - 1
        return
      case 'Escape':
        query = ''
        return
    }
  }

  async function handleOptionClick () {
    await addParticipant()
  }

  function handleOptionMouseOver (event) {
    selectedIndex = parseInt(event.target.dataset.index)
  }

  async function handleSubmit (event) {
    event.preventDefault()
    if (options.length > 0) {
      await addParticipant()
    }
  }

  async function addParticipant () {
    const participantId = options[selectedIndex].key
    const { ref: eventRef } = await get(['events', eventId])
    const { ref: participantRef } = await get(['participants', participantId])
    const attendance = {
      event: eventRef,
      participant: participantRef,
      host: false
    }
    const attendanceRef = await append('attendances', attendance)
    await append(['events', eventId, 'attendances'], attendanceRef)
    await append(['participants', participantId, 'attendances'], attendanceRef)
    window.location = `./?p=event&id=${eventId}`
  }
</script>

<style>
  .listbox {
    background-color: var(--color-white);
    border: var(--border);
    border-radius: var(--size-1);
    line-height: var(--lh-1);
    list-style-type: none;
    margin: var(--size-1) 0 0;
    min-width: 10rem;
    padding: var(--size-1);
    position: absolute;
    width: max-content;
  }

  .option {
    cursor: pointer;
    padding: var(--size-1) var(--size-2);
  }

  .option[aria-selected=true] {
    background-color: var(--color-black-9);
    border-radius: var(--size-1);
    color: var(--color-white);
  }

  .noResults {
    padding: var(--size-1) var(--size-2);
  }
</style>

<Page
  loading={loading}
  title={title}>
  <Breadcrumbs>
    <BreadcrumbsItem>{orgName}</BreadcrumbsItem>
    <BreadcrumbsItem href="?p=events">Events</BreadcrumbsItem>
    <BreadcrumbsItem href={`?p=event&id=${eventId}`}>{eventName}</BreadcrumbsItem>
    <BreadcrumbsItem isCurrent={true}>{title}</BreadcrumbsItem>
  </Breadcrumbs>
  <h1>{title}</h1>
  <form
    autocomplete="off"
    class="u-m-top-4"
    on:submit={handleSubmit}>
    <label
      for="participantInput"
      id="participantLabel">
      Add participant
    </label>
    <div
      aria-expanded={false}
      aria-haspopup="listbox"
      aria-owns="participantListbox"
      role="combobox">
      <input
        aria-activedescendant={`option-${selectedIndex}`}
        aria-autocomplete="list"
        aria-controls="participantListbox"
        id="participantInput"
        on:input={handleInput}
        on:keydown={handleKeyDown}
        type="text"
        value={query}>
    </div>
    {#if optionsCount && query.length}
      <ul
        aria-labelledby="participantLabel"
        class="listbox"
        id="participantListbox"
        role="listbox">
        {#each options as option, i}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <li
            aria-selected={i === selectedIndex}
            class="option"
            data-index={i}
            id={`option-${i}`}
            on:click={handleOptionClick}
            on:mouseover={handleOptionMouseOver}
            role="option">
            {option.data.fullName}
          </li>
        {/each}
      </ul>
    {:else if !optionsCount && query.length}
      <div class="listbox">
        <div class="noResults" role="alert">No results</div>
      </div>
    {/if}
  </form>
</Page>
