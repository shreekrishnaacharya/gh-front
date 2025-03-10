import React, { useEffect } from "react";
import {
    Modal,
    Box,
    Button,
    MenuItem,
    Typography,
    Divider,
    Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { createTask, updateTask } from "../common/apis";
import { ITask } from "../common/interface";
import { TaskPriorityEnum, TaskStatusEnum } from "../common/task.enum";
import { CDateTimePicker, CInput, CSelect } from "../component/input";

interface TaskFormProps {
    open: boolean;
    action: "create" | "edit";
    defaultValues?: ITask
    onClose: () => void;
}

/**
 * A form to create or edit a task. It handles the submission of the
 * form, and calls the onClose function when the form is closed.
 *
 * @param {boolean} open - Whether the form is open or not.
 * @param {"create"|"edit"} action - The action to take when the form is submitted.
 * @param {ITask} defaultValues - The default values for the form.
 * @param {() => void} onClose - The function to call when the form is closed.
 *
 * @returns {JSX.Element} The form component.
 */
const TaskForm: React.FC<TaskFormProps> = ({ open, action, onClose, defaultValues }) => {
    const { control, handleSubmit, reset, formState: { errors, isDirty, dirtyFields } } = useForm<ITask>({
        defaultValues: {
            ...defaultValues
        },
    });
    // Reset the form when the form is opened or closed.
    useEffect(() => {
        if (open) {
            reset({
                title: defaultValues?.title || "",
                description: defaultValues?.description || "",
                due_date: defaultValues?.due_date || "",
                priority: defaultValues?.priority || undefined,
                status: defaultValues?.status || TaskStatusEnum.Pending,
            });
        }
    }, [open, defaultValues, reset]);

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(
        async (data: ITask) => {
            if (action === "edit" && defaultValues?.id) {
                return updateTask(defaultValues.id, { ...data })
            }
            return createTask({ ...data, status: TaskStatusEnum.Pending });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("tasks");
                onClose();
                reset();
            },
        }
    );

    /**
     * The function to call when the form is submitted.
     *
     * This function only calls the mutate function if the user has changed any of the fields.
     * It will send a PATCH request to the server with the updated values.
     *
     * @param {ITask} data - The data from the form.
     */
    const onSubmit = (data: ITask) => {
        if (Object.keys(dirtyFields).length === 0) {
            return;
        }
        const dirtyData = Object.keys(dirtyFields).reduce((acc, key) => {
            acc[key as keyof ITask] = data[key as keyof ITask];
            return acc;
        }, {} as any);
        mutate(dirtyData);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    bgcolor: "white",
                    p: 3,
                    boxShadow: 24,
                }}
            >
                <Typography variant="h6">{Boolean(defaultValues) ? `Edit Task : ${defaultValues?.title}` : 'Create Task'}</Typography>
                <Divider sx={{ my: 2 }} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2} gap={2} >
                        <CInput fullWidth control={control} name="title" label="Title" required errors={errors} />
                        <CDateTimePicker fullWidth control={control} name="due_date" label="Due Date" required errors={errors} />
                        <CSelect fullWidth control={control} name="priority" label="Priority" required errors={errors}>
                            <MenuItem value={TaskPriorityEnum.Low}>Low</MenuItem>
                            <MenuItem value={TaskPriorityEnum.Medium}>Medium</MenuItem>
                            <MenuItem value={TaskPriorityEnum.High}>High</MenuItem>
                        </CSelect>
                        <CInput fullWidth multiline={3} control={control} name="description" label="Description" required errors={errors} />

                        <Divider sx={{ my: 2 }} />

                        <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {"Close"}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isDirty || isLoading}
                            >
                                {isLoading ? "Saving..." : "Submit"}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
        </Modal>
    );
};

export default TaskForm;
