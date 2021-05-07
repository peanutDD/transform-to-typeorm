import { IsNotEmpty } from "class-validator";
import {
	Entity,
	Column,
	ManyToOne,
	ManyToMany,
	JoinTable,
	OneToMany,
  JoinColumn,
} from "typeorm";
import Base from "./Base";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity("posts")
export class Post extends Base {
	@Column("text")
	@IsNotEmpty()
	body: string;

	@ManyToOne((_) => User, (user) => user.posts, {eager: true})
  @JoinColumn({ name: "user_id" })
  @IsNotEmpty()
  user: User;

	@OneToMany(() => Comment, (comment) => comment.post)
	comments: Comment[];

	@ManyToMany(() => User)
	@JoinTable()
	likes: User[];
}
