export function getGradeColor(
  grade: string,
  variant: 'default' | 'light' = 'default',
): string {
  // keep in sync with tailwind-colors.css
  switch (grade) {
    case '6e':
      switch (variant) {
        case 'default':
          return '#28a745'
        case 'light':
          return '#effaf3'
      }
      break
    case '5e':
      switch (variant) {
        case 'default':
          return '#4e8ef6'
        case 'light':
          return '#f1f6ff'
      }
      break
    case '4e':
      switch (variant) {
        case 'default':
          return '#9f64ff'
        case 'light':
          return '#f7f1ff'
      }
      break
    case '3e':
      switch (variant) {
        case 'default':
          return '#da5e75'
        case 'light':
          return '#fbf3f4'
      }
      break
    case 'tout':
      switch (variant) {
        case 'default':
          return '#feb60a'
        case 'light':
          return '#fffbeb'
      }
      break
    default:
      return '#000000'
  }
}
