import {ManagementPageHeader} from "@/components/management-page-header";
import {User} from "lucide-react";

export default function Page() {
    return (
        <div className="space-y-6 grow">
            <ManagementPageHeader
                iconNode={<User/>}
                title={"Mein Account"}
                description={"Bearbeite deine persönlichen Einstellungen"}
            />
        </div>

    )
}