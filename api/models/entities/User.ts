import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm"
import { Constants } from "../../constants";
import * as bcrypt from 'bcrypt'
import { isNull } from "util";

enum Role {
  Admin,
  User
}

@Entity()
class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: Role.User })
  role: Role

  async setNewPasswordSecurely(password: string) {
        const salt = await bcrypt.genSalt(Constants.HashDifficulty)
        const hashPassword = await bcrypt.hash(password, salt);
        this.password = hashPassword
  }

}

export { User }