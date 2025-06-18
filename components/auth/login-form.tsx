'use client'

import React, { useId, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { login } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address!"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long."
  }),
})

const LoginForm = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const toastId = useId();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Signing in...", {
      id: toastId
    });
    setLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const response = await login(formData);
    if (response.success) {
      toast.success("Signed in successfully", { id: toastId });
      redirect("/dashboard");
    } else {
      toast.error(String(response.error), { id: toastId });
      setLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> 
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' disabled={loading}>
            {loading && <Loader2 className='w-4 h-4 animate-spin' />}
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginForm