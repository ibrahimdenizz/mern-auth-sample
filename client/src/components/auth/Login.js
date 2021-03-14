import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as auth from '../../services/authService'
import Joi from 'joi'

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
})

const Login = ({ user, setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    top: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = schema.validate(
        { email, password },
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
    } catch (error) {}

    // Call Server

    try {
      const jwt = await auth.login({ email, password }, rememberMe)
      sessionStorage.setItem('token', jwt)
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

  useEffect(() => {
    const login = async () => {
      const token = auth.getJwt()
      if (token && !user) {
        sessionStorage.setItem('token', token)
        window.location = '/'
      }
    }
    login()
  }, [user])

  return (
    <div className='container h-100'>
      <div className=' h-100 d-flex justify-content-center align-items-center'>
        <div>
          <h1 className='mb-4'>Login</h1>
          <div className='text-danger'>{errors.top}</div>
          <form onSubmit={onSubmit}>
            <div className='my-4'>
              <div className='mb-3'>
                <input
                  className={`form-control ${
                    errors.email === '' ? '' : 'is-invalid'
                  }`}
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (e.target.value === '')
                      setErrors({
                        ...errors,
                        email: '"email" is not allowed to be empty',
                      })
                    else setErrors({ ...errors, email: '' })
                  }}
                />
                <div className='invalid-feedback'>{errors.email}</div>
              </div>
              <div className=' mb-3'>
                <input
                  className={`form-control ${
                    errors.password === '' ? '' : 'is-invalid'
                  }`}
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (e.target.value === '')
                      setErrors({
                        ...errors,
                        password: '"password" is not allowed to be empty',
                      })
                    else setErrors({ ...errors, password: '' })
                  }}
                />
                <div className='invalid-feedback'>{errors.password}</div>
              </div>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  value=''
                  id='flexCheckDefault'
                  checked={rememberMe === true ? 'checked' : ''}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='flexCheckDefault'>
                  Remember me
                </label>
              </div>
            </div>
            <div className='mb-3'>
              <Link to='/forgot-password'>Forgot Password?</Link>
            </div>
            <div>
              <button
                type='submit'
                className='btn btn-outline-primary px-4 mr-4'
              >
                Login
              </button>
              <Link
                to='/register'
                className='btn btn-outline-secondary px-4 ml-4'
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
