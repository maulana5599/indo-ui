import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { Auth } from "../../types/auth.type";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import Api from "../../service/api";
import Swal from "sweetalert2";
import { useProfileStore, useRoleStore } from "../../context/GlobarContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [authPayload, setAuthPayload] = useState({
    email: "",
    password: "",
  } as Auth);
  const setProfile = useProfileStore((state: any) => state.setProfile);
  const setRole = useRoleStore((state: any) => state.setRole);
  
  const submitAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Api.post("/login", authPayload, {
      headers: {
        isSignin: true,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setProfile(res.data.profile);
          setRole(res.data.role);

          localStorage.setItem("token", res.data.access_token);

          Swal.fire({
            title: "Logged in!",
            text: "Welcome back to Our Site !",
            icon: "success",
            timer: 1300,
          }).then(() => {
            window.location.href = "/";
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.status !== 200) {
          const message = error.response.data.message;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
            confirmButtonText: "Close",
          });
        }
      });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={submitAuth}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    onChange={(e) =>
                      setAuthPayload({ ...authPayload, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={(e) =>
                        setAuthPayload({
                          ...authPayload,
                          password: e.target.value,
                        })
                      }
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
