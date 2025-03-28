import LoginComponent from "../../components/login/login.jsx";

const Login = () => {
  return (
    <div className="min-h-screen bg-BGcolor flex items-center justify-center p-6">
      <div className="max-w-[1400px] mx-auto px-4 w-full">
        <h1 className="text-center text-3xl font-bold mb-6">Login Page</h1>
        <LoginComponent />
      </div>
    </div>
  );
};

export default Login;
