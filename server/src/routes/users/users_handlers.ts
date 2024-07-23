import { Request, Response } from "express"
import createHttpError from "http-errors"
import pick from "lodash/pick"

import User from "@/database/tables/user"

export default class UsersHandlers {

  static getUsersList(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  static createUser(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  static async getUserDetails(request: Request, response: Response, full: boolean) {
    try{
      const foundUser = await User.findOne({where:{
        id:request.params.user_id
        }
      })

      if(!foundUser){
        throw new createHttpError.NotFound()
      }

      var chosenAttributes

      if(full){
        chosenAttributes = [
          "email", 
          "preferred_name", 
          "role", 
          "age", 
          "phone_number", 
          "university", 
          "graduation_year",
          "ethnicity",
          "gender",
          "checked_in"
        ]
      }else{
        chosenAttributes = [
          "preferred_name",
          "role",
          "checked_in"
        ]
      }

      const payload = pick(foundUser, chosenAttributes)

      response.status(200)
      response.json({ status: response.statusCode, message: "OK", data: payload })
    }catch(err){
      response.status(400)
      response.json({ status: response.statusCode, message: err})
    }
  }

  static patchUserDetails(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  static deleteUser(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }
}
