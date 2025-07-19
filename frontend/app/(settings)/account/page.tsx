import {ManagementPageHeader} from "@/components/management-page-header";
import {User} from "lucide-react";

export default function Page() {
    return (
        <div className="space-y-6">
            <ManagementPageHeader
                iconNode={<User/>}
                title={"User"}
                description={"Bearbeite deine persönlichen Einstellungen"}
            />
        </div>

    )
}