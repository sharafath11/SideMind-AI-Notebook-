import { AuthController } from "../../controller/auth.controller";
import { SubjectController } from "../../controller/subject.controller";
import { AuthRepository } from "../../repository/authRepository";
import { SubjectRepository } from "../../repository/subjectRepository";
import { AuthService } from "../../services/auth.Service";
import { SubjectService } from "../../services/subject.service";
import { IAuthController } from "../interfaces/controllers/IAuth.Controller";
import { ISubjectController } from "../interfaces/controllers/ISubject.Controller";
import { IAuthRepository } from "../interfaces/repository/IAuthRepository";
import { ISubjectRepository } from "../interfaces/repository/ISubjectRepository";
import { IAuthService } from "../interfaces/services/IAuth.Service";
import { ISubjectService } from "../interfaces/services/ISubject.Service";
import { TYPES } from "../types";
import { container } from "tsyringe";

container.registerSingleton<IAuthService>(TYPES.IAuthServices, AuthService);
container.registerSingleton<IAuthController>(TYPES.IAuthController, AuthController);
container.registerSingleton<IAuthRepository>(TYPES.IAuthRepository, AuthRepository);
container.registerSingleton<ISubjectController>(TYPES.ISubjectController, SubjectController)
container.registerSingleton<ISubjectService>(TYPES.ISubjectService, SubjectService);
container.registerSingleton<ISubjectRepository>(TYPES.ISubjectRepository,SubjectRepository)
export { container };
