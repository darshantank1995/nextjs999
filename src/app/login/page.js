"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser,abc  } from "../../../slices/authSlice";

const schema = yup.object().shape({
  email: yup.string().required("Email/Username is required"),
  password: yup.string().required("Password is required"),
  remember: yup.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, success, user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    // await dispatch(abc());

    if (loginUser.fulfilled.match(result)) {
      setTimeout(() => router.push("/dashboard"), 400);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {/* API message */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && user && (
          <div className="alert alert-success">
            Welcome back, {user.firstName}! 🎉
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="e.g. emilys or name@example.com"
              {...register("email")}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              {...register("password")}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="remember"
              className="form-check-input"
              {...register("remember")}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <Link href="/register" className="link-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
