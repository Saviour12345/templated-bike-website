/**
 * Renders a JSON-LD <script>. Use in a Server Component (page or layout).
 * Pass a single schema object or an array (rendered as a @graph-friendly list).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe; we additionally escape "<" to avoid </script> breakouts.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}
