import LoginComponent from "../../components/login/login.jsx";

const Login = () => {
  return (
    <div className="min-h-screen bg-BGcolor flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-semibold mb-12">Logg inn</h1>
      <LoginComponent />
    </div>
  );
};

export default Login;
