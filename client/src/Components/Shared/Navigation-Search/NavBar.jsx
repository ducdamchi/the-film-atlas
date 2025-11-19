import { useContext, useState, useRef, useEffect } from "react"
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Utils/authContext"
import { BiSearchAlt2, BiMenu, BiSolidMessageRoundedDots } from "react-icons/bi"
import { MdClose, MdMenu, MdOutlineSettings, MdSearch } from "react-icons/md"
import { TbArrowBigRightLinesFilled } from "react-icons/tb"

import { usePersistedState } from "../../../Hooks/usePersistedState"

export default function NavBar() {
  const { authState, setAuthState, searchModalOpen, setSearchModalOpen } =
    useContext(AuthContext)

  const [menuOpened, setMenuOpened] = usePersistedState(
    "navbar-menuOpened",
    false
  )
  const [settingsOpened, setSettingsOpened] = usePersistedState(
    "navbar-settingsOpened",
    false
  )
  const menuRef = useRef(null)
  const menuBorderBottom = useRef(null)
  const menuBorderRight = useRef(null)
  const settingsRef = useRef(null)
  const settingsBorderBottom = useRef(null)
  const settingsBorderRight = useRef(null)
  const navigate = useNavigate()

  function CustomLink({ to, children, exact = true, ...props }) {
    // to: URL path (e.g., "/about", "/contact")
    // children: Content inside the link (text, icons, etc.)
    // ...props: Any other props passed to the component (className, onClick, etc.)
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: exact })
    return (
      <div
        className={
          isActive
            ? "underline decoration-solid decoration-2 underline-offset-4"
            : ""
        }>
        <Link to={to} {...props}>
          {children}
        </Link>
      </div>
    )
  }

  const logOut = () => {
    localStorage.removeItem("accessToken")
    setAuthState({ username: "", id: 0, status: false })
    navigate("/login")
  }

  useEffect(() => {
    if (
      menuRef.current &&
      menuBorderBottom.current &&
      menuBorderRight.current
    ) {
      // console.log("Menu Opened: ", menuOpened)
      let timer1, timer2
      if (menuOpened) {
        menuRef.current.style.display = "flex"
        menuBorderBottom.current.style.display = "block"
        menuBorderRight.current.style.display = "block"
        timer1 = setTimeout(() => {
          menuRef.current.style.transform = "translateY(0px)"
        }, 400)

        timer2 = setTimeout(() => {
          menuBorderBottom.current.style.transform = "translateY(0px)"
          menuBorderRight.current.style.transform = "translateY(0px)"
        }, 200)

        // menuRef.current.style.borderWidth = "3px"
      } else {
        timer1 = setTimeout(() => {
          menuRef.current.style.transform = "translateX(-200px)"
        }, 200)
        timer2 = setTimeout(() => {
          menuRef.current.style.display = "none"
          menuBorderBottom.current.style.display = "none"
          menuBorderRight.current.style.display = "none"
        }, 400)
        menuBorderBottom.current.style.transform = "translateX(-200px)"
        menuBorderRight.current.style.transform = "translateY(-180px)"
        // settingsRef.current.style.borderWidth = "0px"
      }
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [menuOpened])

  useEffect(() => {
    if (
      settingsRef.current &&
      settingsBorderBottom.current &&
      settingsBorderRight.current
    ) {
      // console.log("Settings Opened: ", settingsOpened)

      let timer1, timer2
      if (settingsOpened) {
        settingsRef.current.style.display = "flex"
        settingsBorderBottom.current.style.display = "block"
        settingsBorderRight.current.style.display = "block "
        timer1 = setTimeout(() => {
          settingsRef.current.style.transform = "translateY(0px)"
        }, 400)

        timer2 = setTimeout(() => {
          settingsBorderBottom.current.style.transform = "translateY(0px)"
          settingsBorderRight.current.style.transform = "translateY(0px)"
        }, 200)

        // settingsRef.current.style.borderWidth = "3px"
      } else {
        // settingsRef.current.style.display = "block"
        timer1 = setTimeout(() => {
          settingsRef.current.style.transform = "translateX(200px)"
        }, 200)
        timer2 = setTimeout(() => {
          settingsRef.current.style.display = "none"
          settingsBorderBottom.current.style.display = "none"
          settingsBorderRight.current.style.display = "none"
        }, 400)
        settingsBorderBottom.current.style.transform = "translateX(200px)"
        settingsBorderRight.current.style.transform = "translateY(-180px)"
        // settingsRef.current.style.borderWidth = "0px"
      }
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [settingsOpened])

  return (
    <div className="font-primary flex items-center justify-between w-screen p-0 md:p-3 md:pl-[2rem] md:pr-[2rem] h-[4rem] md:h-[5rem] bg-black text-stone-200 border-b-5 border-[#b8d5e5] z-100">
      <div className="flex items-center justify-center gap-7 min-w-[12rem] ml-3">
        {/* MOBILE - APP NAME */}
        <div className="md:hidden h-full flex items-center justify-center pt-0 z-30">
          <button className="mr-1 ">
            {menuOpened ? (
              <MdClose
                className="text-xl mb-[2px]"
                onClick={() => setMenuOpened(false)}
              />
            ) : (
              <MdMenu
                className="text-xl mb-[2px]"
                onClick={() => setMenuOpened(true)}
              />
            )}
          </button>
          <span className="font-heading text-[13px] uppercase font-black flex items-center justify-center p-1">
            The Film Atlas
          </span>
          <button
            className="flex items-center justify-center ml-2 p-[5px] pl-[10px] pr-[10px] rounded-full bg-stone-200 text-stone-900 cursor-pointer"
            onClick={() => {
              setSearchModalOpen(true)
            }}>
            <BiSearchAlt2 className="text-xs" />
          </button>
        </div>

        {/* MOBILE - HAMBURGER MENU CONTENT */}
        <div
          className="hidden absolute z-20 top-[59px] left-0 bg-black border-[#b8d5e5] w-[calc(50vw)] h-[6.5rem] pl-5 pb-5 pt-3 transition-all ease-out duration-200 font-light"
          ref={menuRef}>
          <ul className="flex flex-col gap-2 text-[13px]">
            <CustomLink
              to="/map"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              MAP
            </CustomLink>
            <CustomLink
              to="/films"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              FILMS
            </CustomLink>
            <CustomLink
              to="/directors"
              exact={false}
              onClick={() => {
                setMenuOpened(false)
                setSettingsOpened(false)
              }}>
              DIRECTORS
            </CustomLink>
          </ul>
        </div>
        <div
          className="hidden absolute w-[calc(50vw+0.4rem)] h-[0.4rem] top-[163px] left-0 bg-[#d5e5b8] z-20 transition-all ease-out duration-400"
          ref={menuBorderBottom}></div>
        <div
          className="hidden absolute w-[0.4rem] h-[6.5rem] left-[50%] top-[59px] bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
          ref={menuBorderRight}></div>

        {/* LAPTOP - APP NAME*/}
        <div className="hidden md:flex h-full items-center justify-center pt-1">
          <span className="font-heading font-black uppercase">
            The Film Atlas
          </span>
        </div>

        {/* LAPTOP - HORIZONTAL MENU */}
        <div className="hidden md:flex text-sm flex h-full mt-1 items-center gap-5">
          <ul className="flex gap-7 p-2">
            <CustomLink to="/map" exact={false}>
              MAP
            </CustomLink>
            <CustomLink to="/films" exact={false}>
              FILMS
            </CustomLink>
            <CustomLink to="/directors" exact={false}>
              DIRECTORS
            </CustomLink>
          </ul>
          <button
            className="flex items-center justify-center gap-1 border-0 p-1 pl-2 pr-2 rounded-full bg-stone-200 text-gray-600 cursor-pointer"
            onClick={() => {
              setSearchModalOpen(true)
            }}>
            <BiSearchAlt2 />
            {`\u2318K`}
          </button>
        </div>
      </div>

      {/* MOBILE - USER INFO / AUTH */}

      <div className="md:hidden flex items-center justify-end gap-1 mr-3 text-[13px]">
        {authState.status ? (
          <div>
            <div className="h-full flex items-center justify-center">
              <span className=" p-1 flex items-center justify-center font-light">{`${authState.username}`}</span>
            </div>
            <div
              className="hidden absolute z-20 top-[59px] right-0 bg-black border-[#b8d5e5] w-[50vw] h-[2.5rem] pl-5 pb-5 pt-5 transition-all ease-out duration-200 font-light justify-end items-center"
              ref={settingsRef}>
              <button className="mr-5 gap-2 text-[13px]" onClick={logOut}>
                log out
              </button>
            </div>
            <div
              className="hidden absolute w-[50vw] h-[0.4rem] top-[99px] right-0 bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
              ref={settingsBorderBottom}></div>
            <div
              className="hidden absolute w-[0.4rem] h-[2.5rem] left-[50%] top-[59px] bg-[#d5e5b8] z-20 transition-all ease-out duration-400"
              ref={settingsBorderRight}></div>
          </div>
        ) : (
          <div>
            <div className="h-full flex items-center justify-center">
              {/* <span className="p-2 font-light text-[8px] italic">
                {`log in to enjoy all features!`}
              </span> */}
            </div>
            <div
              className="absolute hidden z-20 top-[59px] right-0 bg-black border-[#b8d5e5] w-[50vw] h-[4.8rem] pl-5 pb-5 pt-3 transition-all ease-out duration-200 font-light justify-end"
              ref={settingsRef}>
              <ul className="flex flex-col text-right mr-5 gap-2 text-[13px]">
                <CustomLink to="/login">log in</CustomLink>
                <CustomLink to="/register">register</CustomLink>
              </ul>
            </div>
            <div
              className="hidden absolute w-[50vw] h-[0.4rem] top-[136px] right-0 bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
              ref={settingsBorderBottom}></div>
            <div
              className="hidden absolute w-[0.4rem] h-[4.8rem] left-[50%] top-[59px] bg-[#d5e5b8] z-20 transition-all ease-out duration-400"
              ref={settingsBorderRight}></div>
          </div>
        )}

        {!settingsOpened ? (
          <MdOutlineSettings
            className="text-xl"
            onClick={() => setSettingsOpened(true)}
          />
        ) : (
          <MdClose
            className="text-xl"
            onClick={() => setSettingsOpened(false)}
          />
        )}
      </div>

      {/* LAPTOP - USER INFO / AUTH */}
      {authState.status ? (
        <div className="hidden md:flex items-center justify-end gap-2">
          <div className="text-sm h-full flex items-center justify-center">
            <span>welcome,&nbsp;</span>
            <span className="font-bold">{`${authState.username}!`}</span>
          </div>
          <div className="font-thin text-base ">|</div>
          <button className=" text-sm" onClick={logOut}>
            log out
          </button>
        </div>
      ) : (
        <div className="hidden md:flex flex items-center justify-end gap-2">
          <CustomLink className="text-sm" to="/login">
            log in
          </CustomLink>
          <div className="font-thintext-base ">|</div>
          <CustomLink className="text-sm" to="/register">
            register
          </CustomLink>
        </div>
      )}
    </div>
  )
}
