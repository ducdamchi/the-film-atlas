import React from "react"
import { useNavigate } from "react-router-dom"
import InteractionConsole from "./InteractionConsole"

export default function LaptopInteractionConsole({
  hoverId,
  filmObject,
  directors,
  movieDetails,
  isLoading,
  setIsLoading,
  hasOverview,
}) {
  const navigate = useNavigate()
  if (hoverId === filmObject.id) {
    return (
      <div className="hidden md:flex border-0 border-red-500 absolute bottom-0 left-0 w-[20rem] min-w-[20rem] max-w-[20rem] aspect-16/10 object-cover bg-black/70 items-start justify-center">
        {hasOverview && (
          <div className="flex flex-col justify-end items-center h-[10rem] max-h-p[10rem] border-0 border-blue-500 pb-3 ">
            <div className="w-full text-white pr-7 pl-7 pb-5 hover:text-blue-400">
              <span className="text-[9px] italic">
                {filmObject.overview?.slice(0, 180)}
              </span>
              {filmObject.overview?.length >= 181 && <span>{`...`}</span>}
            </div>
            <InteractionConsole
              tmdbId={hoverId}
              directors={directors}
              movieDetails={movieDetails}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              css={{
                height: "1.4rem",
                textColor: "white",
                hoverBg: "none",
                hoverTextColor: "oklch(70.7% 0.165 254.624)",
                fontSize: "9px",
                likeSize: "0.9rem",
                saveSize: "1.3rem",
                starSize: "1.1rem",
                flexGap: "2px",
                likeColor: "white",
                saveColor: "white",
                likedBgColor: "oklch(44.4% 0.177 26.899)",
                savedBgColor: "oklch(44.8% 0.119 151.328)",
                buttonPadding: "4px",
                paddingTopBottom: "0px",
                paddingLeftRight: "10px",
                buttonHeight: "1.7rem",
              }}
              showOverview={false}
            />
            <div
              className="border-red-500 absolute w-full h-full z-10"
              onClick={() => {
                navigate(`/films/${filmObject.id}`)
                setPage((prevPage) => ({ ...prevPage, loadMore: false }))
              }}></div>
          </div>
        )}

        {!hasOverview && (
          <div className="flex flex-col justify-center items-center h-[10rem] max-h-p[10rem] border-0 border-blue-500 pt-6">
            <InteractionConsole
              tmdbId={hoverId}
              directors={directors}
              movieDetails={movieDetails}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              css={{
                height: "1.4rem",
                textColor: "white",
                hoverBg: "none",
                hoverTextColor: "oklch(70.7% 0.165 254.624)",
                fontSize: "9px",
                likeSize: "0.9rem",
                saveSize: "1.3rem",
                starSize: "1.1rem",
                flexGap: "2px",
                likeColor: "white",
                saveColor: "white",
                likedBgColor: "oklch(44.4% 0.177 26.899)",
                savedBgColor: "oklch(44.8% 0.119 151.328)",
                buttonPadding: "4px",
                paddingTopBottom: "0px",
                paddingLeftRight: "10px",
                buttonHeight: "1.7rem",
              }}
              showOverview={false}
            />
            <div
              className="border-red-500 absolute w-full h-full z-10"
              onClick={() => {
                navigate(`/films/${filmObject.id}`)
                setPage((prevPage) => ({ ...prevPage, loadMore: false }))
              }}></div>
          </div>
        )}
      </div>
    )
  } else {
    return null
  }
}
