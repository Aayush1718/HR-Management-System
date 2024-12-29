import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors());

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//importing routes;

import empRouter from './routes/emp.routes.js'
import hrmRouter from './routes/hrm.routes.js'
import leaveRouter from './routes/leave.routes.js'


app.use("/api/v1/emp" , empRouter)
app.use("/api/v1/hrm" , hrmRouter)
app.use("/api/v1/leave" , leaveRouter)

export {app} 