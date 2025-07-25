import {ManagementPageHeader} from "@/components/management-page-header";
import {LockKeyhole, SettingsIcon, User} from "lucide-react";
import {SettingsField} from "@/components/settings-field";
import {SettingsBlock} from "@/components/settings-block";

export default function Page() {
    return (
        <div className="space-y-6 grow">
            <ManagementPageHeader
                iconNode={<SettingsIcon/>}
                title={"Mein Account"}
                description={"Bearbeite deine persönlichen Einstellungen"}
            />
            <SettingsBlock icon={<User/>} title={"Account"}>
                <SettingsField title={"Vorname"} visibilityToggle={false} placeholder={"AHHHH"}/>
                <SettingsField title={"Nachname"} visibilityToggle={false} placeholder={"AHHHH"}/>
                <SettingsField title={"E-Mail"} visibilityToggle={false} placeholder={"AHHHH"}/>
            </SettingsBlock>

            <SettingsBlock icon={<LockKeyhole/>} title={"Passwort"}>
                <SettingsField title={"Altes Passwort"} visibilityToggle={true} placeholder={"Altes Passwort"}/>
                <SettingsField title={"Neues Passwort"} visibilityToggle={true} placeholder={"Neues Passwort"}/>
                <SettingsField visibilityToggle={true} placeholder={"Neues Passwort bestätigen"}/>
            </SettingsBlock>
        </div>


    )
}