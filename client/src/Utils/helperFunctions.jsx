/* Converts ISO_A2 country codes into full country name */
export function getCountryName(code) {
  // Check if the Intl.DisplayNames API is supported
  if (Intl && Intl.DisplayNames) {
    // Create a new instance for 'en' (English) with 'region' type
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
    // Use the `of()` method to get the country name
    return regionNames.of(code.toUpperCase())
  }
  return undefined
}

/* Converts full date of format yyyy-mm-dd to yyyy only */
export function getReleaseYear(release_date) {
  const date = new Date(release_date)
  const year = date.getFullYear()

  if (isNaN(year) || year < 1800 || year > 3000) {
    return "N/A"
  } else {
    return year
  }
}

/* Converts date of format yyyy-mm (e.g. 2025-10) to Month Year string (e.g. October 2025)*/
export function getNiceMonthYear(dateString) {
  const [year, month] = dateString.split("-")
  const inputDate = new Date(year, month - 1)
  const currentDate = new Date()

  if (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth()
  ) {
    return "This Month"
  } else if (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth() - 1
  ) {
    return "Last Month"
  } else {
    return inputDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }
}

/* Converts date of format yyyy-mm-dd (e.g. 2025-10-25) to Month Date Year string (e.g. October 25, 2025)*/
export function getNiceMonthDateYear(dateString) {
  const [year, month, date] = dateString.split("-")
  const inputDate = new Date(year, month - 1, date)
  // const [year, month, date] = dateString.split("-")
  // const currentDate = new Date()
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Intl.DateTimeFormat("en-US", options).format(inputDate)
}

/* Calculate age from birthday and deathday in the string format yyyy-mm-dd. If deathday left empty, person is not deceased -> use current year. */
export function getAge(birthday, deathday) {
  if (birthday) {
    const birth = new Date(birthday)
    if (deathday) {
      const death = new Date(deathday)
      return death.getFullYear() - birth.getFullYear()
    } else {
      const currentDate = new Date()
      return currentDate.getFullYear() - birth.getFullYear()
    }
  } else {
    return "N/A"
  }
}

export function getNameParts(fullName) {
  if (!fullName || typeof fullName !== "string") return ""

  const nameParts = fullName.trim().split(/\s+/) // Handles multiple spaces

  const lastName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : ""

  const firstNameInitial =
    nameParts.length > 0 && nameParts[0].length > 0
      ? nameParts[0][0].toUpperCase()
      : ""

  return { firstNameInitial, lastName }
}

export function shuffleArray(array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

// Convert RGB to relative luminance
export const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio
export const getContrastRatio = (l1, l2) => {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Adjust color to ensure sufficient contrast
export const ensureContrast = (bgColor, textColor) => {
  const bgLuminance = getLuminance(...bgColor)
  let textLuminance = getLuminance(...textColor)
  let contrastRatio = getContrastRatio(bgLuminance, textLuminance)

  // WCAG AA requires at least 4.5:1 for normal text
  const minContrast = 4.5

  if (contrastRatio < minContrast) {
    // If contrast is insufficient, adjust the text color
    // by making it significantly lighter or darker
    const isBgDark = bgLuminance < 0.5

    if (isBgDark) {
      // For dark backgrounds, use light text (high luminance)
      return [231, 229, 228] // white
    } else {
      // For light backgrounds, use dark text (low luminance)
      return [28, 25, 23] // black
    }
  }

  return textColor
}
