import React from "react"

export default function PersonList({ title, listOfPeople }) {
  const imgBaseUrl = "https://image.tmdb.org/t/p/original"

  return (
    <div className="flex flex-col items-end border-0 pr-3 pt-2 drop-shadow-2xl mr-0">
      <div className="font-extralight text-[11px] mb-1 uppercase">{title}</div>
      {listOfPeople.map((person, key) => {
        return (
          <div
            key={key}
            className="relative w-auto flex flex-col items-end mb-4 pl-3">
            <div className="w-[4.5rem] aspect-2/3 overflow-hidden relative text-wrap whitespace-wrap rounded-md border-1">
              <img
                className="object-cover grayscale transform hover:scale-[1.05] transition-all duration-300 ease-out drop-shadow-2xl"
                src={
                  person.profile_path !== null
                    ? `${imgBaseUrl}${person.profile_path}`
                    : `profilepicnotfound.jpg`
                }
              />
              <div className="border-red-500 absolute bottom-0 left-0 h-[2rem] w-full bg-gradient-to-t from-black/90 to-transparent"></div>
              <div className="absolute bottom-1 right-1 font-black text-stone-200 text-[7px] text-right uppercase p-1 mt-0 max-w-[4.5rem] whitespace-normal wrap-break-word break-all">
                {person.name.split(" ").map((word, key) => (
                  <div key={key} className="w-full uppercase">
                    {word}
                  </div>
                ))}
              </div>
            </div>

            {/* Add a comma if it's not the last country on the list */}
            {/* {key !== mainCast.length - 1 && <span>,&nbsp;</span>} */}
          </div>
        )
      })}
    </div>
  )
}
