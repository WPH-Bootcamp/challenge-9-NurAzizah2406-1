export default function RestaurantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Detail Restoran: {params.id}</h1>
      <p>Coming soon...</p>
    </div>
  );
}
