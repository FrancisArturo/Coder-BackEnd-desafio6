import App from "./app.js";
import baseRoute from "./routes/base.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import viewsRoutes from "./routes/views.routes.js";

const app = new App([new baseRoute(), new productsRoutes(), new cartRoutes(), new sessionRoutes(), new viewsRoutes()]);


//app.listen();






