import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import * as uuid from 'uuid'

@Entity()
class Device extends BaseEntity {

  @PrimaryColumn("uuid")
  id: string

  @Column({ nullable: true })
  iosNotificationToken: String

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User

  public constructor() {
    super()
    this.id = uuid.v4()
  }
}

export { Device }