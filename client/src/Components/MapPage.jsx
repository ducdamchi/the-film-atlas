import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react"
import { Map, Source, Layer, Popup } from "react-map-gl/maplibre"
import axios from "axios"
import { csv } from "d3-fetch"
import * as maptilersdk from "@maptiler/sdk"
import "@maptiler/sdk/dist/maptiler-sdk.css"
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"
import "../App.css"

import { AuthContext } from "../Utils/authContext"
import {
  getCountryName,
  fetchListByParams,
  queryTopRatedFilmByCountryTMDB,
} from "../Utils/helperFunctions"
import useCommandK from "../Utils/useCommandK"

import NavBar from "./Shared/NavBar"
import QuickSearchModal from "./Shared/QuickSearchModal"
import FilmUser_Gallery from "./Shared/FilmUser_Gallery"
import FilmTMDB_Gallery from "./Shared/FilmTmdb_Gallery"
import Toggle_Two from "./Shared/Toggle_Two"
import Toggle_Three from "./Shared/Toggle_Three"
import Toggle_Four from "./Shared/Toggle_Four"
import CustomSlider from "./Shared/CustomSlider"
import LoadingPage from "./Shared/LoadingPage"

// import "maplibre-gl/dist/maplibre-gl.css"`
import { FaSortNumericDown, FaSortNumericDownAlt } from "react-icons/fa"

