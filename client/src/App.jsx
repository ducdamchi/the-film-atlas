import axios from "axios"
import { useState, useEffect } from "react"
import { HashRouter, Route, Routes } from "react-router-dom"
import "./App.css"

import LoadingPage from "./Components/Shared/Navigation-Search/LoadingPage"
import Films from "./Components/Films"
import Directors from "./Components/Directors"
import FilmLanding from "./Components/FilmLanding"
import DirectorLanding from "./Components/DirectorLanding"
import Register from "./Components/Register"
import LogIn from "./Components/LogIn"
import MapPage from "./Components/MapPage"
import Footer from "./Components/Shared/Navigation-Search/Footer"

import { AuthContext } from "./Utils/authContext"

function App() {
  const [loading, setLoading] = useState(true)
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  })
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")

    /* If user not signed in, exit useEffect hook */
    if (!accessToken) {
      setLoading(false)
      return
    }

    /* Make API call to authenticate user */
    axios
      .get("http://localhost:3002/auth/verify", {
        headers: { accessToken: accessToken },
      })
      .then((response) => {
        // If no error, user successfully logged in
        if (!response.data.error) {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          })
        }
      })
      .catch((err) => {
        console.error("Client: Authentication failed", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          authState,
          setAuthState,
          loading,
          setLoading,
          searchModalOpen,
          setSearchModalOpen,
        }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/films" element={<Films />} />
            <Route path="/directors" element={<Directors />} />
            <Route path="/films/:tmdbId" element={<FilmLanding />} />
            <Route path="/directors/:tmdbId" element={<DirectorLanding />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LogIn />} />
          </Routes>
        </HashRouter>
      </AuthContext.Provider>
      {/* <Footer /> */}
    </>
  )
}

export default App
