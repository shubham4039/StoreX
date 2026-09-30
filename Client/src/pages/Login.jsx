import React, { useState } from 'react'
import { MailIcon, LockIcon, UserIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'

const Login = ({ mode = "login" }) => {

  const isRegister = mode === "register";
  const navigate = useNavigate();
  const {login, register} = useApp()

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isloading, setIsLoading] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const ok = isRegister ? await register(form.name, form.email, form.password) :
    await login(form.email, form.password)
    setIsLoading(false)
    if(ok) navigate("/")
  }

  return (
    <div className="min-h-screen text-zinc-900 flex felx-col md:flex-row">

      {/* Left Hero Brand Panel */}
      <div className="md:w-1/2 p-8 md:p-12 1g:p-16 bg-linear-to-br from-orange-50
    via-zinc-100 to-red-50 border-b md:border-b-0 md:border-r border-zinc-200 flex
      flex-col justify-between relative overflow-hidden">
      <div className='absolute inset-0 bg-[url("/pattern.svg")]'></div>
      <div className="relative z-10 flex items-center gap-3">
        <img src="/logo.png" alt="StoreX Logo" className='max-h-17' />
        <span className="font-medium text-4xl uppercase text-zinc-900">StoreX</span>
      </div>

      <div className = "relative z-10 my-12 space-y-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xltracking-tight text-zinc-900">
          Secure, Simple & Fast <br/><span className="text-orange-600">Cloud Storage.</span></h2>
        <p className="text-zinc-600 text-sm md:text-base max-wd-md leading-relaxed ">
          StoreX is a secure and reliable cloud storage solution that allows you to store, access, 
          and share your files from anywhere, at any time. With our user-friendly interface and 
          advanced security features, you can trust StoreX to keep your data safe and accessible.
        </p>
      </div>

      <div className="relative z-10 text-sm text-zinc-500">© 2026 StoreX. 
        All rights reserved.
      </div>
      
      </div>


      {/* Right Auth Form */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div>
            <h3 className="text-2xl font-medium text-zinc-900">
              {isRegister ? "Create an Account" : "Welcome Back"}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {isRegister ? "Sign up to get started with StoreX." : "Sign in to your account."}
            </p>
          </div> 

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Full Name"
                icon={UserIcon}
                placeholder="Shubham Dutta"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
              )}

              <Input
                label="Email Address"
                type='email'
                icon={MailIcon}
                placeholder="abc@gmail.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />

              <Input
                label="Password"
                type='password'
                icon={LockIcon}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
              />

              <Button type='submit' variant="primary" className="w-full py-3"
              isLoading={isloading}>
                <span className="font-medium text-base">
                  {isRegister ? "Register Account" : "Sign In"}
                </span>
              </Button>
          </form>

          <div className="text-center pt-2">
            {isRegister ? (
              <p className="text-xs text-zinc-500">Already have an Account? {" "}
              <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                Sign in here
              </Link>
              </p>
            ) : (
              <p className="text-xs text-zinc-500">Don't have an Account? {" "}
              <Link to="/register" className="text-orange-600 font-semibold hover:underline">
                Create Account
              </Link>
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Login