import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import AppRoutes from "./routes/AppRoutes";
import "bootstrap/js/src/collapse";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Switch>
          {/* إعادة التوجيه إلى صفحة تسجيل الدخول فقط إذا كان المسار "/" */}
          <Redirect exact from="/" to="/auth/login-classic" />

          {/* مسارات صفحات المصادقة */}
          <Route path="/auth" render={(props) => <AuthRoutes {...props} />} />

          {/* مسارات لوحة التحكم أو التطبيق بعد تسجيل الدخول */}
          <Route path="/" render={(props) => <AppRoutes {...props} />} />

          {/* للتعامل مع أي مسار غير معروف */}
          {/* <Redirect to="/auth/login-classic" /> */}
        </Switch>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
