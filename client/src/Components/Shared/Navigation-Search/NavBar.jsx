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

  //unit: rem
  const navbarHeight = 3
  const menuHeight = 6
  const setttingsHeight_Authed = 2.5
  const setttingsHeight_Unauthed = 4.2
  const borderWidth = 0.3

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
          menuRef.current.style.transform = "translateX(-400px)"
        }, 200)
        timer2 = setTimeout(() => {
          menuRef.current.style.display = "none"
          menuBorderBottom.current.style.display = "none"
          menuBorderRight.current.style.display = "none"
        }, 400)
        menuBorderBottom.current.style.transform = "translateX(-400px)"
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
          settingsRef.current.style.transform = "translateX(400px)"
        }, 200)
        timer2 = setTimeout(() => {
          settingsRef.current.style.display = "none"
          settingsBorderBottom.current.style.display = "none"
          settingsBorderRight.current.style.display = "none"
        }, 400)
        settingsBorderBottom.current.style.transform = "translateX(400px)"
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
    <div
      className={`fixed top-0 left-0 font-primary flex items-center justify-between w-screen p-0 md:p-3 md:pl-[2rem] md:pr-[2rem] bg-black/95 text-stone-200 border-b-[0.3rem] border-[#b8d5e5] z-100`}
      style={{ height: `${navbarHeight}rem` }}>
      {/* LEFT SIDE */}
      <div className="flex items-center justify-center gap-7 min-w-[12rem] ml-0 md:ml-3">
        {/* MOBILE - APP NAME */}
        <div className="md:hidden h-full flex items-center justify-center pt-0 z-30">
          <button className="mr-1">
            {menuOpened ? (
              <MdClose
                className="text-base mb-[1px]"
                onClick={() => setMenuOpened(false)}
              />
            ) : (
              <MdMenu
                className="text-base mb-[1px]"
                onClick={() => setMenuOpened(true)}
              />
            )}
          </button>
          <span className="font-logo text-[11px] uppercase font-black flex items-center justify-center p-1">
            The Film Atlas
          </span>
          <button
            className="flex items-center justify-center ml-2 p-[5px] pl-[10px] pr-[10px] rounded-full bg-stone-200 text-stone-900 cursor-pointer"
            onClick={() => {
              setSearchModalOpen(true)
            }}>
            <BiSearchAlt2 className="text-[10px]" />
          </button>
        </div>

        {/* MOBILE - HAMBURGER MENU CONTENT */}
        <div
          className={`hidden absolute z-20 left-0 bg-black border-[#b8d5e5] w-[50vw] pl-5 pb-5 pt-3 transition-all ease-out duration-200 font-light z-100`}
          style={{
            height: `${menuHeight}rem`,
            top: `${navbarHeight - borderWidth}rem`,
          }}
          ref={menuRef}>
          <ul className="flex flex-col gap-2 text-[11px]">
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
          className={`hidden absolute left-0 bg-[#d5e5b8] z-20 transition-all ease-out duration-400`}
          style={{
            height: `${borderWidth}rem`,
            width: `calc(50vw + ${borderWidth}rem)`,
            top: `${navbarHeight + menuHeight - borderWidth}rem`,
          }}
          ref={menuBorderBottom}></div>
        <div
          className="hidden absolute w-[0.4rem] h-[6rem] left-[50vw] top-[3rem] bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
          style={{
            height: `${menuHeight}rem`,
            width: `${borderWidth}rem`,
            top: `${navbarHeight - borderWidth}rem`,
          }}
          ref={menuBorderRight}></div>

        {/* LAPTOP - APP NAME*/}
        <div className="hidden md:flex h-full items-center justify-center">
          <span className="font-logo font-black uppercase text-sm">
            The Film Atlas
          </span>
        </div>

        {/* LAPTOP - HORIZONTAL MENU */}
        <div className="hidden md:flex text-[10px] font-extralight flex h-full mt-1 items-center gap-5 pb-[5px]">
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

      {/* RIGHT SIDE */}
      {/* MOBILE - USER INFO / AUTH */}
      <div className="md:hidden flex items-center justify-end gap-1 mr-3 text-[11px] z-100">
        {authState.status ? (
          <div>
            <div className="h-full flex items-center justify-center">
              <span className=" p-1 flex items-center justify-center font-light">{`${authState.username}`}</span>
            </div>
            <div
              className="hidden absolute z-20 right-0 bg-black border-[#b8d5e5] pl-5 pb-5 pt-5 transition-all ease-out duration-200 font-light justify-end items-center"
              style={{
                top: `${navbarHeight - borderWidth}rem`,
                width: `calc(50vw - ${3.1 * borderWidth}rem)`,
                height: `${setttingsHeight_Authed}rem`,
              }}
              ref={settingsRef}>
              <button className="mr-5 gap-2" onClick={logOut}>
                log out
              </button>
            </div>
            <div
              className="hidden absolute right-0 bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
              style={{
                width: `calc(50vw - ${2.1 * borderWidth}rem)`,
                height: `${borderWidth}rem`,
                top: `${navbarHeight + setttingsHeight_Authed - borderWidth}rem`,
              }}
              ref={settingsBorderBottom}></div>
            <div
              className="hidden absolute bg-[#d5e5b8] z-20 transition-all ease-out duration-400"
              style={{
                width: `${borderWidth}rem`,
                height: `${setttingsHeight_Authed}rem`,
                top: `${navbarHeight - borderWidth}rem`,
                left: "50vw",
              }}
              ref={settingsBorderRight}></div>
          </div>
        ) : (
          <div>
            <div
              className="absolute hidden z-20 right-0 bg-black border-[#b8d5e5]  pl-5 pb-5 pt-3 transition-all ease-out duration-200 font-light justify-end"
              style={{
                top: `${navbarHeight - borderWidth}rem`,
                width: `calc(50vw - ${borderWidth}rem)`,
                height: `${setttingsHeight_Unauthed}rem`,
              }}
              ref={settingsRef}>
              <ul className="flex flex-col text-right mr-5 gap-2 text-[11px]">
                <CustomLink to="/login">log in</CustomLink>
                <CustomLink to="/register">register</CustomLink>
              </ul>
            </div>
            <div
              className="hidden absolute right-0 bg-[#e5b8d5] z-20 transition-all ease-out duration-400"
              style={{
                width: `50vw`,
                height: `${borderWidth}rem`,
                top: `${navbarHeight + setttingsHeight_Unauthed - borderWidth}rem`,
              }}
              ref={settingsBorderBottom}></div>
            <div
              className="hidden absolute bg-[#d5e5b8] z-20 transition-all ease-out duration-400"
              style={{
                width: `${borderWidth}rem`,
                height: `${setttingsHeight_Unauthed}rem`,
                top: `${navbarHeight - borderWidth}rem`,
                left: "50vw",
              }}
              ref={settingsBorderRight}></div>
          </div>
        )}

        {!settingsOpened ? (
          <MdOutlineSettings
            className="text-base mb-[1px]"
            onClick={() => setSettingsOpened(true)}
          />
        ) : (
          <MdClose
            className="text-base mb-[1px]"
            onClick={() => setSettingsOpened(false)}
          />
        )}
      </div>

      {/* LAPTOP - USER INFO / AUTH */}
      {authState.status ? (
        <div className="hidden md:flex items-center justify-end gap-2 text-[10px] font-extralight">
          <div className="h-full flex items-center justify-center">
            <span>welcome,&nbsp;</span>
            <span className="font-bold">{`${authState.username}!`}</span>
          </div>
          <div className="font-thin text-base ">|</div>
          <button className="" onClick={logOut}>
            log out
          </button>
        </div>
      ) : (
        <div className="hidden md:flex flex items-center justify-end gap-2 text-[10px] font-extralight">
          <CustomLink className="" to="/login">
            log in
          </CustomLink>
          <div className="">|</div>
          <CustomLink className="" to="/register">
            register
          </CustomLink>
        </div>
      )}
    </div>
  )
}
