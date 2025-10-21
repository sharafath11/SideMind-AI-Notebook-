export interface IUserDto {
    userId: string
    name: string
    email: string
    googleId ? :string
}
export interface IUserLoginDTO {
    userId: string
    name: string
    email: string
    tocken: string,
    refreshToken : string
}
