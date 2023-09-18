export default {
    control: {
      // backgroundColor: '#fff',
      fontSize: 12,
      fontWeight: 'normal',
      height: '100px',
      backgroundColor: `${({theme}) => theme.bgTertiary}`,
      color: `${({theme}) => theme.text}`
    },
  
    '&multiLine': {
      control: {
        fontFamily: 'monospace',
        minHeight: 63,
      },
      highlighter: {
        padding: 9,
        border: '1px solid transparent',
      },
      input: {
        padding: 9,
        border: '1px solid silver',
      },
    },
  
    '&singleLine': {
      display: 'inline-block',
      width: '100%',
  
      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
      input: {
        padding: 1,
        fontSize: '12px',
        border: `1px solid ${({theme}) => theme.text}`,
        color: `${({theme}) => theme.text}`,
        outline: 'none',
      },
    },
  
    suggestions: {
      list: {
        backgroundColor: '#a4a4a4',
        // backgroundColor: `${({theme}) => theme.bgSecondary}`,
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 12,
        textTransform: 'capitalize',
      },
      item: {
        padding: '5px 15px',
        color: `${({theme}) => theme.text}`,
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#e6b7ff', 
        },
      },
    },
  } 