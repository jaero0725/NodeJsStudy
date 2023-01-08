'use strict';

/*
    javasript is synchronous
    execute the code block by orger after hoisting
    hoisting : var, function 선언이 자동적으로 젤 위로 올라감.

    setTimeout
    ajax 
 */
    console.log('1');

    setTimeout(() => {  
        console.log('2');
    }, 1000);    //callback function

    console.log('3');

    // Synchronous callback
    function printImmediately(print){   
        print();
    }
    printImmediately(()=> console.log('hello')); 

    // Asynchronous callback
    function printWithDelay(print, timeout){
        setTimeout(print, timeout);
    }
    printWithDelay(() => console.log('asnyc callback') , 2000);

    // callback 들로만 만들면안됨 => promise async await

    // callback Hell exmpale


    class UserStorage {
        loginUser(id, password, onSuccess, onError){
            setTimeout(() => {
                if(id ==='choi' && password ==='1234'){
                    onSuccess(id)
                } else{
                    onError(new Error('not found'));
                }
            }, 2000);
        }

        getRoles(user, onSuccess, onError){

        }
    }