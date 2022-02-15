export const TabPanel = (props) => {
    const { children, value, index, id, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`${id}-${index}`}
        aria-labelledby={`${id}-tab-${index}`}
        {...other}
      >
        {value === index && (
          children
        )}
      </div>
    );
  }

export const a11yProps = (index, id) => {
    return {
      id: `${id}-${index}`,
      'aria-controls': `${id}-${index}`,
    };
  }