import { QueryClient, QueryClientProvider } from "react-query";
import TaskManager from './pages/list';
import { BrowserRouter } from "react-router-dom";
const queryClient = new QueryClient();
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TaskManager />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
export default App;
