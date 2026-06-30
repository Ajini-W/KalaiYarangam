import RenewalDetailsPage from "@/features/renewals/RenewalDetailsPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RenewalDetailsPage id={id} />;
}
