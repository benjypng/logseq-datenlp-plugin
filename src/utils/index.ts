export const handlePopupAndInputFocus = () => {
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      //ESC
      if (e.key === 'Escape') {
        logseq.hideMainUI({ restoreEditingCursor: true })
      }
      const inputField = document.querySelector(
        '#gotodate-field',
      ) as HTMLInputElement
      inputField.focus()
      e.stopPropagation()
    },
    false,
  )
  // Click
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('#gotodate-field')) {
      logseq.hideMainUI({ restoreEditingCursor: true })
    }
    e.stopPropagation()
  })
}

export const getPreferredDateFormat = async (): Promise<string> => {
  return (await logseq.App.getUserConfigs()).preferredDateFormat
}
