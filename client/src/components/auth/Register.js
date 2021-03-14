import React, { useState } from 'react'
import Joi from 'joi'
import * as userService from '../../services/userService'

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(5).max(50).required(),
  repassword: Joi.string().required(),
  name: Joi.string().alphanum().min(5).max(25).required(),
})

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    repassword: '',
    top: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    if (password !== repassword) {
      setErrors({
        ...errors,
        password: 'Passwords must be same',
        repassword: 'Passwords must be same',
      })
      return
    }
    try {
      const { error } = schema.validate(
        { email, password, repassword, name },
        { abortEarly: false }
      )
      const tempErrors = {}
      if (error) {
        error.details.forEach((err) => {
          tempErrors[err.path[0]] = err.message
        })

        setErrors({ ...errors, ...tempErrors })
        return
      }
    } catch (err) {}

    // Call Server

    try {
      await userService.register({ email, name, password })

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
    <div className='container h-100'>
      <div className=' h-100 d-flex justify-content-center align-items-center'>
        <div>
          <h1 className='mb-4'>Register</h1>
          <div className='text-danger'>{errors.top}</div>
          <form onSubmit={onSubmit} className='my-3'>
            <div className='input-group mb-3'>
              <input
                type='text'
                className={`form-control ${
                  errors.name === '' ? '' : 'is-invalid'
                }`}
                placeholder='Name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value === '') {
                    setErrors({
                      ...errors,
                      name: '"name" is not allowed to be empty',
                    })
                  } else {
                    setErrors({ ...errors, name: '' })
                  }
                }}
              />
              <div className='invalid-feedback'>{errors.name}</div>
            </div>
            <div className='input-group mb-3'>
              <input
                type='text'
                className={`form-control ${
                  errors.email === '' ? '' : 'is-invalid'
                }`}
                placeholder='Email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (e.target.value === '') {
                    setErrors({
                      ...errors,
                      email: '"email" is not allowed to be empty',
                    })
                  } else {
                    setErrors({ ...errors, email: '' })
                  }
                }}
              />
              <div className='invalid-feedback'>{errors.email}</div>
            </div>
            <div className='input-group mb-3'>
              <input
                type='password'
                className={`form-control ${
                  errors.password === '' ? '' : 'is-invalid'
                }`}
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (e.target.value === '') {
                    setErrors({
                      ...errors,
                      password: '"password" is not allowed to be empty',
                    })
                  } else {
                    setErrors({ ...errors, password: '' })
                  }
                }}
              />
              <div className='invalid-feedback'>{errors.password}</div>
            </div>
            <div className='input-group mb-3'>
              <input
                type='password'
                className={`form-control ${
                  errors.repassword === '' ? '' : 'is-invalid'
                }`}
                placeholder='Repassword'
                value={repassword}
                onChange={(e) => {
                  setRepassword(e.target.value)
                  if (e.target.value === '') {
                    setErrors({
                      ...errors,
                      repassword: '"repassword" is not allowed to be empty',
                    })
                  } else if (password !== e.target.value) {
                    setErrors({
                      ...errors,
                      repassword: 'Passwords must be same',
                    })
                  } else setErrors({ ...errors, repassword: '' })
                }}
              />
              <div className='invalid-feedback'>{errors.repassword}</div>
            </div>
            <button type='submit' className='btn btn-outline-primary'>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
