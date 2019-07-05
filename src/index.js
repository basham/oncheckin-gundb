const { Gun } = window
const { html, render } = lighterhtml
const { ReplaySubject, combineLatest, isObservable } = rxjs
const { map, tap } = rxjs.operators
const { whenAdded } = WhenElements

Gun.chain.$ = function rxjs () {
  const stream = new ReplaySubject(1)
  this.on((value) => stream.next(value))
  return stream
}

const combineProps = (source) => {
  const streams = Object.keys(source)
    .filter((key) => isObservable(source[key]))
    .map((key) =>
      source[key].pipe(
        map((value) => ({ [key]: value }))
      )
    )
  const data = Object.keys(source)
    .filter((key) => !isObservable(source[key]))
    .map((key) => ({ [key]: source[key] }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})
  return combineLatest(streams).pipe(
    map((props) =>
      props
        .reduce((prev, curr) => ({ ...prev, ...curr }), data)
    )
  )
}

function pluralize (value, str) {
  return `${str}${value === 1 ? '' : 's'}`
}

const renderComponent = (element, renderer) => (source$) => source$.pipe(
  tap((props) => render(element, () => renderer(props)))
)

const db = Gun()

whenAdded('#app', (el) => {
  const org$ = db.get('org').$()
  const memberCount$ = org$.pipe(
    map(({ members }) => Object.keys(members).length)
  )
  const sub = combineProps({
    org: org$,
    memberCount: memberCount$,
    foo: 'bar'
  }).pipe(
    renderComponent(el, render)
  ).subscribe()
  return () => sub.unsubscribe()
  function render (props) {
    const { memberCount, org } = props
    console.log('&&', props)
    const { name } = org
    return html`
      <h1>${name}</h1>
      <p>${memberCount} ${pluralize(memberCount, 'member')}</p>
    `
  }
})
