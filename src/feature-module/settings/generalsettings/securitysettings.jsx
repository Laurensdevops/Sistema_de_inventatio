import { Box, ChevronUp, EyeOff, Mail, Phone, RotateCcw, Shield, Tool } from 'feather-icons-react/build/IconComponents'
import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { setToogleHeader } from '../../../core/redux/action';
import SettingsSideBar from '../settingssidebar';

const SecuritySettings = () => {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);

    const renderRefreshTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Refresh
        </Tooltip>
    );
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    )
    return (
        <div>
            <div className="page-wrapper">
                <div className="content settings-content">
                    <div className="page-header settings-pg-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Ajustes</h4>
                                <h6>Gestiona tu configuración en el portal</h6>
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
                            <li>
                                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>

                                    <Link
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        id="collapse-header"
                                        className={data ? "active" : ""}
                                        onClick={() => { dispatch(setToogleHeader(!data)) }}
                                    >
                                        <ChevronUp />
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
                                        <h4>Seguridad</h4>
                                    </div>
                                    <div className="security-settings">
                                        <ul>
                                            <li>
                                                <div className="security-type">
                                                    <span className="security-icon">
                                                        <EyeOff />
                                                    </span>
                                                    <div className="security-title">
                                                        <h5>Contraseña</h5>
                                                        <p>Última modificación 22 julio 2023, 10:30</p>
                                                    </div>
                                                </div>
                                                <div className="security-btn">
                                                    <Link to="#" className="btn btn-primary">
                                                        Cambiar contraseña
                                                    </Link>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="security-type">
                                                    <span className="security-icon">
                                                        <Shield />
                                                    </span>
                                                    <div className="security-title">
                                                        <h5>Google autentificacion</h5>
                                                        <p>Conectado a Google</p>
                                                    </div>
                                                </div>
                                                <div className="security-btn d-flex align-items-center">
                                                    <span className="badges-disconed">desconectado</span>
                                                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center ms-2">
                                                        <input
                                                            type="checkbox"
                                                            id="user4"
                                                            className="check"
                                                            defaultChecked="true"
                                                        />
                                                        <label htmlFor="user4" className="checktoggle">
                                                            {" "}
                                                        </label>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="security-type">
                                                    <span className="security-icon">
                                                        <Phone />
                                                    </span>
                                                    <div className="security-title">
                                                        <h5>Verificación del número de teléfono</h5>
                                                        <p>Número de móvil verificado: +00000000000</p>
                                                    </div>
                                                </div>
                                                <div className="security-btn d-flex align-items-center">
                                                    <span>
                                                        <i className=" fa fa-check-circle me-2" />
                                                    </span>
                                                    <Link to="#" className="btn btn-primary">
                                                        Cambiar
                                                    </Link>
                                                    <Link to="#" className="remove-red ms-2">
                                                        Remover
                                                    </Link>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="security-type">
                                                    <span className="security-icon">
                                                        <Mail />
                                                    </span>
                                                    <div className="security-title">
                                                        <h5>Verificación del correo electrónico</h5>
                                                        <p>Correo electrónico verificado: laurens@example.com</p>
                                                    </div>
                                                </div>
                                                <div className="security-btn d-flex align-items-center">
                                                    <span>
                                                        <i className=" fa fa-check-circle me-2" />
                                                    </span>
                                                    <Link to="#" className="btn btn-primary">
                                                        Cambiar
                                                    </Link>
                                                    <Link to="#" className="remove-red ms-2">
                                                        Remover
                                                    </Link>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="security-type">
                                                    <span className="security-icon">
                                                        <Tool />
                                                    </span>
                                                    <div className="security-title">
                                                        <h5>Gestión de dispositivos</h5>
                                                        <p>Última modificación 22 julio 2023, 10:30</p>
                                                    </div>
                                                </div>
                                                <div className="security-btn d-flex align-items-center">
                                                    <Link to="#" className="manage-btn">
                                                        Gestionar
                                                    </Link>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="security-type">
                                                    <span className="security-icon">
                                                        <Box />
                                                    </span>
                                                    <div className="security-title">
                                                        <h5>Actividad de la cuenta</h5>
                                                        <p>Último cambio 25 julio 2023, 11:00</p>
                                                    </div>
                                                </div>
                                                <div className="security-btn d-flex align-items-center">
                                                    <Link to="#" className="manage-btn">
                                                        Ver
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecuritySettings
