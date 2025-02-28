import { UserEntity, UserService } from '../types';
import UserModel from '../../../../../internal/model/user';
import { followUser } from '../service';
import { error } from 'console';
import { promises } from 'dns';
import { forEach } from 'lodash';
import { BaseController } from '../../../shared/base-controller';


export class UserServiceImpl extends BaseController implements UserService {
  async getOne(id: string): Promise<UserEntity> {
    const user = await UserModel.findById(id);

    return {
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    };
  }

  async followUser(sub: string, id: string): Promise<void> {
    const user = await UserModel.findById(sub);
    const followUser = await UserModel.findById(id);
    console.log("iddd: ", followUser)

    if (!followUser) {
      throw new Error("User not found");
    }
    if(followUser.id === user.id)
    {
      throw new Error("Cannot follow");
      
    }

    if (user.followings.includes(followUser.id)) {
      throw new Error("You have followed this user")
    }
    user.followings.push(followUser.id);
    followUser.followers.push(user.id);

    await user.save();
    await followUser.save();
  }

  async unfollowUser(sub: string, id: string): Promise<void> {
    const user = await UserModel.findById(sub);
    const unfollowUser = await UserModel.findById(id);

    if (!unfollowUser) {
      throw new Error("User not found.");
    }
    var indexUser = user.followings.indexOf(unfollowUser.id);
    if (indexUser === -1) {
      throw new Error("You do not follow this user.");
    }
    user.followings.splice(indexUser, 1);

    var indexUnfollowUser = unfollowUser.followers.indexOf(user.id);
    if (indexUnfollowUser === -1) {
      throw new Error("You do not follow this user.");
    }
    unfollowUser.followers.splice(indexUnfollowUser, 1);

    await user.save();
    await unfollowUser.save();
  }

  async getFollowing(sub: string, id: string): Promise<UserEntity> {
    try {
      const user = await UserModel.findById(sub);
      const following = await UserModel.findById(id);

      console.log("aaaaa: ", following)
      if (!following) {
        throw new Error("This user does not exist.")
      }

      if (!user.followings.includes(following.id)) {
        throw new Error("You do not follow this user.");
      }

      return {
        id: String(following._id),
        name: String(following.name),
        avatar: String(following.avatar),
        email: String(following.email),
      };
    } catch (error) {
      throw error;
    }
  }

  async getFollower(sub: string, id: string): Promise<UserEntity> {
    try {
      const user = await UserModel.findById(sub);
      const follower = await UserModel.findById(id);

      // console.log("aaaaa: ",follower)
      if (!follower) {
        throw new Error("This user does not exist.")
      }

      if (!user.followers.includes(follower.id)) {
        throw new Error("This user is not following you.");
      }

      return {
        id: String(follower._id),
        name: String(follower.name),
        avatar: String(follower.avatar),
        email: String(follower.email),
      };
    } catch (error) {
      throw error;
    }
  }
}