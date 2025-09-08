"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../slices/demoSlice";

export default function AddUser() {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const users = useSelector((s) => s.demo.users); // ✅ select array

  const handleClick = () => {
    if (!name.trim()) return;
    dispatch(addUser(name)); // no need for await here
    setName(""); // clear input
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name..."
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handleClick} style={{ padding: "8px 12px" }}>
        Submit
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>User list</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
