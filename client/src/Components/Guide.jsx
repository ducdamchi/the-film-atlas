import React, { useContext } from "react"
import NavBar from "./Shared/Navigation-Search/NavBar"
import QuickSearchModal from "./Shared/Navigation-Search/QuickSearchModal"
import { GoSquareFill } from "react-icons/go"
import { AuthContext } from "../Utils/authContext"
import { RiProgress8Line, RiProgress4Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

export default function Docs() {
  const navigate = useNavigate()
  const { searchModalOpen, setSearchModalOpen } = useContext(AuthContext)
  return (
    <div className="font-primary mt-20 mb-20">
      {searchModalOpen && (
        <QuickSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
        />
      )}
      <div className="flex flex-col items-center">
        <NavBar />
        <div className="font-heading page-title mb-10">GUIDE</div>

        <div className="md:p-10 max-w-[40rem]">
          <section className="flex flex-col p-5 gap-10 mb-10">
            <div className="uppercase flex flex-col gap-2">
              <div className="font-thin text-xs">Getting started</div>
              <div className="inline-block text-2xl font-bold">
                Creating an account
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <div className="font-bold">Enjoy all features</div>
                <div className="font-light">
                  An account is needed for The Film Atlas to keep track of your
                  interactions with films. These interactions are crucial for
                  creating a heat map of the world, compiling a list of your
                  watched directors, and maintaining a personal collection of
                  watched, rated, or watchlisted films. We do not ask for email
                  addresses in order to simplify the log in process and maintain
                  the anynomity of users.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="font-bold">Account-less features</div>
                <div className="font-light">
                  While it is highly recommended to create an account, users can
                  still enjoy some features of The Film Atlas, including
                  browsing films from a world map, looking up details from a
                  film or director, and viewing the filmography of a director or
                  actor.
                </div>
              </div>
            </div>
            {/* <div className="border-1 h-[1px] w-[80%] self-center mt-5"></div> */}
          </section>

          <section className="flex flex-col p-5 gap-10 mb-10">
            <div className="uppercase flex flex-col gap-2">
              <div className="font-thin text-xs">Getting started</div>
              <div className="inline-block text-2xl font-bold">AT A GLANCE</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div
                  className="font-bold hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/maps")
                  }}>
                  Map
                </div>
                <div className="font-light">
                  Once users start adding films to their watched list, their map
                  will be colored based on the corresponding origin countries of
                  the watched films.
                </div>
                <img
                  src="/mapexample1.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="border-2 w-full aspect-cover mt-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="font-bold hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/films")
                  }}>
                  Films
                </div>
                <div className="font-light">
                  Similarly, several collection of films will also appear on the
                  films main page (watched, watchlist, rated), which can be
                  sorted through in multiple ways.
                </div>
                <img
                  src="/filmsexample1.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="border-2 w-full aspect-cover mt-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="font-bold hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/directors")
                  }}>
                  Directors
                </div>
                <div className="font-light">
                  A list of directors whose films users have watched will also
                  be formed.
                </div>
                <img
                  src="/directorsexample1.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="border-2 w-full aspect-cover mt-3"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col p-5 gap-10 mb-10">
            <div className="uppercase flex flex-col gap-2">
              <div className="font-thin text-xs">Feature Highlights</div>
              <div className="inline-block text-2xl font-bold">MAP PAGE</div>
            </div>
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-2">
                <div
                  className="font-bold hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/map")
                  }}>
                  On click
                </div>
                <div className="font-light">
                  Clicking on a country will trigger a small popup window
                  displaying how many films you've seen from that country. More
                  importantly, this action will also set the target country for
                  other features, such as discovering films or viewing films
                  you've watched from that country. If an invalid region is
                  clicked on (e.g. Atlantic Ocean), no films data will be
                  available for that region. By default, the map page will
                  display "Invalid Region" for first time visitors, as no region
                  has been selected on the map.
                </div>
                <img
                  src="/map1.png"
                  alt="Image of a popup container displaying how many films user has watched from selected country."
                  className="border-2 w-full aspect-cover mt-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="font-bold hover:text-blue-800 transition-all ease-out duration-200"
                  onClick={() => {
                    navigate("/films")
                  }}>
                  Discover Mode
                </div>
                <div className="font-light">
                  In Discover Mode, you will be able to view a list of films
                  from the selected country. This list is provided via an API
                  call to{" "}
                  <a
                    href="https://www.themoviedb.org/?language=en-US"
                    className="text-blue-800">
                    The Movie Database
                  </a>
                  . There are three sort options:
                </div>
                <ul className="ml-2">
                  <li className="">
                    <span>
                      <GoSquareFill className="text-lg inline mb-1" />
                      &nbsp;RANDOM: list will be shuffled in an arbitrary order.
                    </span>
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;AVG RATING: list will be sorted from highest to lowest
                    average rating.
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;Watched films are projected onto a choropleth map
                    based on their origin(s).
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline" />
                    &nbsp;Each director gets assigned a{" "}
                    <a className="text-blue-800">score</a> based on the user's
                    interaction with their films.
                  </li>
                </ul>
                <img
                  src="/map2.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="border-2 w-full aspect-cover mt-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="font-bold">Directors</div>
                <div className="font-light">
                  A list of directors whose films users have watched will also
                  be formed.
                </div>
                <img
                  src="/directorsexample1.png"
                  alt="Image of a heat map of the world based on a user's watched films."
                  className="border-2 w-full aspect-cover mt-3"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
