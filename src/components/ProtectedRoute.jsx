import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, token } = useAppContext()

  if (!token || !user) {
    return <Navigate to='/login' replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
