import { useMutation, useQueryClient } from "react-query";
import {
  deleteManyTask,
  deleteTask,
  updateManyTask,
} from "../../common/apis";

  /**
   * React Query hook for delete and update many tasks
   * @returns {Object} - An object containing the following:
   *   - deleteMutate: A function to delete a task
   *   - updateManyMutate: A function to update many tasks
   *   - deleteManyMutate: A function to delete many tasks
   */
export const useTaskMutate = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteMutate } = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const { mutate: deleteManyMutate } = useMutation(deleteManyTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const { mutate: updateManyMutate } = useMutation(updateManyTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  return {
    deleteMutate,
    updateManyMutate,
    deleteManyMutate,
  };
};
