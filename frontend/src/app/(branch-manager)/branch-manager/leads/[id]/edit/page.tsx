import { EditLeadPage } from "@/features/foundation/pages/edit-lead-page";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditLeadPage leadId={id} />;
}
