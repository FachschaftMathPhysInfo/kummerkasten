"use client";

import {ManagementPageHeader} from "@/components/management-page-header";
import {SettingsIcon} from "lucide-react";
import AccountDataForm from "@/app/(settings)/account/profile-data-form";
import PasswordDataForm from "@/app/(settings)/account/password-form";

export default function Page() {
    return (
        <div className="space-y-6 grow">
            <ManagementPageHeader
                icon={<SettingsIcon/>}
                title="Mein Account"
                description="Bearbeite deine persönlichen Einstellungen"
            />
            <AccountDataForm/>
            <PasswordDataForm/>
        </div>
    );
}
