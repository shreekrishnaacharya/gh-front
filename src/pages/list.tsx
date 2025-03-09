import React, { useState, useMemo } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Button, ButtonGroup, Container, IconButton, Stack, Typography } from "@mui/material";
import TaskForm from "./_form";
import { ITask } from "../common/interface";
import { TaskPriorityChip, TaskStatusChip } from "./component/common";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimeLabel } from "../component/label";
import { useListQuery } from "./hook/useListQuery.hook";
import { getTasks } from "../common/apis";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useConfirm } from "./hook/useConfirm.hook";
import { useTaskMutate } from "./hook/useMutate.hook";
import { TaskStatusEnum } from "../common/task.enum";


const TaskList: React.FC = () => {

  const [open, setOpen] = useState<{ open: boolean; defaultValues?: ITask, action: "create" | "edit" }>({
    open: false,
    action: "create",
    defaultValues: undefined,
  });

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])

  const { deleteManyMutate, deleteMutate, updateManyMutate } = useTaskMutate()

  const [confirm, confirmDeleteEle] = useConfirm({
    onConfirm: (data: ITask) => {
      deleteMutate(data.id)
    },
    confirmTitle: "Are you sure to delete this task?"
  })

  const [confirmDeleteMany, confirmDeleteManyEle] = useConfirm({
    onConfirm: (ids: number[]) => {
      const manyTasks = {
        tasks: ids.map((id) => ({ id }))
      }
      deleteManyMutate(manyTasks)
    },
    confirmTitle: "Are you sure to delete these tasks?"
  })

  const [confirmCompleteMany, confirmCompleteManyEle] = useConfirm({
    onConfirm: (ids: number[]) => {
      const manyTasks = {
        tasks: ids.map((id) => ({ id, status: TaskStatusEnum.Completed }))
      }
      updateManyMutate(manyTasks)
    },
    confirmTitle: "Are you sure to complete these tasks?"
  })

  const { dataGridProps } = useListQuery({
    resource: "tasks",
    getList: (params) => getTasks(params),
  });

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
        field: "status",
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
            <Stack direction="row" spacing={1}>
              <IconButton
                color="primary"
                size="small"
                sx={{
                  color: "text.secondary",
                }}
                onClick={() => setOpen({ open: true, defaultValues: row, action: "edit" })}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="primary"
                size="small"
                onClick={() => confirm(row)}
              >
                <DeleteOutlineIcon color="error" fontSize="small" />
              </IconButton>
            </Stack>
          );
        },
      }
    ],
    [setOpen, confirm]
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Task Manager
      </Typography>
      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
        <Box>
          {selectedRows.length > 0 && (
            <ButtonGroup variant="outlined" aria-label="Row action buttons">
              <Button color="success" aria-label="Task Completed" title="Task Completed" onClick={() => confirmCompleteMany(selectedRows)}><TaskAltIcon /></Button>
              <Button color="error" aria-label="Delete Task" title="Delete Task" onClick={() => confirmDeleteMany(selectedRows)}><DeleteOutlineIcon /></Button>
            </ButtonGroup>
          )}
        </Box>
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
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={setSelectedRows} // Captures checkbox selection
        />
      </div>
      <TaskForm open={open.open} action={open.action} defaultValues={open.defaultValues} onClose={handleClose} />
      {confirmDeleteEle}
      {confirmDeleteManyEle}
      {confirmCompleteManyEle}
    </Container>
  );
};

export default TaskList;
