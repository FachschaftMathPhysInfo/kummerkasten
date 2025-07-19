"use client"

import {useUser} from "@/components/providers/user-provider";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function LoginPage() {
  const {user} = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) router.push("/tickets")
  }, [user, router])

  if(loading || user) return null

  return (
    <div className={'flex justify-center items-center grow'}>
      <Card>
        <CardContent>
          <CardTitle className={'w-full flex justify-center'}>
            Anmelden
          </CardTitle>
          <LoginForm setLoading={setLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
