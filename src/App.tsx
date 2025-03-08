import { QueryClient, QueryClientProvider } from "react-query";
import TaskManager from './pages/list';
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TaskManager />
    </QueryClientProvider>
  );
}
export default App;
