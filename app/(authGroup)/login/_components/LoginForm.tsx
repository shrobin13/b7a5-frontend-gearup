'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginAction } from "../_actions/authActions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, {
    success: false,
    statusCode: 0,
    message: "",
    data: {
      accessToken: "",
      refreshToken: "",
    },
  });
  useEffect(() => {
    if (!state.success) return;

    if (state.success) {
      toast.success(state.message || "Login successful!");
    }

    if (!state.success) {
      toast.error(state.message || "Login Failed!");
    }
  }, [state]);

  return (
    <>
      <form action={action} className="space-y-4">
        <Card className="p-5 space-y-4">
          <Input name="email" type="email" placeholder="enter your email" required />
          <Input name="password" type="password" placeholder="enter your password" required />
          <Button type="submit">
            {
              pending ? "submitting..." : "login"
            }
          </Button>
        </Card>
      </form>
    </>
  )
}

export default LoginForm