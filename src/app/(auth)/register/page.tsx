"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { useRegister } from "@/lib/query/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: registerUser, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerUser(values);
  }

  return (
    <div className="w-full px-4 sm:px-10">
      {/* Brand & Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Image src="/icons/Logo-1.png" alt="Foody Logo" width={32} height={32} className="object-contain" />
          <span className="font-black text-2xl tracking-tight text-slate-900">Foody</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-[28px] font-black tracking-tight text-slate-900">Join Us</h1>
          <p className="text-sm font-medium text-slate-600">
            Create an account to start ordering!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
        <Link href="/login" className="w-1/2 flex items-center justify-center py-2.5 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors">
          Sign in
        </Link>
        <div className="w-1/2 flex items-center justify-center py-2.5 bg-white text-slate-900 font-bold text-sm rounded-xl shadow-sm cursor-default">
          Sign up
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-1.5">
                <FormControl>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Full Name"
                    disabled={isPending}
                    className={`h-12 rounded-xl text-sm px-4 bg-white ${
                      fieldState.error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-slate-400"
                    }`}
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-xs font-bold text-red-500 ml-1">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-1.5">
                <FormControl>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Email Address"
                    autoComplete="email"
                    disabled={isPending}
                    className={`h-12 rounded-xl text-sm px-4 bg-white ${
                      fieldState.error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-slate-400"
                    }`}
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-xs font-bold text-red-500 ml-1">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-1.5">
                <FormControl>
                  <Input
                    id="register-phone"
                    type="text"
                    placeholder="Phone Number (e.g. 0812...)"
                    disabled={isPending}
                    className={`h-12 rounded-xl text-sm px-4 bg-white ${
                      fieldState.error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-slate-400"
                    }`}
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-xs font-bold text-red-500 ml-1">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-1.5">
                <FormControl>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (Min. 6 chars)"
                      autoComplete="new-password"
                      disabled={isPending}
                      className={`h-12 rounded-xl text-sm px-4 pr-10 bg-white ${
                        fieldState.error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-slate-400"
                      }`}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {fieldState.error && (
                  <p className="text-xs font-bold text-red-500 ml-1">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-1.5">
                <FormControl>
                  <div className="relative">
                    <Input
                      id="register-confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      disabled={isPending}
                      className={`h-12 rounded-xl text-sm px-4 pr-10 bg-white ${
                        fieldState.error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-slate-400"
                      }`}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {fieldState.error && (
                  <p className="text-xs font-bold text-red-500 ml-1">{fieldState.error.message}</p>
                )}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            id="register-submit"
            type="submit"
            className="w-full bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold h-12 rounded-full mt-4 transition-colors shadow-md shadow-red-100"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
