import LeftAuthComponent from "../commoncomponent/LeftAuthComponent";
import LoginForm from "./LoginForm";
function Login() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <LeftAuthComponent
        title="Welcome back"
        description="Sign in to your account to access all the tools and features you need to manage and monitor your systems. Access real-time data and insights to make informed decisions and ensure everything is working efficiently."
      />
      <LoginForm />
    </div>
  );
}

export default Login;
