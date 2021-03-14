import React, { Fragment, useState } from 'react'
import Joi from 'joi'
import { changePassword } from '../../services/userService'

const Password = ({ isEditable, setIsEditable, user }) => {
  const [newPassword, setNewPassword] = useState('')
  const [reNewPassword, setReNewPassword] = useState('')
  const [password, setPassword] = useState('')

  const [newPasswordErrors, setNewPasswordErrors] = useState({
    newPassword: '',
    reNewPassword: '',
    password: '',
    top: '',
    success: '',
  })

  const onChangePassword = async () => {
    if (newPassword !== reNewPassword) {
      setNewPasswordErrors({
        ...newPasswordErrors,
        newPassword: 'New passwords must be same',
        reNewPassword: 'New passwords must be same',
      })
      return
    }

    const schema = Joi.object({
      newPassword: Joi.string().min(5).max(50).required(),
      reNewPassword: Joi.string().required(),
    })

    try {
      const { error } = schema.validate({
        newPassword,
        reNewPassword,
      })
      const tempErrors = {}
      if (error) {
        error.details.forEach((err) => {
          tempErrors[err.path[0]] = err.message
        })

        setNewPasswordErrors({ ...newPasswordErrors, ...tempErrors })
        return
      }
    } catch (err) {}

    try {
      const result = await changePassword(newPassword, {
        email: user.email,
        password,
      })

      setNewPasswordErrors({ ...newPasswordErrors, success: result.success })
      setIsEditable({ ...isEditable, password: false })
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        setNewPasswordErrors({ ...newPasswordErrors, ...err.response.data })
      }
    }
  }

  const clearStates = () => {
    setPassword('')
    setNewPassword('')
    setReNewPassword('')

    setNewPasswordErrors({
      ...newPasswordErrors,
      newPassword: '',
      reNewPassword: '',
      password: '',
      top: '',
      success: '',
    })
  }

  return (
    <div>
      <h3>Password</h3>
      {isEditable.password ? (
        <Fragment>
          <div className='text-danger mb-3'>{newPasswordErrors.top}</div>
          <h5>Current password</h5>
          <div className=' input-group mb-3'>
            <input
              type='password'
              className={`form-control ${
                newPasswordErrors.password === '' ? '' : 'is-invalid'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className=' invalid-feedback'>
              {newPasswordErrors.password}
            </div>
          </div>

          <h5>New password</h5>
          <div className=' input-group mb-3'>
            <input
              type='password'
              className={`form-control ${
                newPasswordErrors.newPassword === '' ? '' : 'is-invalid'
              }`}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setNewPasswordErrors({
                  ...newPasswordErrors,
                  newPassword: '',
                  reNewPassword: '',
                })
              }}
            />
            <div className=' invalid-feedback'>
              {newPasswordErrors.newPassword}
            </div>
          </div>

          <h5>New password again</h5>
          <div className=' input-group mb-3'>
            <input
              type='password'
              className={`form-control ${
                newPasswordErrors.reNewPassword === '' ? '' : 'is-invalid'
              }`}
              value={reNewPassword}
              onChange={(e) => {
                setReNewPassword(e.target.value)
                setNewPasswordErrors({
                  ...newPasswordErrors,
                  newPassword: '',
                  reNewPassword: '',
                })
              }}
            />
            <div className=' invalid-feedback'>
              {newPasswordErrors.reNewPassword}
            </div>
          </div>

          <div>
            <button className='btn btn-success mr-3' onClick={onChangePassword}>
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
          <div className='text-success mb-3'>{newPasswordErrors.success}</div>
          <button
            className='btn btn-outline-primary'
            onClick={() => {
              setIsEditable({
                ...isEditable,
                password: true,
                profile: false,
                email: false,
              })
              clearStates()
            }}
          >
            Change Password
          </button>
        </Fragment>
      )}
    </div>
  )
}

export default Password
