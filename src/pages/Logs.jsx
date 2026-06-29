import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import { showNotification } from "../utils/showNotification";
import TableComponent from "../components/TableComponent";

const Logs = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("USER");

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

  useEffect(() => {
    document.title = "Actividades y eventos del sistema (Logs)";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData(1, selectedColumn, debouncedSearchTerm);
  }, [debouncedSearchTerm, selectedColumn]);

  useEffect(() => {
    if (currentPage !== 1) {
      fetchData(currentPage, selectedColumn, debouncedSearchTerm);
    }
  }, [currentPage]);

  const fetchData = async (page = 1, searchCol = selectedColumn, searchVal = debouncedSearchTerm) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/logs?page=${page}&limit=${limit}&searchColumn=${searchCol}&searchTerm=${searchVal}`
      );

      const backendData = response.data.data || response.data;
      const pageInfo = response.data.currentPage ? response.data : { currentPage: page, totalPages: 1 };

      const sortedLogs = [...backendData].sort(
        (a, b) => new Date(b.DATE) - new Date(a.DATE)
      );

      const formattedLogs = sortedLogs.map((log) => ({
        ...log,
        DATE: log.DATE
          ? new Date(log.DATE).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "medium",
          })
          : "N/A",
      }));

      setLogs(formattedLogs);
      setCurrentPage(pageInfo.currentPage);
      setTotalPages(pageInfo.totalPages || Math.ceil(backendData.length / limit));

    } catch (err) {
      showNotification(
        "error",
        "Error",
        err.response?.data?.error || "Ocurrió un error al cargar el historial de actividades."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main" style={{ padding: "20px" }}>
        <h2 style={{ marginBottom: "20px", color: "#1a1c1c" }}>Registro de actividades (Log)</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-[#785a0a] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#4e4638] font-medium">Consultando registros de auditoría...</p>
          </div>
        ) : (
          <TableComponent
            allColumns={allColumns}
            columns={allColumns}
            data={logs}
            canManage={false}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            searchTerm={searchTerm}
            onSearchChange={(val) => setSearchTerm(val)}
            selectedColumn={selectedColumn}
            onColumnChange={(val) => setSelectedColumn(val)}
            enableExport={true}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Logs;