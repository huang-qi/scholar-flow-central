import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import ReportHub from "./pages/ReportHub";
import LiteratureManagement from "./pages/LiteratureManagement";
import ResearchOutput from "./pages/ResearchOutput";
import ToolLibrary from "./pages/ToolLibrary";
import Guidelines from "./pages/Guidelines";
import News from "./pages/News";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AddReport from "./pages/AddReport";
import AddLiterature from "./pages/AddLiterature";
import AddResearchOutput from "./pages/AddResearchOutput";
import AddGuideline from "./pages/AddGuideline";
import AddTool from "./pages/AddTool";
import AddNews from "./pages/AddNews";
import Profile from "./pages/Profile";
import { PrivateRoute } from "./components/auth/PrivateRoute";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/reports" element={<ReportHub />} />
                      <Route path="/add-report" element={<AddReport />} />
                      <Route path="/literature" element={<LiteratureManagement />} />
                      <Route path="/add-literature" element={<AddLiterature />} />
                      <Route path="/research" element={<ResearchOutput />} />
                      <Route path="/add-output" element={<AddResearchOutput />} />
                      <Route path="/tools" element={<ToolLibrary />} />
                      <Route path="/add-tool" element={<AddTool />} />
                      <Route path="/guidelines" element={<Guidelines />} />
                      <Route path="/add-guideline" element={<AddGuideline />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/add-news" element={<AddNews />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
