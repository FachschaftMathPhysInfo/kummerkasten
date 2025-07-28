"use client"

import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";


export default function LoginPage() {

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
