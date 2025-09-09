import {ManagementPageHeader} from "@/components/management-page-header";
import {SlidersVertical} from "lucide-react";
import FooterForm from "@/app/(settings)/app-settings/footer-form";

export default function Page() {
  return (
    <div className="w-full h-full">
      <ManagementPageHeader
        icon={<SlidersVertical/>}
        title="App Einstellungen"
        description="Bearbeite hier generelle App Einstellungen"
      />

      <div className={'w-full flex flex-col gap-y-12 items-center p-12'}>
        <FooterForm/>
      </div>
    </div>
  );
}
