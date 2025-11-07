import React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from "yup"
import axios from "axios"
import NavBar from "./Shared/NavBar"

export default function Register() {
  const navigate = useNavigate()
  const initialValues = {
    username: "",
    password: "",
  }

  const onSubmit = (data) => {
    axios.post("http://localhost:3002/auth/register", data).then((response) => {
      if (response.data.error) {
        alert("Error Registering User.")
      } else {
        navigate("/login")
      }
    })
  }

  const validationSchema = Yup.object({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(8).max(20).required(),
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
                  create user
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}
