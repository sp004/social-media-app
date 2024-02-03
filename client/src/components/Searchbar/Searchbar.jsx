import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import {BiSearchAlt} from 'react-icons/bi'
import {GrFormClose} from 'react-icons/gr'
import { useNavigate } from 'react-router-dom';
import { flexBetween, flexCenter, style } from '../../styles/variables';
import { Avatar } from '../CreatePost/styles';
import { device } from '../../styles/responsive';

const SearchBarContainer = styled.div`
  height: 70%;
  height: 40px;
  position: relative;
  flex: 0.7;
  overflow: hidden;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.textSecondary};
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
  /* z-index: 99; */

  @media ${device.tablet}{
    flex: 1;
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
`

const SearchInput = styled.input`
    outline: none;
    border: none;
    border-radius: 50px;
    height: 100%;
    width: 100%;
    padding: 6px;
    justify-self: flex-start;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};

    &:focus{
      &::placeholder{
        opacity: 0;
      }
    }
    
    &::placeholder{
      color: ${({theme}) => theme.text};
      opacity: 1;
      transition: all 1s cubic-bezier;
    }

    @media ${device.tabletS}{
      font-size: ${style.mobileText};
    }
`

const SearchIcon = styled(BiSearchAlt)`
  font-size: 24px;
  cursor: pointer;
  color: ${({theme}) => theme.text};
  `

const CloseIcon = styled(GrFormClose)`
  margin-left: auto;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.5;
  color: ${({theme}) => theme.text};
`

const SearchForm = styled.form`
  width: 100%;
  ${flexBetween}
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SuggestionContainer = styled.div`
  position: fixed;
  top: 8%;
  width: 350px;
  /* flex: 0.7; */
  max-height: 350px;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.text};
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
  z-index: 9;
  padding: 10px; 
  animation: ${fadeIn} 0.3s ease-in;

  ::-webkit-scrollbar{
    display: none;
  }
`;

const SearchList = styled.li`
  padding: 10px;
  ${flexCenter}
  justify-content: flex-start;
  gap: 6px;
  border-bottom: 1px solid lightgray;
  cursor: pointer;

  @media ${device.tabletS}{
    font-size: ${style.mobileText};
  }
`

const SearchHashtag = styled.sub`
  padding: 1px;
`

const Searchbar = ({users}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([]);
  const [expandContainer, setExpandContainer] = useState(false)
  const navigate = useNavigate()

  const updateSuggestions = (inputValue) => {
    // console.log(inputValue)
    const filteredUsers = users?.filter(user => user?.fullname?.toLowerCase()?.includes(inputValue?.toLowerCase()));
    setSuggestions([...filteredUsers]);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    
    navigate('/posts?hashtag=' + query)

    setExpandContainer(false)
    setQuery('')
  }
  
  const clickUserHandler = (user) => {
    navigate(`/profile/${user.username}`)
    setQuery('')
    setExpandContainer(false)
    setSuggestions([])
  }
  
  return (
    <SearchBarContainer>
      {query && expandContainer && (
        <SuggestionContainer>
          {suggestions?.length > 0 ? (
            <ul>
              {suggestions?.map(user => (
                <SearchList onClick={() => clickUserHandler(user)} to={`/profile/${user?.username}`} key={user?._id}>
                  <Avatar src={user?.profilePic} alt={user?.fullname} />
                  <sub style={{textTransform: 'capitalize'}}>{user?.fullname}</sub>
                </SearchList>
              ))}
              <SearchHashtag>Press Enter to search posts with <span style={{fontWeight: '600'}}>#{query}</span></SearchHashtag>
            </ul>
          ) : (
            <SearchHashtag onClick={searchHandler} style={{cursor: 'pointer'}}>Search posts with <span style={{fontWeight: '600'}}>#{query}</span></SearchHashtag>
          )
        }
        </SuggestionContainer>
      )}

      <SearchContainer>
        <SearchForm onSubmit={searchHandler}>
          <SearchIcon />
          <SearchInput type="text" placeholder="Search users and hastags" autoComplete='off' name='query' value={query} onChange={(e) => {
            setExpandContainer(true)
            setQuery(e.target.value)
            updateSuggestions(e.target.value)}
          }/>

          {query && <CloseIcon onClick={() => {
            setQuery('')
            setExpandContainer(false)
          }} />}
        </SearchForm>
      </SearchContainer>
    </SearchBarContainer>
  )
}

export default Searchbar