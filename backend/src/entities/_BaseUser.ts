import { Column, Unique } from "typeorm";
import { IsEmail, Length } from "class-validator";
import BaseAppEntity from "./_BaseAppEntity";
import bcrypt from "bcrypt";

@Unique(["email"])
export default abstract class BaseUser extends BaseAppEntity {
    @Column()
    @Length(2, 255)
    name: string;

    @Column({ length: 100 })
    @Length(8, 100)
    password: string;

    @Column()
    @IsEmail()
    @Length(2, 255)
    email: string;

    setPassword(password: string) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(password, salt);
    }

    checkPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }

    toJSON() {
        let obj = this;

        delete obj.password;

        return obj;
    }
}
