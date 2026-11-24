import { Router} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constants/role";

const router = Router()



router.post("/", userController.createUser);
// get all user
router.get("/", auth(USER_ROLE.admin, USER_ROLE.agent), userController.getAllUser)
router.get("/:id",userController.singleUser)
router.put("/:id",userController.updateUser)
router.delete("/:id",userController.deleteUser)

export const userRoute = router