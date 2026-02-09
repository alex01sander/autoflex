// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const linkClass =
  "block px-4 py-2 rounded hover:bg-blue-100 text-slate-700";

const activeClass =
  "bg-blue-600 text-white hover:bg-blue-600";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h1 className="text-xl font-semibold text-blue-600 mb-6">
        AutoFlex
      </h1>

      <nav className="space-y-2">
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Produtos
        </NavLink>

        <NavLink
          to="/raw-materials"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Matérias-primas
        </NavLink>

        <NavLink
          to="/product-materials"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Composição do Produto
        </NavLink>

        <NavLink
          to="/production"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Produção
        </NavLink>
      </nav>
    </aside>
  );
}
