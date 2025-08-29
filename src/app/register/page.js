"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Yup schema
const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "One uppercase letter required")
    .matches(/[a-z]/, "One lowercase letter required")
    .matches(/\d/, "One number required")
    .matches(/[@$!%*?&#^._-]/, "One special character required")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the Terms & Conditions"),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onBlur", // validate on blur; change to "onChange" for live feedback
  });

  const onSubmit = async (data) => {
    // Do not send confirmPassword/terms if your API doesn't need them
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      terms: data.terms,
    };

    console.log("Register payload:", payload);
    // Example:
    // const res = await fetch("/api/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // if (res.ok) reset();
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "450px" }}>
        <h3 className="text-center mb-4">Register</h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              {...register("name")}
            />
            <div className="invalid-feedback">{errors.name?.message}</div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email")}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              autoComplete="new-password"
              {...register("password")}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
            <div className="form-text">
              Use at least 8 chars incl. uppercase, lowercase, number, special.
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter Password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
          </div>

          {/* Terms */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="terms"
              className={`form-check-input ${errors.terms ? "is-invalid" : ""}`}
              {...register("terms")}
            />
            <label className="form-check-label" htmlFor="terms">
              I agree to the <a href="/terms">Terms & Conditions</a>
            </label>
            <div className="invalid-feedback d-block">{errors.terms?.message}</div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link href="/login" className="link-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
