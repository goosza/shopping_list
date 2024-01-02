const express = require("express");
const bodyParser = require('body-parser');
const shoppingListRoutes = require("./routes/shoppingListRoutes");
const userRoutes = require("./routes/userRoutes")
const connectDB = require("./config/dbConnection");
const cors = require('cors');

connectDB();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/shoppingLists", shoppingListRoutes);
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
