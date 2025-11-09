import axios from "axios"
import { FaListCheck } from "react-icons/fa6"

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
  const birth = new Date(birthday)
  if (deathday) {
    const death = new Date(deathday)
    return death.getFullYear() - birth.getFullYear()
  } else {
    const currentDate = new Date()
    return currentDate.getFullYear() - birth.getFullYear()
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

/* Query for films from TMDB (search with provided input)
@params:
- searchInput: A useState object containing the search input
- setSearchResult: A useState function that updates the search result  */
export function queryFilmFromTMDB(searchInput) {
  const searchUrl = "https://api.themoviedb.org/3/search/movie"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(searchUrl, {
      params: {
        query: searchInput,
        api_key: apiKey,
        include_adult: false,
        append_to_response: "credits",
      },
    })
    .then((response) => {
      return response.data.results
    })
    .catch((err) => {
      console.log("Error: ", err)
      throw err
    })
}

/* Fetch info of one film (with known id) from TMDB
@params:
- tmdbId: unique TMDB id assigned to film
- set...: useState() methods that updates the corresponding values in the calling component
*/
export function fetchFilmFromTMDB(tmdbId) {
  const movieDetailsUrl = "https://api.themoviedb.org/3/movie/"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(
      `${movieDetailsUrl}${tmdbId}?append_to_response=credits,videos,watch/providers&api_key=${apiKey}`
    )
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.log("Client: Error fetching film from TMDB", err)
      throw err
    })
}

export function queryDirectorFromTMDB(searchInput) {
  const searchPersonUrl = "https://api.themoviedb.org/3/search/person"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(searchPersonUrl, {
      params: {
        query: searchInput,
        api_key: apiKey,
        include_adult: false,
      },
    })
    .then((response) => {
      return response.data.results
    })
    .catch((err) => {
      console.log("Client: Error querying director from TMDB", err)
      throw err
    })
}

export function fetchDirectorFromTMDB(tmdbId) {
  const personDetailsUrl = "https://api.themoviedb.org/3/person/"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(
      `${personDetailsUrl}${tmdbId}?append_to_response=movie_credits&api_key=${apiKey}`
    )
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.log("Client: Error fetching film from TMDB", err)
      throw err
    })
}

export function queryTopRatedFilmByCountryTMDB({
  page = 1,
  countryCode = null,
  sortBy = null,
  ratingRange = null,
  voteCountRange = null,
} = {}) {
  const searchUrl = "https://api.themoviedb.org/3/discover/movie"
  const apiKey = "14b22a55c02218f84058041c5f553d3d"

  return axios
    .get(searchUrl, {
      params: {
        api_key: apiKey,
        with_origin_country: countryCode,
        region: countryCode,
        include_adult: false,
        include_video: false,
        "with_runtime.gte": 80, //pick films > 80 minutes
        "vote_count.gte": voteCountRange[1],
        "vote_average.gte": ratingRange[1],
        sort_by: sortBy,
        page: page,
      },
    })
    .then((response) => {
      return response.data.results
    })
    .catch((err) => {
      console.log("Error: ", err)
      throw err
    })
}

export function fetchListByParams({
  queryString = null,
  sortBy = null,
  sortDirection = null,
  numStars = null,
  countryCode = null,
} = {}) {
  return axios
    .get(`http://localhost:3002/profile/me/${queryString}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
      params: {
        sortBy: sortBy,
        sortDirection: sortDirection,
        numStars: numStars,
        countryCode: countryCode,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.log("Error: ", err)
      throw err
    })
}

export function fetchDirectorListByParams({
  queryString = null,
  sortBy = null,
  sortDirection = null,
  numStars = null,
} = {}) {
  return axios
    .get(`http://localhost:3002/profile/me/${queryString}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
      params: {
        sortBy: sortBy,
        sortDirection: sortDirection,
        numStars: numStars,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.log("Error: ", err)
      throw err
    })
    .finally(() => {})
}

/* Check the Like status of a film for logged in users from App's DB
@params:
- tmdbId: unique TMDB id assigned to film
- setLike: useState() method that updates the like status in the calling component
*/
export function checkLikeStatus(tmdbId) {
  return axios
    .get(`http://localhost:3002/profile/me/watched/${tmdbId}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error checking like status", err)
      throw err
    })
}

/* Check the Saved status of a film for logged in users from App's DB
@params:
- tmdbId: unique TMDB id assigned to film
- setLike: useState() method that updates the like status in the calling component
*/
export function checkSaveStatus(tmdbId) {
  return axios
    .get(`http://localhost:3002/profile/me/watchlisted/${tmdbId}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error checking save status", err)
      throw err
    })
}

/* Make API call to App's DB when user 'like' a film */
export function likeFilm(req) {
  return axios
    .post(`http://localhost:3002/profile/me/watched`, req, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error liking film", err)
      throw err
    })
}

/* Make API call to App's DB when user 'unlike' a film */
export function unlikeFilm(tmdbId) {
  return axios
    .delete(`http://localhost:3002/profile/me/watched`, {
      data: {
        tmdbId: tmdbId,
      },
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error unliking film", err)
      throw err
    })
}

/* Make API call to App's DB when user 'like' a film */
export function saveFilm(req) {
  return axios
    .post(`http://localhost:3002/profile/me/watchlisted`, req, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error saving film", err)
      throw err
    })
}
/* Make API call to App's DB when user 'unlike' a film */
export function unsaveFilm(tmdbId) {
  return axios
    .delete(`http://localhost:3002/profile/me/watchlisted`, {
      data: {
        tmdbId: tmdbId,
      },
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error unliking film", err)
      throw err
    })
}

/* Make API call to App's DB to rate a film that has already been liked */
export function rateFilm(req) {
  return axios
    .put(`http://localhost:3002/profile/me/watched`, req, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error("Client: Error rating film", err)
      throw err
    })
}
