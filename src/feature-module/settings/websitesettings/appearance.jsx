import {  RotateCcw } from "feather-icons-react/build/IconComponents";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import SettingsSideBar from "../settingssidebar";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";

const Appearance = () => {
  const [isActive, setIsActive] = useState(null);

  const setActive = (theme) => {
    setIsActive(theme);
  };

  const sizeOptions = [
    { value: "Hozizontal", label: "Hozizontal" },
    { value: "Vertical", label: "Vertical" },
  ];
  const fonts = [
    { value: "Nunito", label: "Nunito" },
    { value: "Poppins", label: "Poppins" },
  ];

  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  return (
    <div>
      <div className="page-wrapper">
        <div className="content settings-content">
          <div className="page-header settings-pg-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Ajustes</h4>
                <h6>Gestione su configuración en el portal</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="settings-wrapper d-flex">
                <SettingsSideBar />
                <div className="settings-page-wrap">
                  <div className="setting-title">
                    <h4>Apariencia</h4>
                  </div>
                  <div className="appearance-settings">
                    <div className="row">
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="setting-info mb-4">
                          <h6>Seleccione tema</h6>
                          <p>Elija el color de acento del sitio web</p>
                        </div>
                      </div>
                      <div className="col-xl-8 col-lg-12 col-md-8">
                        <div className="theme-type-images d-flex align-items-center mb-4">
                          <div
                            className={`theme-image ${
                              isActive === "Light" ? "active" : ""
                            }`}
                            onClick={() => setActive("Light")}
                          >
                            <div className="theme-image-set">
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-08.jpg"
                                alt="Light Theme"
                              />
                            </div>
                            <span>Claro</span>
                          </div>
                          <div
                            className={`theme-image ${
                              isActive === "Dark" ? "active" : ""
                            }`}
                            onClick={() => setActive("Dark")}
                          >
                            <div className="theme-image-set">
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-09.jpg"
                                alt="Dark Theme"
                              />
                            </div>
                            <span>Oscuro</span>
                          </div>
                          <div
                            className={`theme-image ${
                              isActive === "Automatic" ? "active" : ""
                            }`}
                            onClick={() => setActive("Automatic")}
                          >
                            <div className="theme-image-set">
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-10.jpg"
                                alt="Automatic Theme"
                              />
                            </div>
                            <span>Automatico</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="setting-info mb-4">
                          <h6>Eliga color principal</h6>
                          <p>Elegir el color de acento del sitio web</p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="theme-colors mb-4">
                          <ul>
                            <li>
                              <span
                                className={`themecolorset defaultcolor ${
                                  isActive === "defaultcolor" ? "active" : ""
                                }`}
                                onClick={() => setActive("defaultcolor")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-violet ${
                                  isActive === "theme-violet" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-violet")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-blue ${
                                  isActive === "theme-blue" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-blue")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-brown ${
                                  isActive === "theme-brown" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-brown")}
                              ></span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="setting-info mb-4">
                          <h6>Color secundario</h6>
                          <p>Elegir el color de acento del sitio web</p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="theme-colors mb-4">
                          <ul>
                            <li>
                              <span
                                className={`themecolorset defaultcolor ${
                                  isActive === "defaultcolor" ? "active" : ""
                                }`}
                                onClick={() => setActive("defaultcolor")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-violet ${
                                  isActive === "theme-violet" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-violet")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-blue ${
                                  isActive === "theme-blue" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-blue")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-brown ${
                                  isActive === "theme-brown" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-brown")}
                              ></span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="setting-info mb-4">
                          <h6>Tipo de menu</h6>
                          <p>Seleccione la horientacion del menu</p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="localization-select">
                          <Select
                            options={sizeOptions}
                            classNamePrefix="react-select"
                            placeholder="Seleccionar..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="setting-info mb-4">
                          <h6>Familia de fuentes</h6>
                          <p>Seleccione la familia de fuentes del sitio web</p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-12 col-md-4">
                        <div className="localization-select">
                          <Select
                            options={fonts}
                            classNamePrefix="react-select"
                            placeholder="Select Size"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
