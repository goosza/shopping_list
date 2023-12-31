import classes from "./MyInput.module.css";
import React from "react";

const MyInput = (props) => {
    return (
        <input className={classes.myInput} {...props}/>
    );
};

export default MyInput