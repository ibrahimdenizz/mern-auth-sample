import React, { Fragment, useState } from 'react'
import Joi from 'joi'
import { changeEmail } from '../../services/userService'

const Email = ({ isEditable, setIsEditable, user }) => {
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailErrors, setEmailErrors] = useState({
    email: '',
    password: '',
    top: '',
    warning: '',
  })

  const onChangeEmail = async () => {
    const schema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    })

    try {
      const { error } = schema.validate({ email: newEmail })
      const tempErrors = {}
      if (error) {
        error.details.forEach((err) => {
          tempErrors[err.path[0]] = err.message
        })

        setEmailErrors({ ...emailErrors, ...tempErrors })
        return
      }
    } catch (err) {}

    try {
      const result = await changeEmail(newEmail, {
        email: user.email,
        password,
      })
      setEmailErrors({ ...emailErrors, warning: result.warning })
      setIsEditable({ ...isEditable, email: false })
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        setEmailErrors({ ...emailErrors, ...err.response.data })
      }
    }
  }

  const clearStates = () => {
    setNewEmail('')
    setPassword('')
    setEmailErrors({
      ...emailErrors,
      email: '',
      password: '',
      top: '',
    })
  }

  return (
    <div>
      <h3>Email </h3>
      {isEditable.email ? (
        <Fragment>
          <div className='text-danger'>{emailErrors.top}</div>

          <h5>New Email</h5>
          <div className=' input-group my-3'>
            <input
              type='text'
              className={`form-control ${
                emailErrors.email === '' ? '' : 'is-invalid'
              }`}
              placeholder={user.email}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <div className=' invalid-feedback'>{emailErrors.email}</div>
          </div>
          <h5>Password</h5>
          <div className=' input-group mb-3'>
            <input
              type='password'
              className={`form-control ${
                emailErrors.password === '' ? '' : 'is-invalid'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className=' invalid-feedback'>{emailErrors.password}</div>
          </div>
          <div>
            <button className='btn btn-success mr-3' onClick={onChangeEmail}>
              Save
            </button>
            <button
              className='btn btn-danger ml-3'
              onClick={() => {
                setIsEditable({
                  ...isEditable,
                  profile: false,
                  email: false,
                  password: false,
                })
                clearStates()
              }}
            >
              Cancel
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className='text-warning'>{emailErrors.warning}</div>
          <p>{user.email}</p>
          <button
            onClick={() => {
              setIsEditable({
                ...isEditable,
                email: true,
                profile: false,
                password: false,
              })
              clearStates()
            }}
            className='btn btn-outline-primary mb-3'
          >
            Change email
          </button>
        </Fragment>
      )}
    </div>
  )
}

export default Email
