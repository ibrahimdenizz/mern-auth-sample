import Joi from 'joi'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiUrl } from '../../config.json'
import http from '../../services/httpService'
import { resetPassword } from '../../services/userService'

const ResetPassword = () => {
  const { token } = useParams()
  const [newPassword, setNewPassword] = useState('')
  const [reNewPassword, setReNewPassword] = useState('')
  const [errors, setErrors] = useState({
    newPassword: '',
    reNewPassword: '',
    top: '',
  })

  useEffect(() => {
    isTokenValid()
  })

  const isTokenValid = async () => {
    try {
      http.setJwt(token)
      await http.get(apiUrl + '/users/me')
    } catch (error) {
      window.location = '/not-found'
    }
  }

  const onReset = async () => {
    if (newPassword !== reNewPassword) {
      setErrors({
        ...errors,
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

        setErrors({ ...errors, ...tempErrors })
        return
      }
    } catch (err) {}

    try {
      await resetPassword(newPassword, token)

      window.location = '/'
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        setErrors({ ...errors, ...err.response.data })
      }
    }
  }

  return (
    <div className='h-100 d-flex justify-content-center align-items-center'>
      <div>
        <div className=' text-danger'>{errors.top}</div>
        <h4>New Password</h4>
        <div className='input-group mb-3'>
          <input
            type='password'
            className={`form-control ${
              errors.newPassword === '' ? '' : 'is-invalid'
            }`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className=' invalid-feedback'>{errors.newPassword}</div>
        </div>
        <h4>New Password Again</h4>
        <div className='input-group mb-3'>
          <input
            type='password'
            className={`form-control ${
              errors.reNewPassword === '' ? '' : 'is-invalid'
            }`}
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
          />
          <div className=' invalid-feedback'>{errors.reNewPassword}</div>
        </div>
        <div>
          <button className='btn btn-success' onClick={onReset}>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
