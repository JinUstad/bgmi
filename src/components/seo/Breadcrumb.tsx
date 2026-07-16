import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema, BreadcrumbItem } from "@/lib/seo/schemas";
import { buildUrl } from "@/lib/seo/config";

interface BreadcrumbProps {
  /** Array of breadcrumb items. Home is automatically prepended. */
  items: BreadcrumbItem[];
  /** Additional class names for the nav wrapper */
  className?: string;
}

/**
 * Breadcrumb Component
 *
 * Renders a visual breadcrumb trail AND injects BreadcrumbList JSON-LD
 * automatically. Use this in Server Components on any page with a hierarchy.
 *
 * @example
 * <Breadcrumb items={[{ name: "Tournaments", url: "/tournaments" }]} />
 */
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Always prepend Home
  const allItems: BreadcrumbItem[] = [
    { name: "Home", url: "/" },
    ...items,
  ];

  return (
    <>
      {/* Inject JSON-LD BreadcrumbList */}
      <JsonLd schema={breadcrumbSchema(allItems)} id="breadcrumb" />

      {/* Visual breadcrumb nav */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm text-white/50 ${className}`}
      >
        <ol
          className="flex items-center gap-2 flex-wrap"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li
                key={item.url}
                className="flex items-center gap-2"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(index + 1)} />
                {isLast ? (
                  <span
                    className="text-pubg-yellow font-medium"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.url}
                      className="hover:text-white transition-colors"
                      itemProp="item"
                    >
                      <span itemProp="name">{item.name}</span>
                    </Link>
                    <span
                      aria-hidden="true"
                      className="text-white/30 select-none"
                    >
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
