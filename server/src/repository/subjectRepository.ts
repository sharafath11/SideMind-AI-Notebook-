import { ISubjectRepository } from "../core/interfaces/repository/ISubjectRepository";
import { SubjectModel } from "../models/subjectModel";
import { ISubject } from "../types/subjectTypes";
import { BaseRepository } from "./baseRepository";

export class SubjectRepository extends BaseRepository<ISubject,ISubject> implements ISubjectRepository {
    constructor() {
        super(SubjectModel)
    }
}