import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { CustomerTypeRequest } from "../../types/customer.type";
import Api from "../../service/api";
import Swal from "sweetalert2";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName , setLastName] = useState<string>("");
  const [payloadCustomer, setPayloadCustomer] = useState<CustomerTypeRequest>(
    {} as CustomerTypeRequest
  );

  const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = `${firstName} ${lastName}`;
    const newPayload = {
      email: payloadCustomer.email,
      name: name,
      password: payloadCustomer.password,
      no_telp: payloadCustomer.no_telp,
      alamat: payloadCustomer.address,
      tempat_lahir: payloadCustomer.place_of_birth,
      tanggal_lahir: payloadCustomer.birth_date,
    };

    console.log(newPayload);
    Api.post("/register", newPayload)
      .then((res: any) => {
        console.log(res);
        if (res.status === 200) {
          setPayloadCustomer({
            email: "",
            name: "",
            password: "",
            no_telp: "",
            address: "",
            place_of_birth: "",
            birth_date: "",
          });

          Swal.fire({
            title: "Success!",
            text: "Registration Success.",
            icon: "success",
          });
        }
      })
      .catch((error: any) => {
        if (error.status !== 200) {
          const message = error.response.data.message;
          if (error.response.status === 400) {
            let firstError: any = "";
            if (typeof message !== "string") {
              firstError = Object.keys(message)[0];
              firstError = `${firstError}: ${message[firstError]}`;
            } else {
              firstError = message;
            }

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `${firstError}`,
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: message,
              confirmButtonText: "Close",
            });
          }
        }
      });
  };
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={registerUser}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={(e) => {
                      setPayloadCustomer({
                        ...payloadCustomer,
                        email: e.target.value,
                      });
                    }}
                    />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => {
                        setPayloadCustomer({
                          ...payloadCustomer,
                          password: e.target.value,
                        });
                      }}
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
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <Label>
                      Place of Birth<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your place of birth"
                        type="text"
                        onChange={(e: any) => setPayloadCustomer({...payloadCustomer, place_of_birth: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>
                      Birth Date<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your place of birth"
                        type="date"
                        onChange={(e: any) => setPayloadCustomer({...payloadCustomer, birth_date: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
