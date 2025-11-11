import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import '../styles/Main.css'
import { showNotification, showConfirmation } from "../utils/showNotification";
import TableComponent from "../components/TableComponent";

const Profiles = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    document.title = "Actividades y eventos del sistema (Logs)";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/logs");

      const formattedLogs = response.data.map((log) => ({
        ...log,
        DATE: log.DATE
          ? new Date(log.DATE).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "medium",
          })
          : "N/A",
      }));

      setLogs(formattedLogs);
    } catch (err) {
      showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
    }
  };

  const allColumns = [
    "DATE",
    "ID_USER",
    "USER",
    "ACTIVITY",
    "IP",
    "SERVER_NAME",
    "MODULE",
    "STATUS",
    "DETAIL"
  ];

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Registro de actividades (Log)</h2>
        <TableComponent
          allColumns={allColumns}
          columns={allColumns}
          data={logs}
        />
      </div>
    </PageLayout>
  );
};

export default Profiles;