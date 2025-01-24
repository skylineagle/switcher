import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CamerasPage } from "@/components/pages/cameras-page";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-screen">
        <CamerasPage />
      </div>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
