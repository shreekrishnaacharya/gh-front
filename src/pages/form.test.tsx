import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TaskForm from './form';
import { TaskPriorityEnum, TaskStatusEnum } from '../common/task.enum';
import { ITask } from '../common/interface';
import { useMutation } from 'react-query';
import axios from 'axios';

jest.mock('axios');
// Mocking the API functions
jest.mock('../common/apis', () => ({
  createTask: jest.fn(),
  updateTask: jest.fn(),
}));

jest.mock('react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

const mockOnClose = jest.fn();

describe('TaskForm', () => {
  const mockDefaultValues: ITask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    due_date: '2025-03-10T00:00:00Z',
    priority: TaskPriorityEnum.Medium,
    status: TaskStatusEnum.Pending,
  };

  const mockMutate = jest.fn();

  beforeEach(() => {
    axios.get = jest.fn().mockResolvedValue(mockDefaultValues);
    axios.post = jest.fn().mockResolvedValue(mockDefaultValues);

    render(
      <TaskForm
        open={true}
        action="edit"
        defaultValues={mockDefaultValues}
        onClose={mockOnClose}
      />
    );
  });

  test('renders the form with default values', () => {
    expect(screen.getByLabelText('Title')).toHaveValue('Test Task');
    expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    expect(screen.getByLabelText('Due Date')).toHaveValue('2025-03-10T00:00:00Z');
    expect(screen.getByLabelText('Priority')).toHaveValue(TaskPriorityEnum.Medium);
  });

  test('calls onClose when the Close button is clicked', () => {
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('submits the form with modified values', async () => {
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const prioritySelect = screen.getByLabelText('Priority');
    const submitButton = screen.getByText('Submit');

    // Change some input values
    fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Task Description' } });
    fireEvent.change(prioritySelect, { target: { value: TaskPriorityEnum.High } });

    // Submit the form
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockMutate).toHaveBeenCalledWith({
      id: '1',
      title: 'Updated Task Title',
      description: 'Updated Task Description',
      due_date: '2025-03-10T00:00:00Z',
      priority: TaskPriorityEnum.High,
      status: TaskStatusEnum.Pending,
    }));
  });

  test('does not submit the form if no fields are modified', async () => {
    const submitButton = screen.getByText('Submit');

    // Submit the form without changing any fields
    fireEvent.click(submitButton);

    // Expect the mutate function to not be called
    await waitFor(() => expect(mockMutate).not.toHaveBeenCalled());
  });

  test('disables Submit button when form is not dirty', () => {
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  test('enables Submit button when form is dirty', async () => {
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeEnabled();
  });

  test('displays a loading state when submitting', async () => {

    render(
      <TaskForm
        open={true}
        action="edit"
        defaultValues={mockDefaultValues}
        onClose={mockOnClose}
      />
    );

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toHaveTextContent('Saving...');
  });
});
