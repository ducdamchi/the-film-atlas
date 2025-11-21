import React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from "yup"
import axios from "axios"
import NavBar from "./Shared/Navigation-Search/NavBar"

export default function Register() {
  const navigate = useNavigate()
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
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
    username: Yup.string().min(3).max(15).required("Username is required."),
    password: Yup.string().min(8).max(20).required("Password is required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .required("Confirm Password is required."),
  })
  return (
    <div className="font-primary mt-10">
      <div className="auth-whole">
        <div className="auth-svgContainer">
          <img src="worldmap.svg" alt="" className="auth-svg" />
          <img src="worldmap.svg" alt="" className="auth-svg" />
        </div>
        <NavBar />
        <div className="auth-formContainer">
          <div className="p-4">
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              enableReinitialize={true}>
              <Form className="auth-form">
                <Field
                  className="auth-formField"
                  id="username"
                  name="username"
                  placeholder="username"
                />
                <ErrorMessage
                  name="username"
                  component="error-div"
                  className="auth-formErrorMessage"
                />

                <Field
                  className="auth-formField"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                />

                <ErrorMessage
                  name="password"
                  component="error-div"
                  className="auth-formErrorMessage"
                />

                <Field
                  className="auth-formField"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="confirm password"
                />

                <ErrorMessage
                  name="confirmPassword"
                  component="error-div"
                  className="auth-formErrorMessage"
                />
                <button type="submit" className="auth-formSubmitButton">
                  create new account
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}
