{
    // SITUATION 1
    
    let func;

    {
        let x = 0;
        func = () => {
            return x++;
        }
    }

    console.log(func());
    console.log(func());

}

{
    // SITUATION 2
    
    let func;

    {
        func = () => {
            return x++;
        }
    }

    let x = 3;
    console.log(func());
    console.log(func());

}
