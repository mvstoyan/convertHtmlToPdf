import { app, port } from "./expressServer.js";

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
