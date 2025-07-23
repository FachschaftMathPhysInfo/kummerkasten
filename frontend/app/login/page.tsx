"use client"

import {useUser} from "@/components/providers/user-provider";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function LoginPage() {
  const {user} = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push("/tickets")
  }, [user, router])

  if(user) return null

  return (
    <div className={'flex justify-center items-center grow'}>
      <Card>
        <CardContent>
          <CardTitle className={'w-full flex justify-center'}>
            Anmelden
          </CardTitle>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
