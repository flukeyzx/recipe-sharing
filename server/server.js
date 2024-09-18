import { app } from "./app.js";
import cors from "cors";

app.arguments(
  cors({
    origin: "*",
    credentials: true,
  })
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Application is listening on the port ${port}`);
});
