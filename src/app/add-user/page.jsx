"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";

export default function AddUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 從 URL query 中獲取 id, name 和 role
  const id = searchParams.get("id");
  const [name, setName] = useState(searchParams.get("name") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = { name, role };

    try {
      // 判斷是新增還是更新
      let response;
      if (id) {
        // 有 id 時，進行更新
        response = await fetch(`/api/participant/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
      } else {
        // 沒有 id 時，進行新增
        response = await fetch("/api/participant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        setMessage(
          id
            ? `Participant ${data.name} updated`
            : `Participant ${data.name} added`
        );
        router.push("/view-user"); // 成功後回到參與者列表頁面
      } else {
        setMessage(
          id ? "Error updating participant" : "Error adding participant"
        );
      }
    } catch (error) {
      setMessage(
        id ? "Error updating participant" : "Error adding participant"
      );
    }
  };

  return (
    <Box>
      <h1>{id ? "Edit User" : "Add User"}</h1>
      <TextField
        id="outlined-basic"
        label="姓名"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">身份</InputLabel>
        <Select
          required
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          label="role"
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value={"UPPERCLASSMAN"}>直屬學長姐</MenuItem>
          <MenuItem value={"FRESHMAN"}>新生</MenuItem>
        </Select>
      </FormControl>
      <Button
        disabled={role && name ? false : true}
        variant={"contained"}
        onClick={handleSubmit}
      >
        {id ? "更新" : "送出"}
      </Button>
      {message}
    </Box>
  );
}
