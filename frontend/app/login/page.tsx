"use client"

import {useUser} from "@/components/providers/user-provider";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Lock, LogOut} from "lucide-react";

export default function LoginPage() {
  const {user, logout} = useUser()
  const router = useRouter()

  return (
    <div className={'flex justify-center items-center grow'}>
      <Card>
        <CardContent>
          <CardTitle className={'w-full flex justify-center'}>
            Anmelden
          </CardTitle>
          {!user ? (
            <LoginForm/>
          ) : (
            <div className={'flex flex-col justify-between gap-5'}>
              <p>Du bist schon angemeldet als {user.firstname} {user.lastname}</p>
              <div className={'w-full flex justify-between items-center gap-8'}>
                <Button onClick={() => logout()} variant={"destructive"}>
                  <LogOut className={'inline mr-2'}/>
                  Abmelden
                </Button>

                <Button onClick={() => router.push("/tickets")}>
                  Weiter
                </Button>
              </div>

            </div>

          )}
        </CardContent>
      </Card>
    </div>
  )
}
