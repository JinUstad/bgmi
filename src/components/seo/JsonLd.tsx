/**
 * JsonLd Component
 *
 * Injects a JSON-LD structured data script tag into the page.
 * Use this in Server Components to add schema markup.
 *
 * @example
 * import { JsonLd } from "@/components/seo/JsonLd";
 * import { organizationSchema } from "@/lib/seo/schemas";
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <JsonLd schema={organizationSchema()} />
 *       <main>...</main>
 *     </>
 *   );
 * }
 */

interface JsonLdProps {
  /** A single schema object or an array of schema objects */
  schema: Record<string, unknown> | Record<string, unknown>[];
  /** Optional id for the script tag (useful for testing) */
  id?: string;
}

export function JsonLd({ schema, id }: JsonLdProps) {
  const json = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {json.map((schemaItem, index) => (
        <script
          key={id ? `${id}-${index}` : index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}
    </>
  );
}
