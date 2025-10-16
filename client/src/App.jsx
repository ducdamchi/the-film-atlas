import { useState, useEffect } from "react"

import { HashRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import LoadingPage from "./Components/Shared/LoadingPage"
import Home from "./Components/Home"
import Watchlist from "./Components/Watchlist"
import FilmLanding from "./Components/FilmLanding"
import Register from "./Components/Register"
import LogIn from "./Components/Login"
import axios from "axios"

import { AuthContext } from "./Utils/authContext"

function App() {
  const [loading, setLoading] = useState(true)
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  })

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
        value={{ authState, setAuthState, loading, setLoading }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/films/:tmdbId" element={<FilmLanding />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LogIn />} />
          </Routes>
        </HashRouter>
      </AuthContext.Provider>
    </>
  )
}

export default App
