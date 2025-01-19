import bcrypt from 'bcrypt';

export const hashValue = async (value: string , saltRounds?: number): Promise<string> => {
    return bcrypt.hash(value, saltRounds || 10);
}

export const compareValue = async (value: string, hashedValue: string): Promise<boolean> => {
    return bcrypt.compare(value, hashedValue).catch(() => false);
}