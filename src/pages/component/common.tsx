import { Chip } from "@mui/material";
import { TaskPriorityEnum, TaskStatusEnum } from "../../common/task.enum";

export const TaskStatusChip = ({ status }: { status: TaskStatusEnum }) => {
    let color = "info";
    if (status === TaskStatusEnum.Completed) {
        color = "success";
    } else if (status === TaskStatusEnum.Pending) {
        color = "info";
    }
    return <Chip size="small" color={color as any} label={status} />;
};

export const TaskPriorityChip = ({ priority }: { priority: TaskPriorityEnum }) => {
    let color = "info";
    let label = "..."
    if (priority === TaskPriorityEnum.High) {
        label = "High"
        color = "error";
    } else if (priority === TaskPriorityEnum.Medium) {
        label = "Medium"
        color = "warning";
    } else if (priority === TaskPriorityEnum.Low) {
        label = "Low"
        color = "info";
    }
    return <Chip size="small" color={color as any} label={label} />;
};