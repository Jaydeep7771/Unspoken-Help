"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { z } from "zod";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof loginSchema>;
export function LoginForm() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(loginSchema) });
  const router = useRouter();
  return <form className="card space-y-3" onSubmit={handleSubmit(async (v) => { await api.post('/auth/login', v); router.push('/dashboard/user/wallet'); })}><input className="w-full rounded border p-2" placeholder="Email" {...register("email")} /><input className="w-full rounded border p-2" type="password" placeholder="Password" {...register("password")} /><button className="rounded bg-primary text-white px-4 py-2">Login</button></form>;
}
