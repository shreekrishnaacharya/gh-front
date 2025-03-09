import { useMutation, useQueryClient } from "react-query";
import {
  deleteManyTask,
  deleteTask,
  updateManyTask,
} from "../../common/apis";

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
