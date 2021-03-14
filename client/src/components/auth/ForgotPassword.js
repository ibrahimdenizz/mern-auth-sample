import React, { useState } from 'react'
import { forgotPassword } from '../../services/userService'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({
    top: '',
    email: '',
    warning: '',
  })

  const onSend = async () => {
    if (email === '') {
      setErrors({ ...errors, email: 'Please enter your email address' })
      return
    }

    try {
      const result = await forgotPassword(email)

      setErrors({ ...errors, warning: result.warning, top: '' })
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        setErrors({ ...errors, ...err.response.data, warning: '' })
      }
    }
  }

  return (
    <div className='h-100 d-flex justify-content-center align-items-center'>
      <div>
        <h3>Please enter your email for reset password</h3>
        <div className='text-danger mb-3'>{errors.top}</div>
        <div className='text-warning mb-3'>{errors.warning}</div>
        <div className=' input-group mb-3'>
          <input
            type='text'
            className={`form-control ${
              errors.email === '' ? '' : 'is-invalid'
            }`}
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='invalid-feedback'>{errors.email}</div>
        </div>
        <button onClick={onSend} className=' btn btn-outline-primary'>
          Send
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
