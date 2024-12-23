import { ChevronUp, RotateCcw } from 'feather-icons-react/build/IconComponents';
import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { setToogleHeader } from '../../../core/redux/action';
import SettingsSideBar from '../settingssidebar';

const Preference = () => {

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
                                <SettingsSideBar/>
                                <div className="settings-page-wrap">
                                    <div className="setting-title">
                                        <h4>Preferencia</h4>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                                            <div className="connected-app-card">
                                                <ul>
                                                    <li>
                                                        <div className="security-type">
                                                            <div className="security-title">
                                                                <h5>Modo mantenimiento</h5>
                                                            </div>
                                                        </div>
                                                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center ms-2">
                                                            <input
                                                                type="checkbox"
                                                                id="user1"
                                                                className="check"
                                                                defaultChecked="true"
                                                            />
                                                            <label htmlFor="user1" className="checktoggle">
                                                                {" "}
                                                            </label>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                                            <div className="connected-app-card">
                                                <ul>
                                                    <li>
                                                        <div className="security-type">
                                                            <div className="security-title">
                                                                <h5>Cupones</h5>
                                                            </div>
                                                        </div>
                                                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center ms-2">
                                                            <input
                                                                type="checkbox"
                                                                id="user2"
                                                                className="check"
                                                                defaultChecked="true"
                                                            />
                                                            <label htmlFor="user2" className="checktoggle">
                                                                {" "}
                                                            </label>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                                            <div className="connected-app-card">
                                                <ul>
                                                    <li>
                                                        <div className="security-type">
                                                            <div className="security-title">
                                                                <h5>Ofertas</h5>
                                                            </div>
                                                        </div>
                                                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center ms-2">
                                                            <input
                                                                type="checkbox"
                                                                id="user3"
                                                                className="check"
                                                                defaultChecked="true"
                                                            />
                                                            <label htmlFor="user3" className="checktoggle">
                                                                {" "}
                                                            </label>
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
            </div>
        </div>
    )
}

export default Preference
