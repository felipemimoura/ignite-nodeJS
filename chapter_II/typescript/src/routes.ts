import { Request, Response } from "express"
import CreateCourseServices from "./CreateCourseServices"


export const createCourse = (request: Request, response: Response) => {
    CreateCourseServices.execute({ duration: 10, educator: "Felipe", name: "NodeJS" })

    return response.send()
}

