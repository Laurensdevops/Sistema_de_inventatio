// src/feature-module/users/UsersList.jsx
import React, { useState, useEffect } from "react";
import {
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { PlusCircle, RotateCcw } from "feather-icons-react/build/IconComponents";
import { Sliders, Edit, Trash2 } from "react-feather";
import Select from "react-select";
import Table from "../../core/pagination/datatable";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Importa los servicios para usuarios
import { getUsers, deleteUser, createUser, updateUser } from "../../services/usersService";

// Opciones para provincias (según la configuración de tu colección)
const provincesOptions = [
  { label: "Distrito Nacional", value: "Distrito Nacional" },
  { label: "Santo Domingo Este", value: "Santo Domingo Este" },
  { label: "Santo Domingo Norte", value: "Santo Domingo Norte" },
  { label: "Santo Domingo Oeste", value: "Santo Domingo Oeste" },
  { label: "La Altagracia", value: "La Altagracia" },
  { label: "El Seibo", value: "El Seibo" },
  { label: "Hato Mayor", value: "Hato Mayor" },
  { label: "La Romana", value: "La Romana" },
  { label: "Puerto Plata", value: "Puerto Plata" },
  { label: "Santiago", value: "Santiago" },
  { label: "Duarte", value: "Duarte" },
  { label: "Samaná", value: "Samaná" },
  { label: "La Vega", value: "La Vega" },
  { label: "María Trinidad Sánchez", value: "María Trinidad Sánchez" },
  { label: "Santiago Rodríguez", value: "Santiago Rodríguez" },
  { label: "Barahona", value: "Barahona" },
  { label: "San Juan", value: "San Juan" },
  { label: "Bahoruco", value: "Bahoruco" },
  { label: "Peravia", value: "Peravia" },
  { label: "Azua", value: "Azua" },
  { label: "San Cristóbal", value: "San Cristóbal" },
  { label: "Monte Plata", value: "Monte Plata" },
  { label: "Valverde", value: "Valverde" },
  { label: "Sánchez Ramírez", value: "Sánchez Ramírez" },
  { label: "Monseñor Nouel", value: "Monseñor Nouel" },
  { label: "Hermanas Mirabal", value: "Hermanas Mirabal" },
];

// Opciones para rol
const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Gerente", value: "manager" },
  { label: "Vendedor", value: "seller" },
  { label: "Mensajero", value: "courier" },
];

