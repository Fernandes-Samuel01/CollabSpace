import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service.js";
import toast from "react-hot-toast";

const RESEND_COOLDOWN = 60;

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);

  // ---- Cooldown timer ----
  useEffect(() => {
    if (cooldown <= 0) return;
    intervalRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !code) return toast.error("Email and code are required");

    setLoading(true);
    try {
      await authService.verifyEmail({ email, code });
      toast.success("Email verified! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Enter your email first");
    if (cooldown > 0) return;

    setResending(true);
    try {
      await authService.resendCode(email);
      toast.success("New code sent");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(err.message);
      // If backend says "wait Xs", parse it (optional polish)
      const match = err.message?.match(/(\d+)s/);
      if (match) setCooldown(Number(match[1]));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
        <p className="text-sm text-slate-500 mt-1">
          We sent a 6-digit code to your inbox
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="input tracking-[0.5em] text-center text-lg font-semibold"
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="text-indigo-600 hover:underline disabled:text-slate-400 disabled:no-underline"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resending
              ? "Sending..."
              : "Resend code"}
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-slate-600">
          Back to{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;