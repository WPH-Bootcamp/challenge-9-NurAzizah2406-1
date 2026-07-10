"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useLogin } from "@/lib/query/auth";

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    login(values);
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
          <h1 className="text-[28px] font-black tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-sm font-medium text-slate-600">
            Good to see you again! Let's eat
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
        <div className="w-1/2 flex items-center justify-center py-2.5 bg-white text-slate-900 font-bold text-sm rounded-xl shadow-sm cursor-default">
          Sign in
        </div>
        <Link href="/register" className="w-1/2 flex items-center justify-center py-2.5 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors">
          Sign up
        </Link>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-1.5">
                <FormControl>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    disabled={isPending}
                    className={`h-12 rounded-xl text-sm px-4 bg-white ${
                      fieldState.error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-slate-400"
                    }`}
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-xs font-bold text-red-500 ml-1">Error Text Helper</p>
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
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="current-password"
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
                  <p className="text-xs font-bold text-red-500 ml-1">Error Text Helper</p>
                )}
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <div className="flex items-center gap-2.5 pt-1">
            <Checkbox 
              id="remember" 
              checked={rememberMe} 
              onCheckedChange={(c) => setRememberMe(c as boolean)}
              className="w-4 h-4 rounded border-slate-300 data-[state=checked]:bg-[#C12116] data-[state=checked]:text-white data-[state=checked]:border-[#C12116]"
            />
            <label htmlFor="remember" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <Button
            id="login-submit"
            type="submit"
            className="w-full bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold h-12 rounded-full mt-2 transition-colors shadow-md shadow-red-100"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