// Opciones para ordenar la tabla
const sortOptions = [
  { value: "role", label: "Ordenar por rol" },
  { value: "province", label: "Ordenar por provincia" },
];

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el modal de creación/edición de usuario
  const [showModal, setShowModal] = useState(false);
  // Si editingUser es null, se está creando; si tiene valor, se está editando ese usuario
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    province: "",
    role: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const MySwal = withReactContent(Swal);

  // Función para cargar usuarios
  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Función para eliminar usuario con confirmación
  const handleDeleteUser = (user) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user.id || user._id);
          MySwal.fire({
            title: "Eliminado!",
            text: "El usuario ha sido eliminado.",
            icon: "success",
            confirmButtonText: "OK",
          });
          loadUsers();
        } catch (error) {
          MySwal.fire({
            title: "Error!",
            text: "No se pudo eliminar el usuario.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  // Función para manejar los cambios en el formulario del modal
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Función para abrir el modal en modo edición y pre-cargar los datos
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      password: "", // Las contraseñas no se muestran ni se editan directamente
      confirmPassword: "",
      province: user.province,
      role: user.role,
    });
    setShowModal(true);
  };

  // Función para crear o actualizar un usuario al enviar el formulario
  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    // Validaciones
    if (
      !newUser.email ||
      (!editingUser && (!newUser.password || !newUser.confirmPassword)) ||
      !newUser.province ||
      !newUser.role
    ) {
      setModalError("Todos los campos son obligatorios.");
      return;
    }
    if (!editingUser && newUser.password !== newUser.confirmPassword) {
      setModalError("Las contraseñas no coinciden.");
      return;
    }
    setModalError("");
    setModalLoading(true);
    try {
      if (editingUser) {
        // Actualizar usuario (no se envía la contraseña si no se modificó)
        const updateData = { ...newUser };
        // Si la contraseña está vacía, la eliminamos del objeto para no actualizarla
        if (!updateData.password) {
          delete updateData.password;
          delete updateData.confirmPassword;
        }
        await updateUser(editingUser.id || editingUser._id, updateData);
        MySwal.fire({
          title: "Actualizado!",
          text: "El usuario ha sido actualizado.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        await createUser(newUser);
        MySwal.fire({
          title: "Creado!",
          text: "El usuario ha sido creado.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      setShowModal(false);
      loadUsers();
      setNewUser({
        email: "",
        password: "",
        confirmPassword: "",
        province: "",
        role: "",
      });
      setEditingUser(null);
    } catch (error) {
      setModalError("Error al crear/actualizar el usuario.");
      console.error("Error:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Columnas de la tabla para mostrar usuarios
  const columns = [
    {
      title: "Correo",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Rol",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Provincia",
      dataIndex: "province",
      sorter: (a, b) => a.province.localeCompare(b.province),
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <button
              className="me-2 p-2 btn btn-link"
              onClick={() => handleEditUser(record)}
            >
              <Edit className="feather-edit" />
            </button>
            <button
              className="p-2 btn btn-link"
              onClick={() => handleDeleteUser(record)}
            >
              <Trash2 className="feather-trash-2" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Encabezado y Breadcrumbs (opcional) */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Usuarios</h4>
              <h6>Gestiona usuarios</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="refresh-tooltip">Refrescar</Tooltip>}
              >
                <button onClick={loadUsers} className="btn btn-link">
                  <RotateCcw />
                </button>
              </OverlayTrigger>
            </li>
            <li>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingUser(null);
                  setNewUser({
                    email: "",
                    password: "",
                    confirmPassword: "",
                    province: "",
                    role: "",
                  });
                  setShowModal(true);
                }}
              >
                <PlusCircle className="me-2" />
                Agregar Usuario
              </button>
            </li>
          </ul>
        </div>

        {/* Filtros y ordenamiento (opcional) */}
        <div className="table-top">
          <div className="search-set">
            <div className="search-input">
              <input
                type="text"
                placeholder="Buscar"
                className="form-control form-control-sm formsearch"
              />
              <button className="btn btn-searchset">
                <i data-feather="search" className="feather-search" />
              </button>
            </div>
          </div>
          <div className="form-sort stylewidth">
            <Sliders className="info-img" />
            <Select
              classNamePrefix="react-select"
              className="img-select"
              options={sortOptions}
              placeholder="Ordenar"
            />
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="card table-list-card">
          <div className="card-body">
            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <div className="table-responsive">
                <Table
                  className="table datanew"
                  columns={columns}
                  dataSource={users}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal para crear/editar un usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingUser ? "Editar Usuario" : "Crear Usuario"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateOrUpdateUser}>
              <Form.Group className="mb-3" controlId="userEmail">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleModalInputChange}
                  required
                />
              </Form.Group>
              {/* Solo en creación se solicitan las contraseñas */}
              {!editingUser && (
                <>
                  <Form.Group className="mb-3" controlId="userPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleModalInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="userConfirmPassword">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={handleModalInputChange}
                      required
                    />
                  </Form.Group>
                </>
              )}
              <Form.Group className="mb-3" controlId="userProvince">
                <Form.Label>Provincia</Form.Label>
                <Select
                  classNamePrefix="react-select"
                  options={provincesOptions}
                  value={provincesOptions.find(
                    (option) => option.value === newUser.province
                  )}
                  onChange={(selected) =>
                    setNewUser((prev) => ({ ...prev, province: selected.value }))
                  }
                  placeholder="Selecciona provincia"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="userRole">
                <Form.Label>Rol</Form.Label>
                <Select
                  classNamePrefix="react-select"
                  options={roleOptions}
                  value={roleOptions.find(
                    (option) => option.value === newUser.role
                  )}
                  onChange={(selected) =>
                    setNewUser((prev) => ({ ...prev, role: selected.value }))
                  }
                  placeholder="Selecciona rol"
                />
              </Form.Group>
              {modalError && (
                <div className="text-danger mb-3">{modalError}</div>
              )}
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  disabled={modalLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={modalLoading}>
                  {modalLoading
                    ? "Enviando..."
                    : editingUser
                    ? "Actualizar Usuario"
                    : "Crear Usuario"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default UsersList;
