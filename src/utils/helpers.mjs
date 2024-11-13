import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password, salt);

}
// compare the plain password with the hash password 
export const comparePassword = (plainPassword, hashPass) =>{
    return bcrypt.compareSync(plainPassword, hashPass);
}