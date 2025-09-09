import {ManagementPageHeader} from "@/components/management-page-header";
import {ExternalLink, SlidersVertical} from "lucide-react";
import FooterForm from "@/app/(settings)/app-settings/footer-form";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="w-full h-full">
      <ManagementPageHeader
        icon={<SlidersVertical/>}
        title="App Einstellungen"
        description="Bearbeite hier generelle App Einstellungen"
      />
      <div className={'w-full flex flex-col gap-y-12 items-center p-12'}>
        <Card className={'w-full'}>
          <CardHeader className={'flex items-center gap-2'}>
            <ExternalLink/> Footer
          </CardHeader>
          <CardContent>
            <FooterForm/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
