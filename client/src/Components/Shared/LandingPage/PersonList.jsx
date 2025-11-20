import React, { useEffect } from "react"

export default function PersonList({ title, listOfPeople, type }) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"

  // useEffect(() => {
  //   console.log("overlay color: ", overlayColor)
  // }, [overlayColor])

  return (
    <div className="flex flex-col justify-start items-center pl-3 pr-3 pt-2 drop-shadow-2xl mr-0 ">
      <div className="landing-sectionTitle mb-2 w-full">{title}</div>
      <div className="grid grid-cols-4 gap-2">
        {listOfPeople.map((person, key) => {
          return (
            <div
              key={key}
              className="relative w-[4.5rem] md:w-[6rem] aspect-2/3 flex flex-col mb-1 bg-white rounded-none">
              {/* <div className="overflow-hidden w-full relative text-wrap whitespace-wrap rounded-md bg-white border-1"> */}
              {/* <div
                className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-[var(--overlayColor-bottom)] via-[var(--overlayColor-top)] via-45% to-transparent z-10"
                style={{
                  "--overlayColor-bottom": `rgba(${overlayColor[0]}, ${overlayColor[1]}, ${overlayColor[2]}, 1)`,
                  "--overlayColor-top": `rgba(${overlayColor[0]}, ${overlayColor[1]}, ${overlayColor[2]}, 0.2)`,
                }}></div> */}
              <div className="w-full h-[70%] aspect-square overflow-hidden">
                <img
                  className="object-cover grayscale w-full transform hover:scale-[1.05] transition-all duration-300 ease-out drop-shadow-2xl rounded-t-none transform -translate-y-2"
                  src={
                    person.profile_path !== null
                      ? `${imgBaseUrl}${person.profile_path}`
                      : `profilepicnotfound.jpg`
                  }
                />
              </div>
              {/* <div className="border-red-500 absolute bottom-0 left-0 h-[2rem] w-full bg-gradient-to-t from-black/90 to-transparent z-20"></div> */}
              <div className="font-bold h-auto w-full flex flex-col items-start justify-start text-[7px] md:text-[10px] text-center  max-w-[4.5rem] text-left text-stone-900 p-[7px]">
                <div className="uppercase">{person.name}</div>
                {type === "cast" && (
                  <div className="font-extralight ">{`as ${person.character}`}</div>
                )}
                {type === "crew" && (
                  <div className="font-extralight text-[7px]/2">
                    {person.jobs.map((job, key) => (
                      <span key={key}>
                        {job}
                        {key !== person.jobs.length - 1 && <span>, </span>}
                      </span>
                    ))}
                  </div>
                )}
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
    </div>
  )
}
