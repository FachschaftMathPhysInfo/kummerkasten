"use client"

import {Card, CardContent, CardTitle} from "@/components/ui/card";
import LoginForm from "@/app/login/login-form";
import {useTranslations} from "next-intl";


export default function LoginPage() {
  const t = useTranslations("LoginPage");

  return (
    <div className={'flex justify-center items-center grow'}>
      <Card>
        <CardContent>
          <CardTitle className={'w-full flex justify-center'}>
            {t("header")}
          </CardTitle>
          <LoginForm/>
        </CardContent>
      </Card>
    </div>
  )
}
