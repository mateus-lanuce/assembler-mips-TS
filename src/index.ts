import express from "express";
import jwtAuthenticationMiddleware from "./middlewares/jwt-authentication.middleware";
import errorHandler from "./middlewares/error-handler.middleware";
import authorizationRoute from "./routes/authentication.route";
import statusRoute from "./routes/status.route";
import usersRoute from "./routes/users.route";
const app = express();

const host = "http://localhost:";
const port = 3562;

//Configuração
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rotas
app.use(statusRoute);
app.use(authorizationRoute);

// Rotas que vão passar pelo Middleware de autenticação
app.use(jwtAuthenticationMiddleware)
app.use(usersRoute);

//Error Hendlers
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server Running in ${host}${port}`);
});
