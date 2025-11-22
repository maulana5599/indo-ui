import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import CartTransaction from "./pages/Transaction/Cart";
import ListProducts from "./pages/Products/ListProducts";
import Customers from "./pages/Customers/Customer";
import ProtectedRoute from "./components/common/ProtectedRoute";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            {/* Products */}
            <Route index path="/products/list-products" element={
              <ProtectedRoute>
                <ListProducts />
              </ProtectedRoute>
            } />

            {/* Customers */}
            <Route index path="/customers/information-customers" element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            } />

            {/* Transaction */}
            <Route path="/transactions/information-transaction" element={
              <ProtectedRoute>
                <CartTransaction />
              </ProtectedRoute>
            } />

          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
