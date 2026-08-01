
import LoginForm from "./_components/LoginForm";


export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
          {/*Form generic text*/}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">
              Login Form
            </h1>
            <p className="text-gray-900 text-lg py-4">
              Enter your credentials.
            </p>
            {/*form*/}
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  )
}

