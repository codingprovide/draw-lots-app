"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

export default function FilterParticipantsByRole() {
  const [role, setRole] = useState("");
  const [participants, setParticipants] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0); // 當前正在抽籤的用戶
  const [error, setError] = useState("");
  const [lotteryMessage, setLotteryMessage] = useState("");
  const [isLotteryActive, setIsLotteryActive] = useState(false);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const fetchParticipantsByRole = async () => {
    if (!role) {
      setError("請選擇身份");
      return;
    }

    setError("");
    setParticipants([]);

    try {
      const response = await fetch(`/api/participant/role?role=${role}`);
      const data = await response.json();

      if (response.ok) {
        setParticipants(data);
        // 初始化可用數字 1 到篩選到的用戶數量
        setAvailableNumbers(
          Array.from({ length: data.length }, (_, i) => i + 1)
        );
        setCurrentParticipantIndex(0);
        setIsLotteryActive(false);
        setLotteryMessage("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("獲取用戶時發生錯誤");
    }
  };

  const handleLottery = async () => {
    if (
      availableNumbers.length === 0 ||
      currentParticipantIndex >= participants.length
    ) {
      setError("沒有可用的號碼或用戶已經全部抽籤完畢");
      return;
    }

    const currentParticipant = participants[currentParticipantIndex];

    try {
      const response = await fetch(`/api/lottery/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: currentParticipant.id,
          availableNumbers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLotteryMessage(
          `${currentParticipant.name} 抽到了號碼 ${data.number}`
        );
        // 將該號碼從可用號碼中移除
        setAvailableNumbers((prevNumbers) =>
          prevNumbers.filter((num) => num !== data.number)
        );
        // 更新當前用戶的組別
        setParticipants((prevParticipants) =>
          prevParticipants.map((p) =>
            p.id === data.participant.id
              ? { ...p, group: data.participant.group }
              : p
          )
        );
        // 更新到下一個用戶
        setCurrentParticipantIndex((prevIndex) => prevIndex + 1);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("抽籤過程中發生錯誤");
    }
  };

  const startLottery = () => {
    if (participants.length === 0) {
      setError("請先篩選用戶");
      return;
    }
    setIsLotteryActive(true);
    setError("");
    setLotteryMessage("");
  };

  return (
    <Box>
      <h1>篩選用戶並抽籤</h1>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="role-select-label">選擇身份</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={role}
          label="身份"
          onChange={handleRoleChange}
        >
          <MenuItem value="UPPERCLASSMAN">直屬學長姐</MenuItem>
          <MenuItem value="FRESHMAN">新生</MenuItem>
          <MenuItem value="ADMIN">管理員</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={fetchParticipantsByRole}>
        篩選
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {participants.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <h2>篩選結果</h2>
          {participants.map((participant) => (
            <Box key={participant.id} sx={{ mb: 2 }}>
              <Typography variant="h6">
                {participant.name} - {participant.role} - 組別:{" "}
                {participant.group || "尚未分配"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {participants.length > 0 && (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={startLottery}
          disabled={isLotteryActive}
        >
          開始抽籤
        </Button>
      )}

      {isLotteryActive && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">
            目前正在抽籤的用戶：{participants[currentParticipantIndex]?.name}
          </Typography>

          <Button variant="contained" onClick={handleLottery} sx={{ mt: 2 }}>
            {currentParticipantIndex < participants.length
              ? "抽取號碼"
              : "抽籤完畢"}
          </Button>

          {lotteryMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {lotteryMessage}
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}
