import { Response } from "express";

export default (res: Response, statusCode: number, data: any) => {
  res.status(statusCode).json(data);
};
