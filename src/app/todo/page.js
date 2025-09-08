"use client";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net-dt"; 
import "datatables.net-dt/css/dataTables.dataTables.css";

export default function TodosPage() {
  useEffect(() => {
    let table;

    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        if ($.fn.dataTable.isDataTable("#todosTable")) {
          table = $("#todosTable").DataTable();
          table.clear().rows.add(data).draw();
        } else {
          $("#todosTable").DataTable({
            data: data,
            pageLength: 10,
            columns: [
              { data: "id", title: "ID" },
              { data: "userId", title: "User ID" },
              { data: "title", title: "Title" },
              {
                data: "completed",
                title: "Completed",
                render: (val) =>
                  val
                    ? '<span style="color:green;font-weight:bold;">Yes</span>'
                    : '<span style="color:red;font-weight:bold;">No</span>',
              },
            ],
          });
        }
      });

    return () => {
      if (table) {
        table.destroy(true);
      }
    };
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl mb-4">Todos List</h2>
      <table id="todosTable" className="display w-full"></table>
    </div>
  );
}
