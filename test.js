let aInterger = 10;

/**
 * A testing function.
 */
function aFunction() {
    let bInt = 99;
    /**
     * a inner function.
     */
    function inner() {
        console.log(aInterger);
        console.log(bInt);
    }
    inner();
}

aFunction();
