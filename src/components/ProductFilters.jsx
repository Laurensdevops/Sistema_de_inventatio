import React from "react";
import PropTypes from "prop-types";
import "./product-filters.css";
import FilterChips from "./FilterChips";

/* listas de valores ---------------------------------------------*/
const COLORS = [
  { value: "red",   label: "Rojo"   },
  { value: "blue",  label: "Azul"   },
  { value: "black", label: "Negro"  },
  { value: "white", label: "Blanco" },
];

const CLOTH_SIZES = ["xs", "s", "m", "l", "xl", "xxl"];
const SHOE_SIZES  = ["34","35","36","37","38","39","40","41","42","43","44","45"];

/* valores por defecto – evita “undefined.colors” -----------------*/
const defaultFilters = {
  colors:     [],
  sizes:      [],
  shoeSizes:  [],
  inStockOnly:false,
  priceMin:   null,
  priceMax:   null,
  categoryId: null,
};

export default function ProductFilters({ filters = defaultFilters, onChange }) {
  /* helper para actualizar de forma parcial ----------------------*/
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <section className="pf-card shadow-sm mb-4">
      {/* encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filtros</h5>
        <button
          className="btn btn-link p-0 small text-decoration-none"
          onClick={() => onChange(defaultFilters)}
        >
          Limpiar todo
        </button>
      </div>

      {/* ------- Colores ------- */}
      <div className="pf-block mb-3">
        <span className="pf-label">Color:</span>
        <FilterChips
          options={COLORS}
          value={filters.colors}
          onToggle={(val) =>
            update({
              colors: filters.colors.includes(val)
                ? filters.colors.filter((c) => c !== val)
                : [...filters.colors, val],
            })
          }
          colorMode          /* pinta círculos de color */
        />
      </div>

      {/* ------- Tallas (ropa) ------- */}
      <div className="pf-block mb-3">
        <span className="pf-label">Talla ropa:</span>
        <FilterChips
          options={CLOTH_SIZES}
          value={filters.sizes}
          onToggle={(val) =>
            update({
              sizes: filters.sizes.includes(val)
                ? filters.sizes.filter((x) => x !== val)
                : [...filters.sizes, val],
            })
          }
        />
      </div>

      {/* ------- Tallas (calzado) ------- */}
      <div className="pf-block mb-3">
        <span className="pf-label">Talla calzado:</span>
        <FilterChips
          options={SHOE_SIZES}
          value={filters.shoeSizes}
          onToggle={(val) =>
            update({
              shoeSizes: filters.shoeSizes.includes(val)
                ? filters.shoeSizes.filter((x) => x !== val)
                : [...filters.shoeSizes, val],
            })
          }
        />
      </div>

      {/* ------- Solo stock ------- */}
      <div className="pf-block d-flex align-items-center gap-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="pf-stock"
          checked={filters.inStockOnly}
          onChange={() => update({ inStockOnly: !filters.inStockOnly })}
        />
        <label htmlFor="pf-stock" className="form-check-label">
          Solo con stock
        </label>
      </div>
    </section>
  );
}

ProductFilters.propTypes = {
  filters: PropTypes.shape({
    colors:     PropTypes.array,
    sizes:      PropTypes.array,
    shoeSizes:  PropTypes.array,
    inStockOnly:PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
};
