import React, { useState, useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, ButtonGroup, Container, IconButton, Stack, Typography } from "@mui/material";
import TaskForm from "./_form";
import { ITask } from "../common/interface";
import { TaskPriorityChip, TaskStatusChip } from "./component/common";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimeLabel } from "../component/label";
import { useListQuery } from "./hook/useListQuery.hook";
import { getTasks } from "../common/apis";
import { DeleteOutline } from "@mui/icons-material";
import TaskAltIcon from '@mui/icons-material/TaskAlt';


const TaskList: React.FC = () => {

  const [open, setOpen] = useState<{ open: boolean; defaultValues?: ITask, action: "create" | "edit" }>({
    open: false,
    action: "create",
    defaultValues: undefined,
  });

  const { dataGridProps } = useListQuery({
    resource: "tasks",
    getList: (params) => getTasks(params),
  });

  const handleEdit = (task: ITask) => {
    setOpen({ open: true, defaultValues: task, action: "edit" });
  };

  const handleCreate = () => {
    setOpen({ open: true, defaultValues: undefined, action: "create" });
  };

  const handleClose = () => {
    setOpen({ open: false, defaultValues: undefined, action: "create" });
  }

  const columns = useMemo<GridColDef<ITask>[]>(
    () => [
      { field: "title", headerName: "Title", flex: 1 },
      { field: "description", headerName: "Description", flex: 2 },
      {
        field: "due_date",
        headerName: "Due Date",
        flex: 1,
        renderCell: ({ row }) => (<DateTimeLabel date={row.due_date} />)
      },
      {
        field: "priority",
        headerName: "Priority",
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: ({ row }) => (<TaskPriorityChip priority={row.priority} />),
      },
      {
        field: "Status",
        headerName: "Status",
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: ({ row }) => (<TaskStatusChip status={row.status} />),
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "center",
        headerAlign: "center",
        width: 100,
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <IconButton
              color="primary"
              size="small"
              sx={{
                color: "text.secondary",
              }}
              onClick={() => handleEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          );
        },
      }
    ],
    [handleEdit]
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Task Manager
      </Typography>
      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
        <ButtonGroup variant="outlined" aria-label="Row action buttons">
          <Button color="success" aria-label="Task Completed" title="Task Completed"><TaskAltIcon /></Button>
          <Button color="error" aria-label="Delete Task" title="Delete Task"><DeleteOutline /></Button>
          <Button>Three</Button>
        </ButtonGroup>
        <Box>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create Task
          </Button>
        </Box>
      </Stack>
      <div style={{ height: 400, marginTop: 20 }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          checkboxSelection />
      </div>
      <TaskForm open={open.open} action={open.action} defaultValues={open.defaultValues} onClose={handleClose} />
    </Container>
  );
};

export default TaskList;
