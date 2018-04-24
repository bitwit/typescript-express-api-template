class SuccessBody {
    success: boolean
}

export class Constants {
    static readonly PasswordMinLength = 8
    static readonly PasswordMaxLength = 32
    static readonly EmailTakenMessage = "Email address is already taken"
    static readonly HashDifficulty = 12
    static readonly DefaultSuccessBody: SuccessBody = { success: true }
}