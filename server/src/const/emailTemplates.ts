export const MailTemplates = {
    OTP: {
        SUBJECT: "Your OTP Code",
        TEXT: (otp: string) =>
            `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    },
}