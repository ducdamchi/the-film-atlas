import React, { useEffect } from "react"

export default function PersonList({
  title,
  listOfPeople,
  overlayColor,
  overlayTextColor,
}) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"

  // useEffect(() => {
  //   console.log("overlay color: ", overlayColor)
  // }, [overlayColor])

  return (
    <div className="flex flex-col items-end border-0 pr-3 pt-2 drop-shadow-2xl mr-0">
      <div className="font-extralight text-[11px] mb-1 uppercase">{title}</div>
      {listOfPeople.map((person, key) => {
        return (
          <div
            key={key}
            className="relative w-[4.5rem] aspect-2/3 flex flex-col items-end mb-1 bg-white rounded-none">
            {/* <div className="overflow-hidden w-full relative text-wrap whitespace-wrap rounded-md bg-white border-1"> */}
            {/* <div
                className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-[var(--overlayColor-bottom)] via-[var(--overlayColor-top)] via-45% to-transparent z-10"
                style={{
                  "--overlayColor-bottom": `rgba(${overlayColor[0]}, ${overlayColor[1]}, ${overlayColor[2]}, 1)`,
                  "--overlayColor-top": `rgba(${overlayColor[0]}, ${overlayColor[1]}, ${overlayColor[2]}, 0.2)`,
                }}></div> */}
            <div className="w-full h-[70%] aspect-square">
              <img
                className="object-cover h-full w-full transform hover:scale-[1.05] transition-all duration-300 ease-out drop-shadow-2xl rounded-t-none"
                src={
                  person.profile_path !== null
                    ? `${imgBaseUrl}${person.profile_path}`
                    : `profilepicnotfound.jpg`
                }
              />
            </div>
            {/* <div className="border-red-500 absolute bottom-0 left-0 h-[2rem] w-full bg-gradient-to-t from-black/90 to-transparent z-20"></div> */}
            <div className="font-extralight h-[30%] w-full flex items-center justify-start text-[7px] text-center uppercase max-w-[4.5rem] text-left p-1 text-stone-900">
              {person.name}
              {/* {person.name.split(" ").map((word, key) => (
                <div key={key} className="w-full uppercase text-stone-900">
                  {word}
                </div>
              ))} */}
            </div>
          </div>
        )
      })}
    </div>
  )
}
