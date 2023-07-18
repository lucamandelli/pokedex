import LoginButton from "./LoginButton";

interface LoginFormProps {
  errorMessage: string;
  onSubmit: (event: React.FormEvent) => void;
}

function LoginForm({ errorMessage, onSubmit }: LoginFormProps) {
  return (
    <div className="flex items-center justify-center bg-poke-blue text-white">
      <div className='max-w-md w-full'>
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white drop-shadow-lg">
            Sign in to your account
          </h2>
          {errorMessage && (
            <h1 className="font-bold mt-2 text-center text-lg text-red-500 drop-shadow-lg">
              {errorMessage}
            </h1>
          )}
        </div>
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="drop-shadow-lg appearance-none rounded-md rounded-relative w-full py-2 px-3 bg-poke-white text-black text-sm placeholder-black focus:outline-none focus:shadow-outline-blue focus:border-indigo-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            placeholder="Username"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            required
            className="drop-shadow-lg appearance-none rounded-md rounded-relative w-full py-2 px-3 bg-poke-white text-black text-sm placeholder-black focus:outline-none focus:shadow-outline-blue focus:border-indigo-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            placeholder="Password"
          />

          <div>
            <LoginButton type="submit">
              Sign-in
            </LoginButton>
          </div>
        </form>
      </div>
    </div>
  )
};

export default LoginForm;