function disableBehavior(event: Event): Event {
  event.preventDefault()
  event.stopPropagation()
  return event
}

export { disableBehavior }
