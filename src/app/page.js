"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  loginWithEmail,
  signupWithEmail,
  googleLogin,
  resetPassword,
  clearError,
} from "@/store/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, ready, loading, error, message } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  // login ho jaye to home page par bhej do
  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signupWithEmail({ email, password }));
    } else {
      dispatch(loginWithEmail({ email, password, remember }));
    }
  };

  const handleForgot = () => {
    if (!email) return alert("Pehle email likhein");
    dispatch(resetPassword(email));
  };

  if (!ready || user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* left side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
              :)
            </div>
          </div>

          <h1 className="text-center text-xl font-semibold">
            {isSignup ? "Create your account" : "Welcome to AI Labs"}
          </h1>
          <p className="text-center text-xs text-gray-400 mt-2 mb-6">
            Please sign in or sign up with your Google account.
          </p>

          <button
            onClick={() => dispatch(googleLogin())}
            disabled={loading}
            className="w-full border rounded-lg py-2.5 text-sm text-black font-medium shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" color="black" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z" />
              <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.800 2.300-8.300 2.300-6.300 0-11.600-4-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit}>
            <label className="text-xs text-black font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
              required
              className="w-full border rounded-lg px-3 py-2 text-black  text-sm mt-1 mb-4 outline-none focus:border-black"
            />

            <label className="text-xs text-black font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                placeholder="Write your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  dispatch(clearError());
                }}
                required
                className={`w-full border rounded-lg text-black px-3 py-2 text-sm outline-none ${
                  error ? "border-red-400" : "focus:border-black"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2 text-xs text-gray-500"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {error && <p className="text-red-600 text-xs mt-2">⚠ {error}</p>}
            {message && <p className="text-green-600 text-xs mt-2">{message}</p>}

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-xs font-medium text-black"
                
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-sm mt-5 disabled:opacity-60"
            >
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Continue"}
            </button>
          </form>

          <p
            onClick={() => {
              setIsSignup(!isSignup);
              dispatch(clearError());
            }}
            className="text-center text-black text-xs mt-6 cursor-pointer"
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "New here? Create account"}
          </p>
        </div>
      </div>

      {/* right side - image */}
{/* right side - image screen ki height ke andar fit hogi */}
<div className="hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center overflow-hidden bg-slate-50 p-4">
  <img
    src="/login-side-image.png"
    alt="Select, combine and integrate"
    className="h-full w-full object-contain"
  />
</div>    </div>
  );
}