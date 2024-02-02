import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HamburgerMenu,
  Logo,
  LogoImg,
  NavContainer,
  NavWrapper,
} from "./styles";
import logo from "../../assets/logo.png";
import Searchbar from "../Searchbar/Searchbar";
import { fetchUnblockedUsers } from "../../features/user/userSlice";
import NavbarMenu from "../NavbarMenu/NavbarMenu";
import SideMenubar from "../SideMenubar/SideMenubar";

const Navbar = ({openMenuBox, setOpenMenuBox}) => {
  const [openHamburgerMenu, setOpenHamburgerMenu] = useState(false)
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.auth)
  const {unblockedUsers} = useSelector(state => state.user)

  // const [query, setQuery] = useState('');
  // const [searchableUsers, setSearchableUsers] = useState([]);
console.log("cu == ", currentUser)
  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchUnblockedUsers())
    }, 2000); 
  }, [])
  
  console.log("unblocked users ==>", unblockedUsers)

  return (
    <NavContainer>
      <NavWrapper>
        <Logo to={`/feed`}>
          <LogoImg src={logo} alt="logo" />
        </Logo>

        <Searchbar users={unblockedUsers?.filter(user => !user?.isDeactivated && !user?.isBlocked)} />
        
        <NavbarMenu openMenuBox={openMenuBox} setOpenMenuBox={setOpenMenuBox} />
        <HamburgerMenu onClick={() => setOpenHamburgerMenu(prev => !prev)} />
        <SideMenubar setOpenHamburgerMenu={setOpenHamburgerMenu} open={openHamburgerMenu} />
      </NavWrapper>
    </NavContainer>
  );
};

export default Navbar;
