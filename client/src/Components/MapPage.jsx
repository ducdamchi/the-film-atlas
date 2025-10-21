import React, { useRef, useState, useEffect, useCallback } from "react"
import { Map, Source, Layer, Popup } from "react-map-gl/maplibre"
import axios from "axios"
import { csv } from "d3-fetch"
import * as maptilersdk from "@maptiler/sdk"
import "@maptiler/sdk/dist/maptiler-sdk.css"

import { getCountryName } from "../Utils/helperFunctions"
import NavBar from "./Shared/NavBar"

// import "maplibre-gl/dist/maplibre-gl.css"`

export default function MapPage() {
  const MAPTILER_API_KEY = "0bsarBRVUOINHDtiYsY0"
  const [userFilmList, setUserFilmList] = useState([])
  const [firstSymbolId, setFirstSymbolId] = useState(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [popupInfo, setPopupInfo] = useState(null)

  const [filmsPerCountryData, setFilmsPerCountryData] = useState({})

  const mapRef = useRef(null)

  /* Fetch User's film list (liked or watchlisted) from App's DB */
  useEffect(() => {
    axios
      .get(`http://localhost:3002/profile/me/liked-films`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
        params: {},
      })
      .then((response) => {
        setUserFilmList(response.data)
      })
      .catch((err) => {
        console.log("Error: ", err)
      })
  }, [])

  useEffect(() => {
    // console.log(userFilmList)
    const data = {}
    userFilmList.forEach((film) => {
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
    console.log(data)
    setFilmsPerCountryData(data)
  }, [userFilmList])

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
        console.log("Detected films from PS.")
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

    console.log("clicked")
    console.log("event: ", event)
    if (!mapRef.current) return

    const features = mapRef.current.queryRenderedFeatures(event.point, {
      layers: ["countriesLayer"],
    })

    console.log(features)

    if (features.length > 0) {
      clickedFeature = features[0]
      numWatchedFilms = clickedFeature.state?.num_watched_films
      customName = clickedFeature.state?.custom_name
      countryName = clickedFeature.properties?.name
    }

    console.log("custom name:", customName)

    setPopupInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      num_watched_films: numWatchedFilms >= 1 ? numWatchedFilms : 0,
      country_name: countryName,
      custom_name: customName,
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
    <div className="w-screen h-screen flex flex-col items-center">
      <NavBar />
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        onClick={onMapClick}
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
            <div className="flex flex-col items-center justify-center">
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
  )
}
