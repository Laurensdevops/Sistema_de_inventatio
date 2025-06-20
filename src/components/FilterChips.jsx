import React from "react";
import PropTypes from "prop-types";
import "./product-filters.css";        // usa los mismos estilos de chips

/**
 * Muestra una lista de chips (botones) reutilizables.
 *
 * @param {Array<string|{value,label}>} options lista de valores o pares {value,label}
 * @param {string[]}  value    array con los seleccionados
 * @param {function}  onToggle callback(recibe el value clicado)
 * @param {boolean}   colorMode true = pinta círculos de color (sin texto)
 */
export default function FilterChips({ options, value, onToggle, colorMode=false }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {options.map((opt) => {
        const key   = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const active = value.includes(key);

        const classes = [
          "pf-chip",
          colorMode ? `pf-chip--color-${key}` : "",
          active && "pf-chip--active",
        ].filter(Boolean).join(" ");

        return (
          <button
            key={key}
            type="button"
            className={classes}
            onClick={() => onToggle(key)}
            title={label}
          >
            {!colorMode && label.toString().toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

FilterChips.propTypes = {
  options:   PropTypes.array.isRequired,
  value:     PropTypes.array.isRequired,
  onToggle:  PropTypes.func.isRequired,
  colorMode: PropTypes.bool,
};
