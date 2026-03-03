"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validation";
import { z } from "zod";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof signupSchema>;
export function SignupForm() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(signupSchema), defaultValues: { role: "USER" } });
  const router = useRouter();
  return <form className="card space-y-3" onSubmit={handleSubmit(async (v) => { await api.post('/auth/signup', v); router.push('/login'); })}><input className="w-full rounded border p-2" placeholder="Name" {...register("name")} /><input className="w-full rounded border p-2" placeholder="Email" {...register("email")} /><input className="w-full rounded border p-2" type="password" placeholder="Password" {...register("password")} /><select className="w-full rounded border p-2" {...register("role")}><option value="USER">User</option><option value="COUNSELLOR">Counsellor</option></select><button className="rounded bg-primary text-white px-4 py-2">Sign up</button></form>;
}
