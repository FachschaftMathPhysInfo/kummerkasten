"use client"

import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";
import {useState} from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);

  if(loading) return null

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
