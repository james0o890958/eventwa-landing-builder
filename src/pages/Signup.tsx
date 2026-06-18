import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  // Verification states
  const [isStepVerify, setIsStepVerify] = useState(false);
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verified, setVerified] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Automatically trigger verification when all 6 digits are typed
  useEffect(() => {
    if (otp.length === 6 && isStepVerify && email) {
      handleVerify();
    }
  }, [otp, isStepVerify, email]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await api.post("user-register", {
        email,
        password,
        password_confirmation: confirmPassword,
        name: displayName,
        phone,
        phone_number: phone,
      });

      const token = data.access_token || data.data?.access_token;
      const userData = data.user || data.data?.user;

      if (token && userData) {
        const isOrganizer = data.is_organizer || data.data?.is_organizer || !!userData?.organizer;
        const mappedUser = {
          ...userData,
          is_organizer: isOrganizer,
          user_metadata: {
            ...userData?.user_metadata,
            display_name: userData?.name || userData?.user_metadata?.display_name || userData?.email?.split("@")[0] || "User",
            full_name: userData?.name || userData?.user_metadata?.full_name || "User",
            is_organizer: isOrganizer,
          },
        };
        // Keep credentials in sessionStorage temporarily until OTP is verified
        sessionStorage.setItem("temp_signup_data", JSON.stringify({ token, user: mappedUser }));
      }

      toast.success("Account created! A verification code has been sent to your email.");
      setIsStepVerify(true);
    } catch (error: any) {
      const msg = (error?.message || "").toLowerCase();
      const looksLikeDuplicateEmail =
        msg.includes("taken") ||
        msg.includes("already taken") ||
        msg.includes("duplicate") ||
        msg.includes("exists");

      const looksLikeUnverifiedAccount =
        msg.includes("verify") ||
        msg.includes("verification") ||
        msg.includes("unverified") ||
        msg.includes("not verified") ||
        msg.includes("activate") ||
        msg.includes("activation");

      if (looksLikeDuplicateEmail && looksLikeUnverifiedAccount) {
        toast.error("Email already registered. Please verify your email to continue.");
        navigate(`/verify-email?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectTo)}&resend=true`);
        return;
      }

      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await api.post("user-resend-otp", { email });
      toast.success("A new verification code has been sent!");
      setCountdown(30);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const sessionData = await api.post("user-verify-otp", { email, otp });

      const token = sessionData?.access_token || sessionData?.data?.access_token || sessionData?.token;
      const userData = sessionData?.user || sessionData?.data?.user;

      if (token) {
        localStorage.setItem("access_token", token);
        if (userData) {
          const isOrganizer = sessionData.is_organizer || sessionData.data?.is_organizer || !!userData.organizer;
          const mappedUser = {
            ...userData,
            is_organizer: isOrganizer,
            user_metadata: {
              ...userData.user_metadata,
              display_name: userData.name || userData.user_metadata?.display_name || userData.email?.split("@")[0] || "User",
              full_name: userData.name || userData.user_metadata?.full_name || "User",
              is_organizer: isOrganizer,
            },
          };
          localStorage.setItem("user", JSON.stringify(mappedUser));

          if (userData.organizer) {
            const org = userData.organizer;
            localStorage.setItem("organizer_profile", JSON.stringify({
              name: org.name || "",
              bio: org.bio || "",
              logo: org.logo || null,
              address: org.address || "",
              state: org.state?.name || "",
              city: org.city?.name || "",
            }));
          }
        }
        sessionStorage.removeItem("temp_signup_data");
      } else {
        // Verification succeeded but no token returned — use the temp data from registration
        const tempSignupDataStr = sessionStorage.getItem("temp_signup_data");
        if (tempSignupDataStr) {
          const tempSignupData = JSON.parse(tempSignupDataStr);
          if (tempSignupData.token && tempSignupData.user) {
            localStorage.setItem("access_token", tempSignupData.token);
            localStorage.setItem("user", JSON.stringify(tempSignupData.user));
            sessionStorage.removeItem("temp_signup_data");
          } else {
            toast.error("Verification succeeded but no session was found. Please log in.");
            navigate("/login");
            return;
          }
        } else {
          toast.error("Verification succeeded but no session was found. Please log in.");
          navigate("/login");
          return;
        }
      }

      setVerified(true);
      toast.success("Email verified successfully!");
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Verification failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          to={isStepVerify ? "#" : "/"}
          onClick={(e) => {
            if (isStepVerify) {
              e.preventDefault();
              setIsStepVerify(false);
              setOtp("");
            }
          }}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isStepVerify ? "Back to Sign Up" : "Back to Home"}
        </Link>
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Ticket className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Even<span className="text-gradient">tly</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[2px] gradient-primary opacity-80" />

          <AnimatePresence mode="wait">
            {!isStepVerify ? (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-display font-bold text-foreground text-center mb-2">
                  Create Account
                </h1>
                <p className="text-muted-foreground text-center text-sm mb-6">
                  Join Evently to explore and create events
                </p>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-border/50 bg-secondary px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-secondary/80"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs text-muted-foreground">or continue with email</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10 bg-secondary border-border/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary border-border/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-secondary border-border/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-secondary border-border/50"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 bg-secondary border-border/50"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-primary text-primary-foreground shadow-glow h-11 rounded-xl font-medium"
                  >
                    {loading ? "Please wait..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to={redirectTo !== "/" ? `/login?redirect=${redirectTo}` : "/login"}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            ) : !verified ? (
              <motion.div
                key="verify-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary animate-pulse">
                  <Mail className="h-8 w-8" />
                </div>

                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground text-sm mb-6 max-w-[280px]">
                  We have sent a 6-digit verification code to{" "}
                  <span className="text-foreground font-medium underline break-all">{email || "your email"}</span>
                </p>

                <form onSubmit={handleVerify} className="w-full space-y-6 flex flex-col items-center">
                  <div className="space-y-2 flex flex-col items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Enter 6-Digit OTP
                    </label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      disabled={loading}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-14 text-xl font-bold font-mono rounded-xl bg-secondary border border-border/60 text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary/80"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full h-11 gradient-primary text-primary-foreground font-medium shadow-glow flex items-center justify-center gap-2 rounded-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Verifying code...
                      </>
                    ) : (
                      "Verify & Activate"
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <span>Didn't receive the email?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || countdown > 0}
                    className="text-primary hover:underline font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:hover:no-underline transition-colors"
                  >
                    {countdown > 0 ? (
                      `Resend code in ${countdown}s`
                    ) : resending ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      "Resend Code"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsStepVerify(false);
                      setOtp("");
                    }}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                  >
                    Back to edit details
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="verify-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-4"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>

                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  Verification Successful!
                </h1>
                <p className="text-muted-foreground text-sm max-w-[280px]">
                  Your account has been fully activated. Preparing your Evently experience...
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                  <span>Redirecting...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
