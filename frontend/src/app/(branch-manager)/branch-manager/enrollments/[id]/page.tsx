import EnrollmentDetailsPage from "@/features/enrollments/EnrollmentDetailsPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EnrollmentDetailsPage id={id} />;
}
