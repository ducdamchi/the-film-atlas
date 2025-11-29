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
        <div className="font-heading page-title mb-10">DOCUMENTATION</div>

        <div className="md:p-10 max-w-[40rem]">
          <section className="flex flex-col p-5 gap-10">
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
                  creating a world heat map of the, compiling a list of your
                  watched directors, and maintaining a personal collection of
                  watched, rated, or watchlisted films. We do not ask for email
                  addresses in order to simplify the log in process, maintain
                  the anynomity of users, and most importantly, to highlight our
                  belief in an Internet where user's data are not being
                  commodified.
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
          </section>

          {/* <section className="flex flex-col p-5 gap-2">
            <div className="uppercase">
              <span className="">PHASE TWO&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span className="font-bold">REGIONAL FOCUS</span>
            </div>
            <div className="w-[10rem] flex items-center justify-start">
              <RiProgress4Line className="text-amber-500" />
              <span className="italic">&nbsp; In progress</span>
            </div>
            <div>
              <div className="font-bold">Overview</div>
              <div>
                In the second phase, The Film Atlas aims to granularize its map
                to serve as an archiver of films from culturally rich and
                distinctive cities around the world. It hopes to do so by
                collaborating with local organizations to create its own
                database of films that had left a significant cultural impact on
                the chosen city, as well as finding ways to make those films
                more accessible to the public. The Film Atlas would also like to
                serve as a resource provider for filmmakers looking for
                opportunities in such cities, featuring information concerning
                grants, fellowships, festivals, or community gatherings.
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="font-bold">Key tasks</div>
                <ul className="ml-2">
                  <li className="">
                    <GoSquareFill className="text-lg inline mb-1" />
                    &nbsp;Design independent database and create custom
                    management tools for collection and input.
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline mb-1" />
                    &nbsp;Community outreach and engagement.
                  </li>
                  <li className="">
                    <GoSquareFill className="text-lg inline mb-1" />
                    &nbsp;Develop new features based on available data.
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className="mt-10 flex items-center justify-center">
            <div>
              Interested?{" "}
              <span
                onClick={() => {
                  navigate("/contact")
                }}
                className="text-blue-800 cursor-pointer">
                Join our team!
              </span>
            </div>
          </section> */}
        </div>
      </div>
    </div>
  )
}
