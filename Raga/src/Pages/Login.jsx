// src/pages/Login.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); // Fake login
    navigate('/features');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Click to Login</button>
    </div>
  );
}

export default Login;
