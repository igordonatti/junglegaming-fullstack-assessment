import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login, register as registerApi } from '../api/auth'
import { useAuthStore } from '../contexts/auth-store'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
})

export default function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const [, setMode] = useState<'login' | 'register'>('login')

  const loginForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) })

  async function onSubmitLogin(values: z.infer<typeof loginSchema>) {
    const tokens = await login(values)
    setAuth(tokens)
    navigate({ to: '/tasks' })
  }

  async function onSubmitRegister(values: z.infer<typeof registerSchema>) {
    await registerApi(values)
    setMode('login')
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <section>
        <h2 className="text-lg font-medium mb-2">Login</h2>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-3">
          <input className="border px-3 py-2 w-full" placeholder="Email" {...loginForm.register('email')} />
          {loginForm.formState.errors.email && <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>}
          <input className="border px-3 py-2 w-full" placeholder="Senha" type="password" {...loginForm.register('password')} />
          {loginForm.formState.errors.password && <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>}
          <button className="bg-black text-white px-4 py-2 rounded" disabled={loginForm.formState.isSubmitting}>Entrar</button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Registrar</h2>
        <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-3">
          <input className="border px-3 py-2 w-full" placeholder="Email" {...registerForm.register('email')} />
          {registerForm.formState.errors.email && <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>}
          <input className="border px-3 py-2 w-full" placeholder="Username" {...registerForm.register('username')} />
          {registerForm.formState.errors.username && <p className="text-sm text-red-600">{registerForm.formState.errors.username.message}</p>}
          <input className="border px-3 py-2 w-full" placeholder="Senha" type="password" {...registerForm.register('password')} />
          {registerForm.formState.errors.password && <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>}
          <button className="bg-black text-white px-4 py-2 rounded" disabled={registerForm.formState.isSubmitting}>Cadastrar</button>
        </form>
      </section>

    </div>
  )
}


