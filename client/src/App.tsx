import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogArchive from "./pages/BlogArchive";
import BlogLatest from "./pages/BlogLatest";
import BlogPost from "./pages/BlogPost";
import Archive from "./pages/Archive";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/login/admin"} component={AdminLogin} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/blog/latest"} component={BlogLatest} />
      <Route path={"/blog/:date/:slug"} component={BlogPost} />
      <Route path={"/blog"} component={BlogArchive} />
      <Route path={"/archive"} component={Archive} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
