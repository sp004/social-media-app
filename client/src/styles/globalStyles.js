import { createGlobalStyle } from "styled-components";
import { borderedButton, button } from "./variables";

export const GlobalStyles = createGlobalStyle`
    *,
    *::before,
    *::after{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        scroll-behavior: smooth;
        overflow-x: hidden;
        font-family: "Poppins"; 
    }

    body{
        background-color: ${({ theme }) => theme.bgPrimary};
    }

    a{
        text-decoration: none;
    }

    li{
        list-style: none;
    }

    .react-confirm-alert-body{
        background-color: ${({theme}) => theme.bgSecondary};
        color: ${({theme}) => theme.text};
    }

    .react-confirm-alert-overlay{
        background: rgb(165 165 165 / 90%);
    }
    
    .react-confirm-alert-button-group{
        button{
            ${button}
        }
    }
`

