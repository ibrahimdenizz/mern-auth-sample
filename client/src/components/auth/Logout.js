import React, { useEffect } from 'react'
import * as auth from '../../services/authService'

const Logout = () => {
  useEffect(() => {
    auth.logout()
    window.location = '/'
  })

  return <div></div>
}

export default Logout
