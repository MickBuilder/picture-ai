'use client'

import React, { useId, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { signup } from '@/lib/actions/auth'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

const passwordValidationRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

const formSchema = z.object({
  full_name: z.string().min(3, {
    message: "Your name must be at least 3 characters long."
  }),
  email: z.string().email({
    message: "Please enter a valid email address!"
  }),
  password: z.string({required_error: 'Password is required!'}).min(8, {
    message: "Password must be at least 8 characters long.",
  }).regex(passwordValidationRegex, {
    message: 'Password must contain 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
  }),
  confirm_password: z.string({
    message: "Confirm password is required."
  })
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match.",
  path: ["confirm_password"]
});

const SignupForm = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const toastId = useId();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Creating account...", {
      id: toastId
    });
    setLoading(true);

    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    const response = await signup(formData);
    if (response.success) {
      toast.success("Account created successfully, please check your email for verification.", { id: toastId });
      setLoading(false);
      redirect("/auth");
    } else {
      console.log(response);
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
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' disabled={loading}>
            {loading && <Loader2 className='w-4 h-4 animate-spin' />}
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SignupForm;