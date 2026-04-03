import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const LimeImage = sequelize.define("LimeImage", {
  lime_id: DataTypes.STRING,
  image_path: DataTypes.STRING,
  label: DataTypes.STRING
});