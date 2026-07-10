import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login, register } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setAuth(data.data.token, data.data.user);
      toast.success("Login berhasil! Selamat datang kembali 👋");
      router.push("/");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Login gagal. Coba lagi.";
      toast.error(message);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      setAuth(data.data.token, data.data.user);
      toast.success("Registrasi berhasil! Selamat datang 🎉");
      router.push("/");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message ?? "Registrasi gagal. Coba lagi.";
      toast.error(message);
    },
  });
}
