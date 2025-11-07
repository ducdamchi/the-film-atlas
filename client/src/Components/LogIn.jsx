import React, { useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import axios from "axios"

import NavBar from "./Shared/NavBar"

import { AuthContext } from "../Utils/authContext"

export default function LogIn() {
  const navigate = useNavigate()
  const initialValues = {
    username: "",
    password: "",
  }
  const { setAuthState } = useContext(AuthContext)

  const onSubmit = (data) => {
    // console.log(data)
    axios.post("http://localhost:3002/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error)
      } else {
        localStorage.setItem("accessToken", response.data.token)
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        })
        navigate("/")
      }
    })
  }

  const validationSchema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
  })
  return (
    <>
      <div className="flex flex-col items-center">
        <NavBar />
        <div className="mt-20">
          <div className="p-4 border-1">
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              enableReinitialize={true}>
              <Form className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <label htmlFor="username">username</label>

                  <Field
                    className="border-1 p-1"
                    id="username"
                    name="username"
                    placeholder="Enter username"
                  />
                </div>
                <ErrorMessage
                  name="username"
                  component="error-div"
                  className="text-red-500"
                />
                <div className="flex gap-2 items-center">
                  <label htmlFor="password">password</label>
                  <Field
                    className="border-1 p-1"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="error-div"
                  className="text-red-500"
                />
                <button type="submit" className="border-1 w-[7rem] p-1">
                  log in
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}
