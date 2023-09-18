import { AiFillHome } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import UserProfile from "../components/Settings/UserProfile/UserProfile";
import AccountSettings from "../components/Settings/AccountSettings/AccountSettings";

export const navItems = [
    {
        text: 'Home',
        link: 'feed',
        Icon: AiFillHome,
    },
    {
        text: 'Frineds',
        link: 'friends',
        Icon: FaUserFriends,
        counter: 2
    },
    {
        text: 'Chat',
        link: 'chat',
        Icon: IoIosChatboxes,
        counter: 3
    },
    {
        text: 'Notification',
        link: 'notification',
        Icon: IoNotifications,
        counter: 4
    },
]

export const sidebarItems = [
    {
        id: 0,
        text: 'Settings',
        link: 'settings'
    },
    {
        id: 1,
        text: 'Profile',
        link: 'profile',
    },
    {
        id: 2,
        text: 'Bookmarks',
        link: 'bookmarks',
    },
    {
        id: 4,
        text: 'Tagged Posts',
        link: 'tagged-posts',
    },
    {
        id: 5,
        text: 'Blocked Accounts',
        link: 'blocked-accounts',
    }
]