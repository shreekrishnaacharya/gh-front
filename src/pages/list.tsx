import React, { useState, useMemo, useEffect } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Button, ButtonGroup, Checkbox, Container, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, Typography } from "@mui/material";
import TaskForm from "./form";
import { ITask } from "../common/interface";
import { TaskPriorityChip, TaskStatusChip } from "./component/common";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimeLabel } from "../component/label";
import { useListQuery } from "./hook/useListQuery.hook";
import { getTasks } from "../common/apis";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useConfirm } from "./hook/useConfirm.hook";
import { useTaskMutate } from "./hook/useMutate.hook";
import { TaskPriorityEnum, TaskStatusEnum } from "../common/task.enum";
import SwapVertIcon from '@mui/icons-material/SwapVert';

/**
 * The TaskList component displays a list of tasks with operations to create, read, update and delete.
 *
 * @returns A React component that displays a list of tasks.
 */
const TaskList: React.FC = () => {

  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityEnum[]>([])
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
    confirmTitle: "Are you sure to delete selected task?"
  })

  const [confirmToggleStatusMany, confirmToggleStatusManyEle] = useConfirm({
    onConfirm: (ids: number[]) => {
      if (dataGridProps?.rows?.length) {
        const updateTask = dataGridProps?.rows?.filter(task => ids.includes(task.id)).map((task) => ({ id: task.id, status: task.status === TaskStatusEnum.Completed ? TaskStatusEnum.Pending : TaskStatusEnum.Completed }))
        const manyTasks = {
          tasks: updateTask
        }
        updateManyMutate(manyTasks)
      }
    },
    confirmTitle: "Are you sure to toggle status of selected task?"
  })

  const { dataGridProps, setFilter } = useListQuery({
    resource: "tasks",
    getList: (params) => getTasks(params),
  });

  useEffect(() => {
    setFilter([{ field: "priority", value: priorityFilter }])
  }, [priorityFilter, setFilter])

  const handleCreate = () => {
    setOpen({ open: true, defaultValues: undefined, action: "create" });
  };

  const handleClose = () => {
    setOpen({ open: false, defaultValues: undefined, action: "create" });
  }

  const columns = useMemo<GridColDef<ITask>[]>(
    () => [
      {
        field: "title",
        headerName: "Title",
        flex: 1,
        sortable: false
      },
      {
        field: "description",
        headerName: "Description",
        flex: 2,
        sortable: false
      },
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
        sortable: false,
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
      <Typography variant="h4" sx={{ my: 2 }}>
        Task Manager
      </Typography>
      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
        <Stack spacing={2} direction={"row"} justifyContent={"center"} >
          {selectedRows.length > 0 && (
            <ButtonGroup variant="outlined" aria-label="Row action buttons">
              <Button color="success" aria-label="Task Completed" title="Task Completed" onClick={() => confirmToggleStatusMany(selectedRows)}><SwapVertIcon /></Button>
              <Button color="error" aria-label="Delete Task" title="Delete Task" onClick={() => confirmDeleteMany(selectedRows)}><DeleteOutlineIcon /></Button>
            </ButtonGroup>
          )}
        </Stack>
        <Stack spacing={2} direction={"row"} justifyContent={"center"} >
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-id-priority-label" size="small">{'Filter By Priority'}</InputLabel>
            <Select
              labelId="label-id-priority-label"
              id="demo-multiple-checkbox"
              multiple
              size="small"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriorityEnum[])}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.map((priority) => TaskPriorityEnum[priority]).join(', ')}
            >
              <MenuItem value={TaskPriorityEnum.High}>
                <Checkbox checked={priorityFilter.includes(TaskPriorityEnum.High)} />
                <ListItemText primary={"High"} />
              </MenuItem>
              <MenuItem value={TaskPriorityEnum.Medium}>
                <Checkbox checked={priorityFilter.includes(TaskPriorityEnum.Medium)} />
                <ListItemText primary={"Medium"} />
              </MenuItem>
              <MenuItem value={TaskPriorityEnum.Low}>
                <Checkbox checked={priorityFilter.includes(TaskPriorityEnum.Low)} />
                <ListItemText primary={"Low"} />
              </MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create Task
          </Button>
        </Stack>
      </Stack>
      <div style={{ marginTop: 20 }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnMenu
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={setSelectedRows} // Captures checkbox selection
        />
      </div>
      <TaskForm open={open.open} action={open.action} defaultValues={open.defaultValues} onClose={handleClose} />
      {confirmDeleteEle}
      {confirmDeleteManyEle}
      {confirmToggleStatusManyEle}
    </Container>
  );
};

export default TaskList;
