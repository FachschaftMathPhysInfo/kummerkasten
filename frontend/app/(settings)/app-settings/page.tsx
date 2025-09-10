import {ManagementPageHeader} from "@/components/management-page-header";
import {SlidersVertical} from "lucide-react";
import FooterForm from "@/app/(settings)/app-settings/footer-form";

export default function Page() {
  return (
    <div className="w-full h-full flex-col grow">
      <ManagementPageHeader
        icon={<SlidersVertical/>}
        title="App Einstellungen"
        description="Bearbeite hier generelle App Einstellungen"
      />

      <div className={'w-full flex flex-col grow gap-y-6 items-center px-4 md:px-10 mt-6'}>
        <FooterForm/>
      </div>
    </div>
  );
}
