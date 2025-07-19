"use client"

import {useUser} from "@/components/providers/user-provider";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const {user} = useUser()
  const router = useRouter()

  if (user) router.push("/login")

  return (
    <div className={'flex justify-center items-center grow'}>
      <Card>
        <CardContent>
          <CardTitle className={'w-full flex justify-center'}>
            Anmelden
          </CardTitle>
          <LoginForm/>
        </CardContent>
      </Card>
    </div>
  )
}
