import catchErrors from "../utils/catchErrors";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";

export const getUserHandler = catchErrors(async(req,res)=> {
    const user = await UserModel.findById(req.userId);
    appAssert(user,NOT_FOUND,'User Not found');

    return res.status(200).json(user.omitPassword());
})