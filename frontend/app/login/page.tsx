"use client"

import {useUser} from "@/components/providers/user-provider";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";

export default function LoginPage() {
  const {user, login, logout} = useUser()

  return (
    <div className={'flex justify-center items-center grow'}>
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}