import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../core/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../const/messages";


export abstract class BaseRepository<T extends Document, U>
  implements IBaseRepository<T, U>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public handleError(error: unknown, message: string): Error {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Error(`${message}: ${errorMessage}`);
  }

  async create(data: Partial<T>): Promise<U> {
    try {
      const result = await this.model.create(data);
      return result.toObject() as U
     
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.CREATE_ERROR);
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.COUNT_ERROR);
    }
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<U[]> {
    try {
    return await this.model.find(filter).lean().exec() as unknown as U[];
      
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.FIND_ALL_ERROR);
    }
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<number> {
    try {
      const result = await this.model.updateMany(filter, update).lean().exec();
      return result.modifiedCount;
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.UPDATE_MANY_ERROR);
    }
  }
  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<U | null> {
    try {
      return await this.model.findOneAndUpdate(filter, update, { new: true }).lean().exec() as unknown as U;
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.UPDATE_ONE_ERROR);
    }
  }

  async findById(id: string): Promise<U | null> {
    try {
      return await this.model.findById(id).lean().exec()as unknown as U;;
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.FIND_BY_ID_ERROR);
    }
  }

  async findOne(condition: FilterQuery<T>): Promise<U | null> {
    try {
      return await this.model.findOne(condition).lean().exec() as unknown as U;;
      
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.FIND_ONE_ERROR);
    }
  }

  async findWithPassword(condition: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(condition).select("+password").exec();
    } catch (error) {
      throw this.handleError(
        error,
        MESSAGES.REPOSITORY.FIND_WITH_PASSWORD_ERROR
      );
    }
  }

  async findOneWithPassword(condition: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(condition).select("+password").exec();
    } catch (error) {
      throw this.handleError(
        error,
        MESSAGES.REPOSITORY.FIND_WITH_PASSWORD_ERROR
      );
    }
  }

async update(id: string, data: UpdateQuery<T>): Promise<U | null> {
  try {
    const updated = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec(); 
    return updated as U;
  } catch (error) {
    throw this.handleError(error, MESSAGES.REPOSITORY.UPDATE_ERROR);
  }
}


  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.DELETE_ERROR);
    }
  }
  async findWithQuery(options: {
    filters?: FilterQuery<T>;                
    searchFields?: (keyof T)[];
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: U[]; total: number; page: number; totalPages: number }> {
    try {
      const {
        filters = {},
        searchFields = [],
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        limit = 10,
      } = options;
      const query: FilterQuery<T> = { ...filters };
      if (search && searchFields.length > 0) {
        query.$or = searchFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })) as any;
      }

      const skip = (page - 1) * limit;
      const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      };

      const total = await this.model.countDocuments(query);
      const docs = await this.model
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      return {
        data: docs as unknown as U[],
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw this.handleError(error, MESSAGES.REPOSITORY.FIND_ALL_ERROR);
    }
  }


}