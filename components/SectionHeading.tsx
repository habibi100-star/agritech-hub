// Judul bagian (h2) dengan garis aksen kecil dan deskripsi opsional.
// Input: id (untuk aria-labelledby), title (judul), description (opsional).
// Output: blok judul bagian.
export default function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <span
        aria-hidden="true"
        className="mb-3 block h-1 w-12 rounded-full bg-accent"
      />
      <h2 id={id} className="text-2xl font-bold sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}