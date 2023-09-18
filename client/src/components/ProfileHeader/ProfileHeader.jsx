import React from 'react'
import { Images, ProfileHeaderWrapper} from './styles'
import CoverPicture from './CoverPicture/CoverPicture'
import ProfilePicture from './ProfilePicture/ProfilePicture'
import FriendStatus from './FriendStatus/FriendStatus'
import OtherInfo from './OtherInfo/OtherInfo'

const ProfileHeader = ({currentUser, isMyProfile, auth, posts}) => {
  return (
    <ProfileHeaderWrapper>
      <Images>
        {/* cover picture  */}
        <CoverPicture isMyProfile={isMyProfile} currentUser={currentUser} />

        {/* profile picture  */}
        <ProfilePicture isMyProfile={isMyProfile} currentUser={currentUser} auth={auth} />

        <FriendStatus isMyProfile={isMyProfile} auth={auth} user={currentUser} />

        <OtherInfo isMyProfile={isMyProfile} user={currentUser} posts={posts} />
      </Images>
    </ProfileHeaderWrapper>
  )
}

export default ProfileHeader