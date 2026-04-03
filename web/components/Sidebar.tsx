import Link from "next/link";
import { Category } from "@/lib/types";

export default function Sidebar({
  categories,
  activeCategorySlug,
}: {
  categories: Category[];
  activeCategorySlug?: string;
}) {
  // Группируем категории: только родительские (parent_category === null)
  const parentCategories = categories.filter(
    (c) => c.parent_category === null || c.parent_category === undefined
  );

  // Подсвечивать родительскую категорию только когда выбрана именно она
  const isParentActive = (parent: Category) => {
    return activeCategorySlug === parent.category_slug;
  };

  return (
    <aside
      style={{
        border: "1px solid var(--border-color)",
        width: 344,
        borderRadius: 5,
        padding: "20px 20px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: "fit-content",
        boxSizing: "border-box",
      }}
    >
      {/* лишнее дублирование ссылки на каталог 
      <Link
        href="/catalog"
        style={{
          fontSize: 22,
          fontWeight: 600,
          margin: 0,
          color:
            !activeCategorySlug
              ? "var(--accent-hover-color)"
              : "var(--text-color)",
        }}
      >
        Весь каталог
      </Link> */}
      {parentCategories.map((parent) => (
        <div key={parent.id}>
          <Link
            href={`/catalog/${parent.category_slug}`}
            style={{
              fontSize: 22,
              fontWeight: 600,
              margin: 0,
              display: "block",
              marginBottom: 8,
              color: isParentActive(parent)
                ? "var(--accent-hover-color)"
                : "var(--text-color)",
            }}
          >
            {parent.category_title}
          </Link>
          {parent.children_categories && parent.children_categories.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                paddingLeft: 30,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[...parent.children_categories].sort((a, b) => a.category_slug.localeCompare(b.category_slug)).map((child) => (
                <li key={child.id}>
                  <Link
                    href={`/catalog/${child.category_slug}`}
                    style={{
                      color:
                        activeCategorySlug === child.category_slug
                          ? "var(--accent-hover-color)"
                          : "var(--text-color)",
                    }}
                  >
                    {child.category_title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <style>{`
        aside a:hover {
          color: var(--accent-hover-color) !important;
        }
        @media (max-width: 1366px) {
          aside {
            margin-left: 10px;
          }
        }
        @media (max-width: 768px) {
          aside {
            width: 100% !important;
            margin-left: 0;
          }
        }
        
      `}</style>
    </aside>
  );
}