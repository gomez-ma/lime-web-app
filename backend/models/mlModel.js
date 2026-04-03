import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const MLModel = sequelize.define("MLModel", {
  version: DataTypes.STRING,
  model_path: DataTypes.STRING,
  accuracy: DataTypes.FLOAT,
  is_active: DataTypes.BOOLEAN
});