import { Router} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constants/role";

const router = Router()



router.post("/", userController.createUser);
// get all user
router.get("/", auth(USER_ROLE.admin, USER_ROLE.agent), userController.getAllUser)
router.get("/:id",auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),userController.singleUser)
router.put("/:id",auth(USER_ROLE.admin, USER_ROLE.user),userController.updateUser)
router.delete("/:id",auth(USER_ROLE.admin, USER_ROLE.user),userController.deleteUser)

export const userRoute = router