export default function MapPage() {
  /* Map const */
  const mapRef = useRef(null)
  const MAPTILER_API_KEY = "0bsarBRVUOINHDtiYsY0"
  const [firstSymbolId, setFirstSymbolId] = useState(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [popupInfo, setPopupInfo] = useState(null)
  const [filmsPerCountryData, setFilmsPerCountryData] = useState({})

  // const [hoverInfo, setHoverInfo] = useState(null)

  /* API request const */
  const [mapFilmData, setMapFilmData] = useState([])
  const [userFilmList, setUserFilmList] = useState([])
  const [suggestedFilmList, setSuggestedFilmList] = useState([])
  const [sortBy, setSortBy] = useState("added_date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [queryString, setQueryString] = useState("discover")
  const [numStars, setNumStars] = useState(0)
  const [isDiscoverMode, setIsDiscoverMode] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [discoverBy, setDiscoverBy] = useState("vote_average.desc")

  /* Slider - Rating const */
  const [ratingRange, setRatingRange] = useState([0, 7])
  const [tempRatingRange, setTempRatingRange] = useState([0, 7])
  const [displayRating, setDisplayRating] = useState(false)
  const ratingValueRef = useRef(null)

  /* Slider - Vote Count const */
  const [voteCountRange, setVoteCountRange] = useState([0, 100])
  const [tempVoteCountRange, setTempVoteCountRange] = useState([0, 100])
  const [displayVoteCount, setDisplayVoteCount] = useState(false)
  const voteCountValueRef = useRef(null)

  /* Authentication */
  const { authState } = useContext(AuthContext)

  function toggleSearchModal() {
    setSearchModalOpen((status) => !status)
  }
  useCommandK(toggleSearchModal)

  useEffect(() => {
    if (ratingValueRef.current) {
      if (displayRating) {
        ratingValueRef.current.style.opacity = 1
      } else {
        setTimeout(() => {
          ratingValueRef.current.style.opacity = 0
        }, 200)
      }
    }
  }, [displayRating])

  useEffect(() => {
    if (voteCountValueRef.current) {
      if (displayVoteCount) {
        voteCountValueRef.current.style.opacity = 1
      } else {
        setTimeout(() => {
          voteCountValueRef.current.style.opacity = 0
        }, 200)
      }
    }
  }, [displayVoteCount])

  /* Fetch User's film list (liked or watchlisted) from App's DB */
  useEffect(() => {
    if (authState.status) {
      const fetchInitialLikeData = async () => {
        try {
          setIsLoading(true)
          fetchListByParams({
            queryString: "watched",
            setUserFilmList: setMapFilmData,
          })
        } catch (err) {
          console.log(err)
          throw err
        } finally {
          setIsLoading(false)
        }
      }
      fetchInitialLikeData()
    } else {
      // alert("Log in to interact with map!")
    }
  }, [])

  /* Hook to handle querying & sorting User Watched Films */
  useEffect(() => {
    // console.log(popupInfo)
    // if (authState.status) {
    if (popupInfo && popupInfo.iso_a2 !== undefined) {
      const fetchLikedFilmsByCountry = async () => {
        fetchListByParams({
          queryString: "watched/by_country",
          countryCode: popupInfo.iso_a2,
          setUserFilmList: setUserFilmList,
          sortBy: sortBy,
          sortDirection: sortDirection,
          numStars: numStars,
        })
      }
      fetchLikedFilmsByCountry()
    }
    // } else {
    //   alert("Log in to interact with map!")
    // }
  }, [popupInfo, sortBy, sortDirection, numStars])

  /* Hook to switch on/off Discover Mode */
  useEffect(() => {
    if (queryString === "discover") {
      setIsDiscoverMode(true)
    } else {
      setIsDiscoverMode(false)
    }
  }, [queryString])

  /* Hook to handle Discover Mode */
  useEffect(() => {
    if (isDiscoverMode) {
      const getSuggestions = async () => {
        try {
          setIsLoading(true)
          if (
            popupInfo &&
            popupInfo.iso_a2 !== undefined &&
            ratingRange.length == 2
          ) {
            queryTopRatedFilmByCountryTMDB({
              countryCode: popupInfo.iso_a2,
              setSearchResult: setSuggestedFilmList,
              sortBy: discoverBy,
              ratingRange: ratingRange,
              voteCountRange: voteCountRange,
            })
          } else {
            setSuggestedFilmList([])
          }
        } catch (err) {
          console.log(err)
          throw err
        } finally {
          setIsLoading(false)
        }
      }
      getSuggestions()
    }
  }, [isDiscoverMode, popupInfo, discoverBy, ratingRange, voteCountRange])

  useEffect(() => {
    // console.log("DisoverMode:", isDiscoverMode)
    // console.log("Suggested Film List: ", suggestedFilmList)
    // console.log("Vote Avg:", voteAverage)
    // console.log("Vote Count:", voteCount)
    // console.log("Rating range:", ratingRange)
    // console.log("Rating range length:", ratingRange.length)
  }, [suggestedFilmList, isDiscoverMode, ratingRange])

  useEffect(() => {
    // console.log(mapFilmData)
    const data = {}
    mapFilmData.forEach((film) => {
      film.origin_country.forEach((country) => {
        // If country already added as key, increment film counter
        if (country in data) {
          // console.log("Country already added as key: ", country)
          data[country].num_watched_films++
          // If country shows up first time, set film counter = 0
        } else {
          data[country] = {
            name: getCountryName(country),
            num_watched_films: 1,
          }
        }
      })
    })
    // console.log(data)
    setFilmsPerCountryData(data)
  }, [mapFilmData])

  const setFeatureStates = useCallback(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const countries = map.queryRenderedFeatures({
      layers: ["countriesLayer"],
    })
    countries.forEach((country) => {
      if (
        country.properties.iso_a2 &&
        filmsPerCountryData[country.properties.iso_a2]
      ) {
        map.setFeatureState(
          {
            source: "countriesData",
            sourceLayer: "administrative",
            id: country.id,
          },
          {
            num_watched_films:
              filmsPerCountryData[country.properties.iso_a2].num_watched_films,
          }
        )

        // if (country.properties.iso_a2 === "")
      }
      //921 & 907: iso_i3 for West Bank and Gaza
      if (country.id === 921 || country.id === 907) {
        // console.log("Detected films from PS.")
        map.setFeatureState(
          {
            source: "countriesData",
            sourceLayer: "administrative",
            id: country.id,
          },
          {
            custom_name: "Palestine",
          }
        )
        if (filmsPerCountryData["PS"]) {
          // console.log("Detected films from PS.")
          map.setFeatureState(
            {
              source: "countriesData",
              sourceLayer: "administrative",
              id: country.id,
            },
            {
              custom_name: "Palestine",
              num_watched_films: filmsPerCountryData["PS"].num_watched_films,
            }
          )
        }
      }
    })
  }, [filmsPerCountryData])

  const onData = useCallback(
    (event) => {
      if (event.sourceId === "countriesData" && event.isSourceLoaded) {
        // console.log("statesData source loaded, setting feature states...")
        setFeatureStates()
      }
    },
    [setFeatureStates]
  )

  const onMapLoad = useCallback(
    (event) => {
      mapRef.current = event.target // Store the map instance in the ref
      const map = mapRef.current // use the ref to access the map

      map.on("data", onData)

      if (mapRef.current.isSourceLoaded("countriesData")) {
        setFeatureStates()
      }

      const layers = map.getStyle().layers
      const firstSymbolLayerId = layers.find(
        (layer) => layer.type === "symbol"
      ).id

      if (firstSymbolLayerId) {
        setFirstSymbolId(firstSymbolLayerId)
      }

      setIsMapLoaded(true)
    },
    [onData, setFeatureStates]
  )

  const onMapClick = useCallback((event) => {
    let clickedFeature
    let numWatchedFilms
    let countryName
    let customName
    let isoA2

    // console.log("clicked")
    // console.log("event: ", event)
    if (!mapRef.current) return

    const features = mapRef.current.queryRenderedFeatures(event.point, {
      layers: ["countriesLayer"],
    })

    // console.log(features)

    if (features.length > 0) {
      clickedFeature = features[0]
      numWatchedFilms = clickedFeature.state?.num_watched_films
      customName = clickedFeature.state?.custom_name
      countryName = clickedFeature.properties?.name
      if (customName === "Palestine") {
        isoA2 = "PS"
      } else {
        isoA2 = clickedFeature.properties?.iso_a2
      }
    }

    setPopupInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      num_watched_films: numWatchedFilms >= 1 ? numWatchedFilms : 0,
      country_name: countryName,
      custom_name: customName,
      iso_a2: isoA2,
    })
  }, [])

  /* Clean up event listeners when map unmounts */
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.off("data", onData)
      }
    }
  }, [onData])

  return (
    <div>
      {isLoading && <LoadingPage />}
      {/* Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
          // queryString={queryString}
        />
      )}
      <NavBar />
      <div className="w-screen h-[40rem] flex flex-col items-center relative">
        <Map
          className=""
          ref={mapRef}
          onLoad={onMapLoad}
          onClick={onMapClick}
          // onMouseEnter={onMapClick}
          mapboxAccessToken={MAPTILER_API_KEY}
          initialViewState={{ latitude: 25, longitude: 150, zoom: 1.2 }}
          mapStyle={
            "https://api.maptiler.com/maps/0199f849-b24f-7c0c-a482-2c1149331519/style.json?key=0bsarBRVUOINHDtiYsY0"
          }>
          <Source
            id="countriesData"
            type="vector"
            url="https://api.maptiler.com/tiles/countries/tiles.json?key=0bsarBRVUOINHDtiYsY0">
            <Layer
              id="countriesLayer"
              source="countriesData"
              source-layer="administrative"
              type="fill"
              paint={{
                "fill-color": [
                  "case",
                  [
                    "!=",
                    ["to-number", ["feature-state", "num_watched_films"]],
                    0,
                  ],
                  [
                    "interpolate",
                    ["linear"],
                    ["feature-state", "num_watched_films"],
                    1,
                    "rgba(247, 227, 222, 1)",
                    10,
                    "rgba(140, 23, 10, 1)",
                  ],
                  "rgba(126, 126, 126, 0)",
                ],
                "fill-opacity": 1,
                "fill-outline-color": "rgba(140, 206, 34, 0.7)",
              }}
              filter={["==", "level", 0]}
              beforeId={firstSymbolId}></Layer>
            <Layer
              id="countriesLayer"
              source="countriesData"
              source-layer="administrative"
              type="symbol"
              layout={{
                "text-field": [
                  "case",
                  ["!=", ["feature-state", "custom_name"], ""],
                  ["feature-state", "custom_name"], // Use custom name if available
                  ["get", "NAME"], // Fallback to original name
                ],
                "text-size": 12,
                "text-font": ["Open Sans Bold"],
                "text-allow-overlap": false,
                "text-optional": true,
              }}
              paint={{
                "text-color": "#000000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1,
              }}
              filter={["==", "level", 0]}
              beforeId={firstSymbolId}></Layer>
          </Source>

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              anchor="bottom"
              closeOnClick={false}
              onClose={() => setPopupInfo(null)}>
              <div className="flex flex-col items-center justify-center hover:text-blue-600 cursor-pointer">
                {popupInfo.custom_name !== undefined && (
                  <span className="font-bold">{popupInfo.custom_name}</span>
                )}
                {popupInfo.custom_name === undefined && (
                  <span className="font-bold">{popupInfo.country_name}</span>
                )}

                <span>
                  <span className="font-bold">
                    {`${popupInfo.num_watched_films}`}&nbsp;
                  </span>
                  <span>{`watched films`}</span>
                </span>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      <div className="flex flex-col items-center">
        {popupInfo &&
          popupInfo.iso_a2 !== null &&
          popupInfo.iso_a2 !== undefined && (
            <div className="uppercase font-bold text-3xl flex items-center justify-center w-full mt-10">{`${getCountryName(popupInfo.iso_a2)}`}</div>
          )}

        <div className="flex flex-col items-center justify-center mt-10 w-[30rem] border-1">
          <Toggle_Three
            label="View Mode"
            width={`20rem`}
            height={`2.5rem`}
            state={queryString}
            setState={setQueryString}
            stateDetails={{
              1: { value: "discover", label: "Discover" },
              2: { value: "watched/by_country", label: "Watched" },
              3: { value: "watched/rated/by_country", label: "Rated" },
            }}
          />

          {!isDiscoverMode && (
            <div className="w-full">
              <Toggle_Two
                label="Sort By"
                width={`20rem`}
                height={`2.5rem`}
                state={sortBy}
                setState={setSortBy}
                stateDetails={{
                  1: { value: "added_date", label: "Recently Added" },
                  2: { value: "released_date", label: "Released Year" },
                }}
              />
              <Toggle_Two
                label="Sort Order"
                width={`10rem`}
                height={`2.5rem`}
                state={sortDirection}
                setState={setSortDirection}
                stateDetails={{
                  1: {
                    value: "desc",
                    label: <FaSortNumericDownAlt className="text-xl mt-0" />,
                  },
                  2: {
                    value: "asc",
                    label: <FaSortNumericDown className="text-xl mt-0" />,
                  },
                }}
              />
            </div>
          )}
          {!isDiscoverMode && queryString === "watched/rated/by_country" && (
            <Toggle_Four
              label="Rating"
              width={`20rem`}
              height={`2.5rem`}
              state={numStars}
              setState={setNumStars}
              stateDetails={{
                1: {
                  value: 0,
                  label: <span className="">All</span>,
                },
                2: {
                  value: 3,
                  label: (
                    <span className="text-2xl text-pink-600">
                      &#10048;&#10048;&#10048;
                    </span>
                  ),
                },
                3: {
                  value: 2,
                  label: (
                    <span className="text-2xl text-pink-600">
                      &#10048;&#10048;
                    </span>
                  ),
                },
                4: {
                  value: 1,
                  label: (
                    <span className="text-2xl text-pink-600">&#10048;</span>
                  ),
                },
              }}
            />
          )}
          {isDiscoverMode && (
            <div className="w-full flex flex-col items-center gap-0">
              <Toggle_Two
                label="Sort By"
                width="20rem"
                height="2.5rem"
                state={discoverBy}
                setState={setDiscoverBy}
                stateDetails={{
                  1: { value: "vote_average.desc", label: "Average Rating" },
                  2: { value: "vote_count.desc", label: "Vote Count" },
                }}
              />

              <div className="flex items-center p-2 gap-5 w-full border-1">
                <div className="border-1 w-[7rem] flex justify-end uppercase text-sm">
                  Filter
                </div>
                <div className="flex flex-col items-center justify-center gap-6 p-6 rounded-3xl bg-gray-200 w-[20rem]">
                  <div
                    className="w-full flex flex-col items-center justify-center gap-2"
                    // ref={ratingValueRef}
                    onMouseEnter={() => setDisplayRating(true)}
                    onMouseLeave={() => setDisplayRating(false)}>
                    <div className="text-xs uppercase font-semibold">
                      Average Rating &#x2265; {`${tempRatingRange[1]}`}
                    </div>
                    <CustomSlider
                      width="15rem"
                      id="slider-simple"
                      min={0}
                      max={10}
                      step={0.1}
                      tempRange={tempRatingRange}
                      setTempRange={setTempRatingRange}
                      range={ratingRange}
                      setRange={setRatingRange}
                      // isInfoRefDisplayed={displayRating}
                      // infoRef={ratingValueRef}
                      // infoRefText={`mininum ${tempRatingRange[1]}`}
                      thumbsDisabled={[true, false]}
                      rangeSlideDisabled={true}
                    />
                  </div>
                  <div
                    className="w-full flex flex-col items-center justify-center gap-2"
                    onMouseEnter={() => setDisplayVoteCount(true)}
                    onMouseLeave={() => setDisplayVoteCount(false)}>
                    <div className="text-xs uppercase font-bold">
                      Vote Count &#x2265; {`${tempVoteCountRange[1]}`}
                    </div>
                    <CustomSlider
                      width="15rem"
                      id="slider-simple"
                      min={0}
                      max={500}
                      step={20}
                      tempRange={tempVoteCountRange}
                      setTempRange={setTempVoteCountRange}
                      range={voteCountRange}
                      setRange={setVoteCountRange}
                      // isInfoRefDisplayed={displayVoteCount}
                      // infoRef={voteCountValueRef}
                      infoRefText={`mininum ${tempVoteCountRange[1]}`}
                      thumbsDisabled={[true, false]}
                      rangeSlideDisabled={true}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs italic mt-5">
                Results are automatically displayed in descending order.
              </div>
            </div>
          )}
        </div>

        {authState.status && !isDiscoverMode && (
          <FilmUser_Gallery
            listOfFilmObjects={userFilmList}
            queryString={`watched`}
            sortDirection={sortDirection}
            sortBy={sortBy}
          />
        )}
        {isDiscoverMode && suggestedFilmList && (
          <FilmTMDB_Gallery listOfFilmObjects={suggestedFilmList} />
        )}
      </div>
    </div>
  )
}
