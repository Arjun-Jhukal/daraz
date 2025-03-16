export const sanitizeUser = (user: any) => {
    if (!user) return null;

    const { password, resetPasswordToken, resetPasswordExpires, ...sanitizedUser } = user.toObject ? user.toObject() : user;
    return sanitizedUser;
};
